import { jan1 } from "./testData";
import {
  newAuthor,
  newAuthorSummary,
  newBook,
  newCalendarInterval,
  newChild,
  Popularity,
  resetFactoryIds,
} from "./graphql-types";

describe("typescript-factories", () => {
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
});
