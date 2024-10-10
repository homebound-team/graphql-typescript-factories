import { PluginFunction, Types } from "@graphql-codegen/plugin-helpers";
import { convertFactory, ConvertFn, NamingConvention, RawConfig } from "@graphql-codegen/visitor-plugin-common";
import { sentenceCase } from "change-case";
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
} from "graphql";
import { Code, code, imp, Import, joinCode } from "ts-poet";
import PluginOutput = Types.PluginOutput;

/** Generates `newProject({ ... })` factory functions in our `graphql-types` codegen output. */
export const plugin: PluginFunction = async (schema, documents, config: Config) => {
  const convert = convertFactory(config);

  const chunks: Code[] = [];

  // Create a map of interface -> implementing types
  const interfaceImpls: Record<string, string[]> = {};
  Object.values(schema.getTypeMap()).forEach((type) => {
    if (type instanceof GraphQLObjectType) {
      for (const i of type.getInterfaces()) {
        (interfaceImpls[i.name] ??= []).push(type.name);
      }
    }
  });

  chunks.push(code`const factories: Record<string, Function> = {}`);

  const hasFactories = generateFactoryFunctions(config, convert, schema, interfaceImpls, chunks);
  generateInterfaceFactoryFunctions(config, interfaceImpls, chunks);
  generateEnumDetailHelperFunctions(config, schema, chunks);
  addNextIdMethods(chunks, config);
  generateMaybeFunctions(chunks);

  if (!hasFactories) {
    chunks.push(
      code`// No factories found, make sure your node_modules does not have multiple versions of the 'graphql' library`,
    );
  }

  const content = await code`${chunks}`.toString();
  return { content } as PluginOutput;
};

function generateFactoryFunctions(
  config: Config,
  convertFn: ConvertFn,
  schema: GraphQLSchema,
  interfaceImpls: Record<string, string[]>,
  chunks: Code[],
): boolean {
  let hasFactories = false;
  Object.values(schema.getTypeMap()).forEach((type) => {
    if (shouldCreateFactory(type)) {
      chunks.push(newFactory(config, convertFn, interfaceImpls, type));
      hasFactories = true;
    }
  });
  return hasFactories;
}

function generateInterfaceFactoryFunctions(config: Config, interfaceImpls: Record<string, string[]>, chunks: Code[]) {
  Object.entries(interfaceImpls).forEach(([interfaceName, impls]) => {
    chunks.push(...newInterfaceFactory(config, interfaceName, impls));
  });
}

/** Makes helper methods to convert the "maybe enum / maybe enum detail" factory options into enum details. */
function generateEnumDetailHelperFunctions(config: Config, schema: GraphQLSchema, chunks: Code[]) {
  const usedEnumDetailTypes = new Set(
    Object.values(schema.getTypeMap())
      .filter(shouldCreateFactory)
      .flatMap((type) => {
        return Object.values(type.getFields())
          .map((f) => unwrapNullsAndLists(f.type))
          .filter(isEnumDetailObject);
      }),
  );

  usedEnumDetailTypes.forEach((type) => {
    const enumType = getRealEnumForEnumDetailObject(type);
    const scopedEnumTypeName = maybeImport(config, enumType.name);
    const scopedTypeName = maybeImport(config, type.name);

    const enumOrDetail = code`${type.name}Options | ${scopedEnumTypeName} | undefined`;
    chunks.push(code`
      const enumDetailNameOf${enumType.name} = {
        ${enumType
          .getValues()
          .map((v) => `${v.value}: "${sentenceCase(v.value)}"`)
          .join(", ")}
      };

      function enumOrDetailOf${enumType.name}(enumOrDetail: ${enumOrDetail}): ${scopedTypeName} {
        if (enumOrDetail === undefined) {
          return new${type.name}();
        } else if (typeof enumOrDetail === "object" && "code" in enumOrDetail) {
          return {
            __typename: "${type.name}",
            code: enumOrDetail.code!,
            name: enumDetailNameOf${enumType.name}[enumOrDetail.code!],
            ...enumOrDetail,
          } as ${scopedTypeName}
        } else {
          return new${type.name}({
            code: enumOrDetail as ${scopedEnumTypeName},
            name: enumDetailNameOf${enumType.name}[enumOrDetail as ${scopedEnumTypeName}],
          });
        }
      }

      function enumOrDetailOrNullOf${enumType.name}(enumOrDetail: ${enumOrDetail} | null): ${scopedTypeName} | null {
        if (enumOrDetail === null) {
          return null;
        }
        return enumOrDetailOf${enumType.name}(enumOrDetail);
      }
    `);
  });
}

