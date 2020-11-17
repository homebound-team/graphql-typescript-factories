import { pascalCase, sentenceCase } from "change-case";
import { Code, code, imp } from "ts-poet";
import {
  GraphQLEnumType,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLType,
} from "graphql";
import { PluginFunction, Types } from "@graphql-codegen/plugin-helpers";
import { SymbolSpec } from "ts-poet/build/SymbolSpecs";
import PluginOutput = Types.PluginOutput;

/** Generates `newProject({ ... })` factory functions in our `graphql-types` codegen output. */
export const plugin: PluginFunction = async (schema, documents, config: Config) => {
  const chunks: Code[] = [];

  // Establish defaults for interfaces, i.e. Named --> assume its Author
  const interfaceDefaults: Record<string, string> = {};
  Object.values(schema.getTypeMap()).forEach(type => {
    if (type instanceof GraphQLObjectType) {
      for (const i of type.getInterfaces()) {
        if (interfaceDefaults[i.name] === undefined) {
          interfaceDefaults[i.name] = type.name;
        }
      }
    }
  });

  generateFactoryFunctions(config, schema, interfaceDefaults, chunks);
  generateEnumDetailHelperFunctions(schema, chunks);
  addNextIdMethods(chunks);
  const content = await code`${chunks}`.toStringWithImports();
  return { content } as PluginOutput;
};

function generateFactoryFunctions(
  config: Config,
  schema: GraphQLSchema,
  interfaceDefaults: Record<string, string>,
  chunks: Code[],
) {
  Object.values(schema.getTypeMap()).forEach(type => {
    if (shouldCreateFactory(type)) {
      chunks.push(...newFactory(config, interfaceDefaults, type));
    }
  });
}

/** Makes helper methods to convert the "maybe enum / maybe enum detail" factory options into enum details. */
function generateEnumDetailHelperFunctions(schema: GraphQLSchema, chunks: Code[]) {
  const usedEnumDetailTypes = new Set(
    Object.values(schema.getTypeMap())
      .filter(shouldCreateFactory)
      .flatMap(type => {
        return Object.values(type.getFields())
          .map(f => unwrapNotNull(f.type))
          .filter(isEnumDetailObject);
      }),
  );

  usedEnumDetailTypes.forEach(type => {
    const enumType = getRealEnumForEnumDetailObject(type);
    const enumOrDetail = `${type.name}Options | ${enumType.name} | undefined`;
    chunks.push(code`
      const enumDetailNameOf${enumType.name} = {
        ${enumType
          .getValues()
          .map(v => `${v.value}: "${sentenceCase(v.value)}"`)
          .join(", ")}
      };

      function enumOrDetailOf${enumType.name}(enumOrDetail: ${enumOrDetail}): ${type.name} {
        if (enumOrDetail === undefined) {
          return new${type.name}();
        } else if (typeof enumOrDetail === "object" && "code" in enumOrDetail) {
          return {
            __typename: "${type.name}",
            code: enumOrDetail.code!,
            name: enumDetailNameOf${enumType.name}[enumOrDetail.code!],
            ...enumOrDetail,
          } as ${type.name}
        } else {
          return new${type.name}({
            code: enumOrDetail as ${enumType.name},
            name: enumDetailNameOf${enumType.name}[enumOrDetail as ${enumType.name}],
          });
        }
      }

      function enumOrDetailOrNullOf${enumType.name}(enumOrDetail: ${enumOrDetail} | null): ${type.name} | null {
        if (enumOrDetail === null) {
          return null;
        }
        return enumOrDetailOf${enumType.name}(enumOrDetail);
      }
    `);
  });
}

