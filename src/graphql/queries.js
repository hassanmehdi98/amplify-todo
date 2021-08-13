/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      todo
      priority
      type
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        todo
        priority
        type
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const listTodosByPriority = /* GraphQL */ `
  query ListTodosByPriority(
    $type: String
    $priority: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodosByPriority(
      type: $type
      priority: $priority
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        todo
        priority
        type
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;