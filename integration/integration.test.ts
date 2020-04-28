import { newAuthor } from "./graphql-types";

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
});
