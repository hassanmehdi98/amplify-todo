import Amplify, { API, Auth, graphqlOperation, Hub } from "aws-amplify";
import awsExports from "../../aws-exports";
import {
    createTodo,
    deleteTodo,
    markCompleted,
    updateItem,
} from "../../graphql/mutations";
import { listTodos, listTodosByPriority } from "../../graphql/queries";
import {
    onCreateTodo,
    onDeleteTodo,
    onUpdateTodo,
} from "../../graphql/subscriptions";
import {
    GetSubscribedTodoFunction,
    IAuthenticatedUser,
    ICreateTodoListItemInput,
    ISubscriptionObject,
    ITodoList,
    ITodoListItem,
    IUpdateTodoListItemInput,
    TODO,
    TodoListSortDirection,
    TodoListStatus,
} from "./types";

export class AmplifyUtils {
    private constructor() {}

    public static Init(): void {
        Amplify.configure(awsExports);
    }

    public static GetAuthenticatedUser(): Promise<IAuthenticatedUser> {
        return Auth.currentAuthenticatedUser();
    }

    public static async GetSortedPendingTodoList(
        sortDirection: TodoListSortDirection
    ): Promise<ITodoList> {
        const result: any = await API.graphql(
            graphqlOperation(listTodosByPriority, {
                filter: {
                    status: {
                        eq: TodoListStatus.PENDING,
                    },
                },
                type: TODO,
                sortDirection,
            })
        );
        return result.data.listTodosByPriority;
    }

    public static async GetTodoListing(
        status: TodoListStatus = TodoListStatus.PENDING
    ): Promise<ITodoList> {
        const result: any = await API.graphql(
            graphqlOperation(
                listTodos,
                status && {
                    filter: {
                        status: {
                            eq: status,
                        },
                    },
                }
            )
        );

        return result.data.listTodos;
    }

    public static async CreateTodoItem(
        input: ICreateTodoListItemInput
    ): Promise<void> {
        await API.graphql(
            graphqlOperation(createTodo, {
                input: {
                    ...input,
                    status: TodoListStatus.PENDING,
                    type: TODO,
                },
            })
        );
    }

    public static async DeleteTodoItem(id: string): Promise<void> {
        await API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
    }

    public static async UpdateTodoItem(
        id: string,
        input: IUpdateTodoListItemInput
    ): Promise<ITodoListItem> {
        const result: any = await API.graphql(
            graphqlOperation(updateItem, {
                id,
                ...input,
            })
        );

        return result.data.updateItem;
    }

    public static async MarkCompletedTodoItem(
        id: string
    ): Promise<ITodoListItem> {
        const result: any = await API.graphql(
            graphqlOperation(markCompleted, { id })
        );
        return result.data.markCompleted;
    }

    public static CreateTodoItemSubscription(
        owner: string,
        cb: GetSubscribedTodoFunction
    ): ISubscriptionObject {
        const result: any = API.graphql(
            graphqlOperation(onCreateTodo, {
                owner,
            })
        );
        return result.subscribe({
            next: (data: any) => {
                cb(data.value.data.onCreateTodo);
            },
        });
    }

    public static UpdateTodoItemSubscription(
        owner: string,
        cb: GetSubscribedTodoFunction
    ): ISubscriptionObject {
        const result: any = API.graphql(
            graphqlOperation(onUpdateTodo, {
                owner,
            })
        );
        return result.subscribe({
            next: (data: any) => {
                cb(data.value.data.onUpdateTodo);
            },
        });
    }

    public static DeleteTodoItemSubscription(
        owner: string,
        cb: GetSubscribedTodoFunction
    ): ISubscriptionObject {
        const result: any = API.graphql(
            graphqlOperation(onDeleteTodo, {
                owner,
            })
        );
        return result.subscribe({
            next: (data: any) => {
                cb(data.value.data.onDeleteTodo);
            },
        });
    }

    public static async SignOut() {
        await Auth.signOut();
        Hub.dispatch("UI Auth", {
            event: "AuthStateChange",
            message: "signedout",
        });
    }
}
