# graphq-typescript-factories

This project generates `new${GraphQLObjectType}` factory methods for use in client-side GraphQL tests that are stubbing/mocking out GraphQL responses.

This project is run as a `graphql-code-generator` plugin, i.e. the additional `newXxx` factory methods will be added to the regular `graphql-types.tsx` output file.

## Enum Details

We've added first-class handling of our "Enum Detail" pattern, where any GraphQL object that has exactly two fields, named `code` and `name`, will be assumed to be an Enum Detail wrapper.

Once recognized, we add some syntax sugar that allows creating objects with the enum itself as a shortcut, i.e.:

```typescript
const employee = newEmployee({
  status: EmployeeStatus.FULL_TIME,
});
```

Will work even if `status` is technically a `EmployeeStatusDetail` object and not the `EmployeeStatus` enum directly.

## Todo

- Accept an options hash
- Support "number of children"
- Detect and stop infinite recursion
- Support customizations like "if building DAG, reuse same project vs. make new project teach time"
- Support providing a level of the DAG N-levels away (i.e. "create project but use this for the task")