/** Creates a `new${type}` function for the given `type`. */
function newFactory(config: Config, interfaceDefaults: Record<string, string>, type: GraphQLObjectType): Code[] {
  function generateListField(f: GraphQLField<any, any>, fieldType: GraphQLList<any>): string {
    // If this is a list of objects, initialize it as normal, but then also probe it to ensure each
    // passed-in value goes through `maybeNewFoo` to ensure `__typename` is set, otherwise Apollo breaks.
    if (fieldType.ofType instanceof GraphQLObjectType) {
      const objectType = fieldType.ofType.name;
      return `o.${f.name} = (options.${f.name} ?? []).map(i => maybeNewOrNull${objectType}(i, cache));`;
    } else if (fieldType.ofType instanceof GraphQLNonNull && fieldType.ofType.ofType instanceof GraphQLObjectType) {
      const objectType = fieldType.ofType.ofType.name;
      return `o.${f.name} = (options.${f.name} ?? []).map(i => maybeNew${objectType}(i, cache));`;
    } else {
      return `o.${f.name} = options.${f.name} ?? [];`;
    }
  }

  // Instead of using `DeepPartial`, we make an explicit `AuthorOptions` for each type, primarily
  // b/c the `AuthorOption.books: [BookOption]` will support enum details recursively.
  const optionFields: Code[] = Object.values(type.getFields()).map(f => {
    const fieldType = maybeDenull(f.type);
    if (fieldType instanceof GraphQLObjectType && isEnumDetailObject(fieldType)) {
      const orNull = f.type instanceof GraphQLNonNull ? "" : " | null";
      return code`${f.name}?: ${fieldType.name}Options | ${getRealEnumForEnumDetailObject(fieldType).name}${orNull};`;
    } else if (fieldType instanceof GraphQLObjectType) {
      const orNull = f.type instanceof GraphQLNonNull ? "" : " | null";
      return code`${f.name}?: ${fieldType.name}Options${orNull};`;
    } else if (fieldType instanceof GraphQLList) {
      const keyOrNull = f.type instanceof GraphQLNonNull ? "" : " | null";
      const elementOrNull = fieldType.ofType instanceof GraphQLNonNull ? "" : " | null";
      const elementType = maybeDenull(fieldType.ofType);
      if (elementType instanceof GraphQLObjectType) {
        return code`${f.name}?: Array<${elementType.name}Options${elementOrNull}>${keyOrNull};`;
      } else {
        return code`${f.name}?: ${type.name}["${f.name}"]${keyOrNull};`;
      }
    } else {
      return code`${f.name}?: ${type.name}["${f.name}"];`;
    }
  });

  const factory = code`
    export interface ${type.name}Options {
      __typename?: '${type.name}';
      ${optionFields.join("\n")}
    }

    export function new${type.name}(options: ${type.name}Options = {}, cache: Record<string, any> = {}): ${type.name} {
      const o = cache["${type.name}"] = {} as ${type.name};
      o.__typename = '${type.name}';
      ${Object.values(type.getFields()).map(f => {
        if (f.type instanceof GraphQLNonNull) {
          const fieldType = f.type.ofType;
          if (isEnumDetailObject(fieldType)) {
            const enumType = getRealEnumForEnumDetailObject(fieldType);
            return `o.${f.name} = enumOrDetailOf${enumType.name}(options.${f.name});`;
          } else if (fieldType instanceof GraphQLList) {
            return generateListField(f, fieldType);
          } else if (fieldType instanceof GraphQLObjectType) {
            return `o.${f.name} = maybeNew${fieldType.name}(options.${f.name}, cache);`;
          } else if (fieldType instanceof GraphQLInterfaceType) {
            const implTypeName = interfaceDefaults[fieldType.name] || fail();
            return `o.${f.name} = maybeNew${implTypeName}(options.${f.name}, cache);`;
          } else {
            return code`o.${f.name} = options.${f.name} ?? ${getInitializer(config, type, f, fieldType)};`;
          }
        } else if (f.type instanceof GraphQLObjectType) {
          if (isEnumDetailObject(f.type)) {
            const enumType = getRealEnumForEnumDetailObject(f.type);
            return `o.${f.name} = enumOrDetailOrNullOf${enumType.name}(options.${f.name});`;
          }
          return `o.${f.name} = maybeNewOrNull${(f.type as any).name}(options.${f.name}, cache);`;
        } else if (f.type instanceof GraphQLList) {
          return generateListField(f, f.type);
        } else {
          return `o.${f.name} = options.${f.name} ?? null;`;
        }
      })}
      return o;
    }`;

  const hasIdField = Object.values(type.getFields()).some(f => f.name === "id");

  const maybeFunctions = code`

    function maybeNew${type.name}(value: ${type.name}Options | undefined, cache: Record<string, any>): ${type.name} {
      if (value === undefined) {
        return cache["${type.name}"] || new${type.name}({}, cache)
      } else if (value.__typename) {
        return value as ${type.name};
      } else {
        return new${type.name}(value, cache);
      }
    }
    
    function maybeNewOrNull${type.name}(value: ${type.name}Options | undefined | null, cache: Record<string, any>): ${type.name} | null {
      if (!value) {
        return null;
      } else if (value.__typename) {
        return value as ${type.name};
      } else {
        return new${type.name}(value, cache);
      }
    }`;

  return [factory, ...(isEnumDetailObject(type) ? [] : [maybeFunctions])];
}

