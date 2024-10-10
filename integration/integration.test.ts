import { jan1 } from "./testData";

import * as TypesAndFactories from "./graphql-types-and-factories";
import * as TypesOnly from "./graphql-types-only";
import * as FactoriesOnly from "./graphql-type-factories";
import * as TypesAndFactoriesWithEnumMapping from "./graphql-types-and-factories-with-enum-mapping";

type TestType = "types-imported" | "types-in-file" | "types-in-file-with-enum-mapping";

type TestObject = {
  newAuthor: (src?: any) => any;
  newAuthorSummary: (src?: any) => any;
  newBook: (src?: any) => any;
  newCalendarInterval: (src?: any) => any;
  newChild: (src?: any) => any;
  Popularity: any;
  resetFactoryIds: () => void;
  newSearchResults: (src: any) => any;
};

const getTestObjects = (testType: TestType): TestObject => {
  if (testType === "types-imported") {
    return { ...TypesOnly, ...FactoriesOnly };
  } else if (testType === "types-in-file") {
    return TypesAndFactories;
  } else if (testType === "types-in-file-with-enum-mapping") {
    return TypesAndFactoriesWithEnumMapping;
  } else {
    throw `Unsupported test type parameter provided: ${testType}`;
  }
};

const testLabels: { [key in TestType]: string } = {
  "types-imported": "Types and Factories in separate files",
  "types-in-file": "Types and Factories in a shared file",
  "types-in-file-with-enum-mapping": "Types and Factories in a shared file with enum mapping",
};

const getTests = (testType: TestType = "types-in-file") => {
  const testLabel = testLabels[testType];

  const runReferenceTests = ({
    newAuthor,
    newAuthorSummary,
    newBook,
    newCalendarInterval,
    newChild,
    Popularity,
    resetFactoryIds,
    newSearchResults,
  }: TestObject) => {
    it("does not infinite loop", () => {
      const a = newAuthor({});
      expect(a.name).toEqual("name");
      expect(a.summary.author).toStrictEqual(a);
    });

    it("auto-factories children", () => {
      const a = newAuthor({
        summary: { amountOfSales: 100 },
        books: [{ name: "b1" }],
      });
      expect(a.__typename).toEqual("Author");
      expect(a.summary.__typename).toEqual("AuthorSummary");
      expect(a.books[0].__typename).toEqual("Book");
    });

    it("creates unique ids", () => {
      resetFactoryIds();
      const a1 = newAuthor({});
      const a2 = newAuthor({});
      expect(a1.id).toEqual("a:1");
      expect(a2.id).toEqual("a:2");
      // And does not assign other ID fields with author ids
      expect(a1.anotherId).toEqual("anotherId");
      expect(a2.anotherId).toEqual("anotherId");
      resetFactoryIds();
      const a3 = newAuthor({});
      expect(a3.id).toEqual("a:1");
    });

    it("creates tagged ids based on config", () => {
      resetFactoryIds();
      const as = newAuthorSummary({});
      expect(as.id).toEqual("summary:1");
    });

    it("fills in type name of enums", () => {
      const a = newAuthor({ popularity: { code: Popularity.Low } });
      expect(a.popularity.__typename).toEqual("PopularityDetail");
      expect(a.popularity.name).toEqual("Low");
    });

    it("accepts codes for enum details when nested", () => {
      const a = newAuthor({ books: [{ popularity: Popularity.Low }] });
      expect(a.books[0].popularity?.name).toEqual("Low");
    });

    it("can accept types as options with nullable references", () => {
      const book = newBook();
      const a = newAuthor({ books: [book] });
    });

    it("can have defaults for custom scalars", () => {
      const a = newCalendarInterval();
      expect(a.start).toEqual(jan1);
      expect(a.end).toEqual(jan1);
    });

    it("picks the 1st impl of an interface", () => {
      const c = newChild();
      expect((c.parent as any).__typename).toEqual("Author");
    });

    it("keeps property as undefined if option is explicitly set to undefined", () => {
      const a = newAuthor({ summary: undefined });
      expect(a.__typename).toEqual("Author");
      expect(a.summary).toBeUndefined();
    });

    it("generates property if option is not passed", () => {
      const a = newAuthor({});
      expect(a.summary.__typename).toEqual("AuthorSummary");
    });

    it("cascades into children that are existing entities", () => {
      // Given an existing factory-created instance
      const a = newAuthor({});
      // When create a new instance
      const sr = newSearchResults({
        result3: {
          // And we destructure the existing instance
          ...a,
          // And override with some partial data
          books: [{}],
        },
      });
      // Then the books children have typename set
      expect(sr.result3!.books[0].__typename).toEqual("Book");
    });
  };

  return describe(testLabel, () => {
    runReferenceTests(getTestObjects(testType));
  });
};

describe("typescript-factories", () => {
  getTests("types-in-file");
  getTests("types-imported");
  getTests("types-in-file-with-enum-mapping");
});

describe("enum mapping", () => {
  it("defaults to pascal case", () => {
    // Given the value of BookStatus.InProgress is pascal cased
    const ip = TypesAndFactories.BookStatus.InProgress;
    // Then our factory uses it
    const b = TypesAndFactories.newBook();
    expect(b.status).toEqual(ip);
  });

  it("respects enumValues=keep", () => {
    // Given the value of Working.NO is kept upper-cased
    const no = TypesAndFactoriesWithEnumMapping.Working.NO;
    // Then our factory uses it
    const wd = TypesAndFactoriesWithEnumMapping.newWorkingDetail();
    expect(wd.code).toEqual(no);
  });
});
