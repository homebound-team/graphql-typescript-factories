# Typing Approach

## Why FactoryResult Exists

The generated GraphQL schema types keep `__typename` optional, which is the right default for normal GraphQL data. A server only returns `__typename` when an operation asks for it, and handwritten test data may omit it.

Factories are different: these factories always assign `__typename` at runtime, including nested objects created by other factories. The return type needs to expose that stronger shape so factory results can be assigned to operation/fragment result types that selected `__typename`.

I.e. given a fragment like:

```graphql
fragment SearchResultsDetails on SearchResults {
  result1 {
    __typename
    ... on Book {
      name
    }
  }
}
```

the generated operation type requires `result1.__typename`, but the raw schema type `Book` still has `__typename?: "Book"`. Without `FactoryResult`, `newSearchResults({ result1: { __typename: "Book" } })` looks too weak to TypeScript even though the factory runtime fills in the typename.

`FactoryResult<T>` is a mapped type that keeps the original schema type `T` assignable while strengthening factory-created object fields recursively:

```typescript
type FactoryResult<T> = T extends ReadonlyArray<infer U>
  ? Array<FactoryResult<U>>
  : T extends object
    ? "__typename" extends keyof T
      ? T & Omit<{ [K in keyof T]: FactoryResult<T[K]> }, "__typename"> & {
          __typename: NonNullable<T extends { __typename?: infer N } ? N : never>;
        }
      : T
    : T;
```

## TL;DR of Other Approaches

1. Return the raw schema type, i.e. `newBook(): Book`.

   This was the original behavior, but it loses the fact that factories always set `__typename`. Operation and fragment result types that select `__typename` can require it, so raw schema types with optional `__typename` are not strong enough.

2. Only require the top-level typename.

   A shallow type like `Omit<T, "__typename"> & { __typename: ... }` fixes `newBook()` itself, but not nested factory-created objects. For example, `newAuthor({ books: [{}] }).books[0]` still needs to have a required `Book.__typename` when assigned to a fragment result.

3. Recursively rebuild the object without `T &`.

   Rebuilding every object field gives nested factory-created values stronger typenames, including list element methods like `pop()`. However, because the rebuilt type no longer preserves the original schema type identity, downstream helpers typed as `Book`, `Partial<Book>`, `ProjectItem`, etc. can reject factory results even though they are structurally valid runtime values.

4. Generate concrete per-object factory result types.

   We considered emitting types like `BookFactoryResult`, `AuthorFactoryResult`, and `SearchResultFactoryResult` from the GraphQL schema directly. This is the most explicit approach and avoids some GraphQL Codegen intersection edge cases, but it adds a lot of generated type surface area for a narrow problem.

The current `FactoryResult<T>` is the compromise: it recursively strengthens factory-created nested objects, while intersecting with `T` so factory results remain assignable to raw schema-ish app/test helpers.
