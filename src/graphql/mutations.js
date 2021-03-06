/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateItem = /* GraphQL */ `
  mutation UpdateItem($id: String!, $todo: String, $priority: Priority) {
    updateItem(id: $id, todo: $todo, priority: $priority) {
      id
      todo
      priority
      status
    }
  }
`;
export const markCompleted = /* GraphQL */ `
  mutation MarkCompleted($id: String!) {
    markCompleted(id: $id) {
      id
      todo
      priority
      status
    }
  }
`;
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      todo
      priority
      type
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      todo
      priority
      type
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      todo
      priority
      type
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
