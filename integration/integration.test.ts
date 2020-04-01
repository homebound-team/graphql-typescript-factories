import { newAuthor } from "./graphql-types";

describe("typescript-factories", () => {
  it("does not infinite loop", () => {
    const a = newAuthor({});
    expect(a.name).toEqual("name");
    expect(a.summary.author).toStrictEqual(a);
  });
});
