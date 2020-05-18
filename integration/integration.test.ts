import { newAuthor, resetFactoryIds } from "./graphql-types";

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
    expect(a1.id).toEqual("1");
    expect(a2.id).toEqual("2");
    resetFactoryIds();
    const a3 = newAuthor({});
    expect(a3.id).toEqual("1");
  });
});