/** Returns a default value for the given field's type, i.e. strings are "", ints are 0, arrays are []. */
function getInitializer(
  config: Config,
  object: GraphQLObjectType,
  field: GraphQLField<any, any, any>,
  type: GraphQLOutputType,
): string | Code {
  if (type instanceof GraphQLList) {
    // We could potentially make a dummy entry in every list, but would we risk infinite loops between parents/children?
    return `[]`;
  } else if (type instanceof GraphQLEnumType) {
    return `${type.name}.${pascalCase(type.getValues()[0].value)}`;
  } else if (type instanceof GraphQLScalarType) {
    if (type.name === "Int") {
      return `0`;
    } else if (type.name === "Boolean") {
      return `false`;
    } else if (type.name === "String") {
      const maybeCode = isEnumDetailObject(object) && object.getFields()["code"];
      if (maybeCode) {
        const value = getRealEnumForEnumDetailObject(object).getValues()[0].value;
        return `"${sentenceCase(value)}"`;
      } else {
        return `"${field.name}"`;
      }
    } else if (type.name === "ID") {
      return `nextFactoryId("${object.name}")`;
    }
    const defaultFromConfig = config.scalarDefaults[type.name];
    if (defaultFromConfig) {
      return code`${toImp(defaultFromConfig)}()`;
    }
    return `"" as any`;
  }
  return `undefined as any`;
}

/** Look for the FooDetail/code/name pattern of our enum detail objects. */
function isEnumDetailObject(object: GraphQLOutputType): object is GraphQLObjectType {
  return (
    object instanceof GraphQLObjectType &&
    object.name.endsWith("Detail") &&
    Object.keys(object.getFields()).length >= 2 &&
    !!object.getFields()["code"] &&
    !!object.getFields()["name"]
  );
}

function getRealEnumForEnumDetailObject(detailObject: GraphQLOutputType): GraphQLEnumType {
  return unwrapNotNull((unwrapNotNull(detailObject) as GraphQLObjectType).getFields()["code"]!.type) as GraphQLEnumType;
}

function unwrapNotNull(type: GraphQLOutputType): GraphQLOutputType {
  if (type instanceof GraphQLNonNull) {
    return type.ofType;
  } else {
    return type;
  }
}

function shouldCreateFactory(type: GraphQLNamedType): type is GraphQLObjectType {
  return (
    type instanceof GraphQLObjectType &&
    !type.name.startsWith("__") &&
    type.name !== "Mutation" &&
    type.name !== "Query"
  );
}

function addNextIdMethods(chunks: Code[]): void {
  chunks.push(code`
    let nextFactoryIds: Record<string, number> = {};

    export function resetFactoryIds() {
      nextFactoryIds = {};
    }

    function nextFactoryId(objectName: string): string {
      const nextId = nextFactoryIds[objectName] || 1;
      nextFactoryIds[objectName] = nextId + 1;
      return String(nextId);
    }
  `);
}

function maybeDenull(o: GraphQLOutputType): GraphQLOutputType {
  return o instanceof GraphQLNonNull ? o.ofType : o;
}

/** The config values we read from the graphql-codegen.yml file. */
export type Config = {
  scalarDefaults: Record<string, string>;
};

// Maps the graphql-code-generation convention of `@src/context#Context` to ts-poet's `Context@@src/context`.
export function toImp(spec: string): SymbolSpec {
  const [path, symbol] = spec.split("#");
  return imp(`${symbol}@${path}`);
}

export function fail(message?: string): never {
  throw new Error(message || "Failed");
}