/** Creates a `new${type}` function for the given `type`. */
function newFactory(
  config: Config,
  convertFn: ConvertFn,
  interfaceImpls: Record<string, string[]>,
  type: GraphQLObjectType,
): Code {
  const scopedName = maybeImport(config, type.name);

  function generateListField(f: GraphQLField<any, any>, fieldType: GraphQLList<any>): string {
    // If this is a list of objects, initialize it as normal, but then also probe it to ensure each
    // passed-in value goes through `maybeNew` to ensure `__typename` is set, otherwise Apollo breaks.
    if (isEnumDetailObject(fieldType.ofType.ofType)) {
      const enumType = getRealEnumForEnumDetailObject(fieldType.ofType.ofType);
      return `o.${f.name} = (options.${f.name} ?? []).map(i => enumOrDetailOf${enumType.name}(i));`;
    } else if (fieldType.ofType instanceof GraphQLObjectType || fieldType.ofType instanceof GraphQLInterfaceType) {
      const objectType = fieldType.ofType.name;
      return `o.${f.name} = (options.${f.name} ?? []).map(i => maybeNewOrNull("${objectType}", i, cache));`;
    } else if (
      fieldType.ofType instanceof GraphQLNonNull &&
      (fieldType.ofType.ofType instanceof GraphQLObjectType || fieldType.ofType.ofType instanceof GraphQLInterfaceType)
    ) {
      const objectType = fieldType.ofType.ofType.name;
      return `o.${f.name} = (options.${f.name} ?? []).map(i => maybeNew("${objectType}", i, cache, options.hasOwnProperty("${f.name}")));`;
    } else {
      return `o.${f.name} = options.${f.name} ?? [];`;
    }
  }

  // Instead of using `DeepPartial`, we make an explicit `AuthorOptions` for each type, primarily
  // b/c the `AuthorOption.books: [BookOption]` will support enum details recursively.
  const optionFields: Code[] = Object.values(type.getFields()).map((f) => {
    const fieldType = maybeDenull(f.type);
    const orNull = f.type instanceof GraphQLNonNull ? "" : " | null";

    if (fieldType instanceof GraphQLObjectType && isEnumDetailObject(fieldType)) {
      return code`${f.name}?: ${fieldType.name}Options | ${getRealImportedEnum(config, fieldType)}${orNull};`;
    } else if (fieldType instanceof GraphQLObjectType || fieldType instanceof GraphQLInterfaceType) {
      return code`${f.name}?: ${fieldType.name}Options${orNull};`;
    } else if (fieldType instanceof GraphQLList) {
      const elementType = maybeDenull(fieldType.ofType);
      if (elementType instanceof GraphQLObjectType || elementType instanceof GraphQLInterfaceType) {
        const isNonNull = fieldType.ofType instanceof GraphQLNonNull;
        const optionsType = code`${elementType.name}Options`;
        const maybeMaybeOptionsType = isNonNull ? optionsType : code`${maybeImport(config, "Maybe")}<${optionsType}>`;
        return code`${f.name}?: Array<${maybeMaybeOptionsType}>${orNull};`;
      } else {
        return code`${f.name}?: ${scopedName}["${f.name}"]${orNull};`;
      }
    } else {
      return code`${f.name}?: ${scopedName}["${f.name}"];`;
    }
  });

  const typeImp = maybeImport(config, type.name);

  const factory = code`
    export interface ${type.name}Options {
      __typename?: '${type.name}';
      ${joinCode(optionFields, { on: "\n" })}
    }

    export function new${type.name}(options: ${type.name}Options = {}, cache: Record<string, any> = {}): ${typeImp} {
      const o = (options.__typename ? options : cache["${type.name}"] = {}) as ${typeImp};
      (cache.all ??= new Set()).add(o);
      o.__typename = '${type.name}';
      ${Object.values(type.getFields()).map((f) => {
        if (f.type instanceof GraphQLNonNull) {
          const fieldType = f.type.ofType;
          if (isEnumDetailObject(fieldType)) {
            const enumType = getRealEnumForEnumDetailObject(fieldType);
            return `o.${f.name} = enumOrDetailOf${enumType.name}(options.${f.name});`;
          } else if (fieldType instanceof GraphQLList) {
            return generateListField(f, fieldType);
          } else if (fieldType instanceof GraphQLObjectType) {
            return `o.${f.name} = maybeNew("${fieldType.name}", options.${f.name}, cache, options.hasOwnProperty("${f.name}"));`;
          } else if (fieldType instanceof GraphQLInterfaceType) {
            // Default to the first type which happens to implement the interface
            const implTypeName = interfaceImpls[fieldType.name][0] || fail();
            return `o.${f.name} = maybeNew("${implTypeName}", options.${f.name}, cache, options.hasOwnProperty("${f.name}"));`;
          } else {
            return code`o.${f.name} = options.${f.name} ?? ${getInitializer(config, convertFn, type, f, fieldType)};`;
          }
        } else if (f.type instanceof GraphQLObjectType) {
          if (isEnumDetailObject(f.type)) {
            const enumType = getRealEnumForEnumDetailObject(f.type);
            return `o.${f.name} = enumOrDetailOrNullOf${enumType.name}(options.${f.name});`;
          }
          return `o.${f.name} = maybeNewOrNull("${(f.type as any).name}", options.${f.name}, cache);`;
        } else if (f.type instanceof GraphQLInterfaceType) {
          if (isEnumDetailObject(f.type)) {
            const enumType = getRealEnumForEnumDetailObject(f.type);
            return `o.${f.name} = enumOrDetailOrNullOf${enumType.name}(options.${f.name});`;
          }
          return `o.${f.name} = maybeNewOrNull("${(f.type as any).name}", options.${f.name}, cache);`;
        } else if (f.type instanceof GraphQLList) {
          return generateListField(f, f.type);
        } else {
          return `o.${f.name} = options.${f.name} ?? null;`;
        }
      })}
      return o;
    }

    factories["${type.name}"] = new${type.name};
  `;

  return factory;
}

