import { API, graphqlOperation } from "aws-amplify";
import { Priority } from "../constants";
import { createTodo, deleteTodo, updateItem } from "../graphql/mutations";
import { listTodos, listTodosByPriority } from "../graphql/queries";
import {
    onCreateTodo,
    onDeleteTodo,
    onUpdateTodo,
} from "../graphql/subscriptions";

export const getSortedTodoListingByPriorityQuery = (sortDirection) => {
    return API.graphql(
        graphqlOperation(listTodosByPriority, { type: "Todo", sortDirection })
    );
};

export const getTodoListingQuery = () => {
    return API.graphql(graphqlOperation(listTodos));
};

export const createTodoQuery = (data) => {
    return API.graphql(
        graphqlOperation(createTodo, {
            input: {
                type: "Todo",
                todo: data.todo,
                priority: data.priority || Priority.NORMAL,
            },
        })
    );
};

export const deleteTodoQuery = (id) => {
    return API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
};

export const updateTodoQuery = (id, data) => {
    return API.graphql(
        graphqlOperation(updateItem, {
            id,
            todo: data.todo,
            priority: data.priority,
        })
    );
};

export const createTodoSubscription = (owner, cb) => {
    return API.graphql(graphqlOperation(onCreateTodo, { owner })).subscribe({
        next: (data) => {
            const todo = data.value.data.onCreateTodo;
            cb(todo);
        },
    });
};

export const updateTodoSubscription = (owner, cb) => {
    return API.graphql(graphqlOperation(onUpdateTodo, { owner })).subscribe({
        next: (data) => {
            const todo = data.value.data.onUpdateTodo;
            cb(todo);
        },
    });
};

export const deleteTodoSubscription = (owner, cb) => {
    return API.graphql(graphqlOperation(onDeleteTodo, { owner })).subscribe({
        next: (data) => {
            const todo = data.value.data.onDeleteTodo;
            cb(todo);
        },
    });
};
