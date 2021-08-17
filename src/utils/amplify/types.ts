export const TODO = "Todo";

export interface IAuthenticatedUser {
    username: string;
}

export enum TodoListPriority {
    NORMAL = "NORMAL",
    HIGH = "HIGH",
}

export enum TodoListStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
}

export enum TodoListSortDirection {
    ASC = "ASC",
    DESC = "DESC",
}

export interface ITodoListItem {
    id: string;
    todo: string;
    priority: TodoListPriority;
    status: TodoListStatus;
}

export interface ITodoList {
    items: Array<ITodoListItem>;
    nextToken?: string;
}

export interface ICreateTodoListItemInput {
    todo: string;
    priority: TodoListPriority | string;
}

export interface IUpdateTodoListItemInput {
    todo?: string;
    priority?: TodoListPriority | string;
}

export interface ISubscriptionObject {
    unsubscribe: () => void;
}

export type GetSubscribedTodoFunction = (todo: ITodoListItem) => void;