function generateMaybeFunctions(chunks: Code[]): void {
  const maybeFunctions = code`
    function maybeNew(type: string, value: { __typename?: string } | object | undefined, cache: Record<string, any>, isSet: boolean = false): any {
      if (value === undefined) {
        return isSet ? undefined : cache[type] || factories[type]({}, cache)
      } else if ("__typename" in value && value.__typename) {
        return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
      } else {
        return factories[type](value, cache);
      }
    }

    function maybeNewOrNull(type: string, value: { __typename?: string } | object | undefined | null, cache: Record<string, any>): any {
      if (!value) {
        return null;
      } else if ("__typename" in value && value.__typename) {
        return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
      } else {
        return factories[type](value, cache);
      }
    }`;
  chunks.push(maybeFunctions);
}

/** Creates a `new${type}` function for the given `type`. */
function newInterfaceFactory(config: Config, interfaceName: string, impls: string[]): Code[] {
  const defaultImpl = impls[0] || fail(`Interface ${interfaceName} is unused`);

  return [
    code`
      export type ${interfaceName}Options = ${impls.map((name) => `${name}Options`).join(" | ")};
    `,

    code`
      export type ${interfaceName}Type = ${joinCode(
        impls.map((type) => maybeImport(config, type)),
        { on: " | " },
      )};
    `,

    code`
      export type ${interfaceName}TypeName = ${impls.map((n) => `"${n}"`).join(" | ")};
    `,

    code`
      factories["${interfaceName}"] = new${defaultImpl};
    `,
  ];
}

/** Returns a default value for the given field's type, i.e. strings are "", ints are 0, arrays are []. */
function getInitializer(
  config: Config,
  convertFn: ConvertFn,
  object: GraphQLObjectType,
  field: GraphQLField<any, any, any>,
  type: GraphQLOutputType,
): string | Code {
  if (type instanceof GraphQLList) {
    // We could potentially make a dummy entry in every list, but would we risk infinite loops between parents/children?
    return `[]`;
  } else if (type instanceof GraphQLEnumType) {
    const defaultEnumValue = type.getValues()[0];
    // The default behavior of graphql-codegen is that enums do drop underscores, but
    // type names don't; emulate that by passing `transformUnderscore` here. If the user
    // _does_ have it overridden in their config, then that causes enums & types to be
    // treated exactly the same.
    //
    // Todo: we should also check `ignoreEnumValuesFromSchema` and `enumValues` in the config:
    // https://github.com/dotansimha/graphql-code-generator/blob/master/packages/plugins/other/visitor-plugin-common/src/base-types-visitor.ts#L921
    const name = convertFn(defaultEnumValue.astNode || defaultEnumValue.value, { transformUnderscore: true });
    return code`${maybeImport(config, type.name)}.${name}`;
  } else if (type instanceof GraphQLScalarType) {
    if (type.name === "Int") {
      return `0`;
    } else if (type.name === "Boolean") {
      return `false`;
    } else if (field.name === "id" && type.name === "ID") {
      // Only call for the `id` field, since we don't want to generate new IDs if the object contains other ID fields
      return `nextFactoryId("${object.name}")`;
    } else if (type.name === "String" || type.name === "ID") {
      // Treat String and ID fields the same, as long as it is not the `id: ID` field
      const maybeCode = isEnumDetailObject(object) && object.getFields()["code"];
      if (maybeCode) {
        const value = getRealEnumForEnumDetailObject(object).getValues()[0].value;
        return `"${sentenceCase(value)}"`;
      } else {
        return `"${field.name}"`;
      }
    }
    const defaultFromConfig = config.scalarDefaults?.[type.name];
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

function getRealImportedEnum(config: Config, detailObject: GraphQLOutputType): Code {
  return maybeImport(config, getRealEnumForEnumDetailObject(detailObject).name);
}

function unwrapNotNull(type: GraphQLOutputType): GraphQLOutputType {
  if (type instanceof GraphQLNonNull) {
    return type.ofType;
  } else {
    return type;
  }
}

/** Unwrap `Foo!` -> `Foo` and `[Foo!]!` -> `Foo`. */
function unwrapNullsAndLists(type: GraphQLOutputType): GraphQLOutputType {
  if (type instanceof GraphQLNonNull) {
    type = type.ofType;
  }
  if (type instanceof GraphQLList) {
    type = type.ofType;
  }
  if (type instanceof GraphQLNonNull) {
    type = type.ofType;
  }
  return type;
}

function shouldCreateFactory(type: GraphQLNamedType): type is GraphQLObjectType {
  return (
    type instanceof GraphQLObjectType &&
    !type.name.startsWith("__") &&
    type.name !== "Mutation" &&
    type.name !== "Query"
  );
}

function addNextIdMethods(chunks: Code[], config: Config): void {
  chunks.push(code`
    const taggedIds: Record<string, string> = ${config.taggedIds || "{}"};
    let nextFactoryIds: Record<string, number> = {};

    export function resetFactoryIds() {
      nextFactoryIds = {};
    }

    function nextFactoryId(objectName: string): string {
      const nextId = nextFactoryIds[objectName] || 1;
      nextFactoryIds[objectName] = nextId + 1;
      const tag = taggedIds[objectName] ?? objectName.replace(/[a-z]/g, "").toLowerCase();
      return tag + ":" + nextId;
    }
  `);
}

function maybeImport(config: Config, typeName: string): Code {
  return code`${!!config.typesFilePath ? imp(`${typeName}@${config.typesFilePath}`) : typeName}`;
}

function maybeDenull(o: GraphQLOutputType): GraphQLOutputType {
  return o instanceof GraphQLNonNull ? o.ofType : o;
}

/** The config values we read from the graphql-codegen.yml file. */
export type Config = RawConfig & {
  scalarDefaults?: Record<string, string>;
  taggedIds?: Record<string, string>;
  typesFilePath?: string;
  namingConvention?: NamingConvention;
};

// Maps the graphql-code-generation convention of `@src/context#Context` to ts-poet's `Context@@src/context`.
export function toImp(spec: string): Import {
  const [path, symbol] = spec.split("#");
  return imp(`${symbol}@${path}`);
}

export function fail(message?: string): never {
  throw new Error(message || "Failed");
}
