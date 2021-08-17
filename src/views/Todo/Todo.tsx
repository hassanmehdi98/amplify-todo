import React, { useEffect, useState } from "react";
import TodoList from "./TodoList";
import { Priority } from "../../constants";
import { Button, Col, Container, Form, Row } from "reactstrap";
import Styled from "styled-components";
import { CustomButton } from "../../components/Button";
import { AppHeader } from "../../components/Header";
import { CustomInput } from "../../components/Input";
import {
    AmplifyUtils,
    IAuthenticatedUser,
    ISubscriptionObject,
    ITodoList,
    ITodoListItem as ITodoListItemDefault,
    TodoListSortDirection,
    TodoListStatus,
} from "../../utils/amplify";

export type ActionsLoaderData = {
    [x: string]: {
        isEditing: boolean;
        isDeleting: boolean;
        isCompleting: boolean;
    };
};

type ITodoListItem = ITodoListItemDefault & { __isNew?: boolean };

const Heading = Styled.h2``;

const Todo = (): JSX.Element => {
    const [todoText, setTodoText] = useState<string>("");
    const [todoList, setTodoList] = useState<Array<ITodoListItem>>([]);
    const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
    const [fetching, setFetching] = useState<boolean>(false);
    const [requestSubmitting, setRequestSubmitting] = useState<boolean>(false);
    const [priority, setPriority] = useState<string>(Priority.NORMAL);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const [completedTodoList, setCompletedTodoList] = useState<
        Array<ITodoListItem>
    >([]);
    const [completedTodoFetching, setCompletedTodoFetching] =
        useState<boolean>(false);
    const [actionLoaders, setActionLoaders] = useState<ActionsLoaderData | {}>(
        {}
    );

    const [user, setUser] = useState<IAuthenticatedUser | null>(null);

    useEffect(() => {
        getUser();
        getTodoList();
        getCompletedTodoList();
    }, []);

    useEffect(() => {
        if (user) {
            // const createTodoListener = createTodoSubscription(
            //     user.username,
            //     (todo) => {
            //         setActionLoaders((prev) => {
            //             const newData = { ...prev };
            //             newData[todo.id] = {
            //                 isEditing: false,
            //                 isDeleting: false,
            //                 isCompleting: false,
            //             };
            //             return newData;
            //         });
            //         setTodoList((prev) => [...prev, todo]);
            //     }
            // );

            const createTodoListener: ISubscriptionObject =
                AmplifyUtils.CreateTodoItemSubscription(
                    user.username,
                    (todo: ITodoListItem) => {
                        setActionLoaders((prev) => {
                            const newData: ActionsLoaderData = { ...prev };
                            newData[todo.id] = {
                                isEditing: false,
                                isDeleting: false,
                                isCompleting: false,
                            };
                            return newData;
                        });
                        setTodoList((prev) => [...prev, todo]);
                    }
                );

            // const updateTodoListener = updateTodoSubscription(
            //     user.username,
            //     (updatedTodo) => {
            //         const newTodos = [...todoList];
            //         const index = newTodos.findIndex(
            //             (todo) => todo.id === updatedTodo.id
            //         );
            //         newTodos[index] = updatedTodo;
            //         setTodoList(newTodos);
            //     }
            // );

            const updateTodoListener: ISubscriptionObject =
                AmplifyUtils.UpdateTodoItemSubscription(
                    user.username,
                    (updatedTodo: ITodoListItem) => {
                        const newTodos: Array<ITodoListItem> = [...todoList];
                        const index = newTodos.findIndex(
                            (todo) => todo.id === updatedTodo.id
                        );
                        newTodos[index] = updatedTodo;
                        setTodoList(newTodos);
                    }
                );

            // const deleteTodoListener = deleteTodoSubscription(
            //     user.username,
            //     (deletedTodo) => {
            //         const newTodos = todoList.filter(
            //             (todo) => todo.id !== deletedTodo.id
            //         );
            //         setTodoList(newTodos);
            //     }
            // );

            const deleteTodoListener: ISubscriptionObject =
                AmplifyUtils.DeleteTodoItemSubscription(
                    user.username,
                    (deletedTodo: ITodoListItem) => {
                        const newTodos: Array<ITodoListItem> = todoList.filter(
                            (todo) => todo.id !== deletedTodo.id
                        );
                        setTodoList(newTodos);
                    }
                );

            return () => {
                createTodoListener.unsubscribe();
                updateTodoListener.unsubscribe();
                deleteTodoListener.unsubscribe();
            };
        }
    }, [todoList, user]);

    useEffect(() => {
        if (selectedTodoId) {
            const todo: ITodoListItem | undefined = todoList.find(
                (todo) => todo.id === selectedTodoId
            );
            if (todo) {
                setTodoText(todo.todo);
                setPriority(todo.priority);
            }
        }
    }, [selectedTodoId, todoList]);

    const getTodoList = async (): Promise<void> => {
        setFetching(true);
        try {
            const result: ITodoList =
                await AmplifyUtils.GetSortedPendingTodoList(
                    TodoListSortDirection.ASC
                );
            const todos: Array<ITodoListItem> = result.items;
            setTodoList(todos);
            const actionLoadersData: ActionsLoaderData = {};
            todos.forEach((todo) => {
                actionLoadersData[todo.id] = {
                    isEditing: false,
                    isDeleting: false,
                    isCompleting: false,
                };
            });
            setActionLoaders(actionLoadersData);
            // const result = await getSortedTodoListingByPriorityQuery(
            //     SortDirection.ASC
            // );
            // const todos = result.data.listTodosByPriority.items;
            // setTodoList(todos);
            // const actionLoadersData = {};
            // todos.forEach((todo) => {
            //     actionLoadersData[todo.id] = {
            //         isEditing: false,
            //         isDeleting: false,
            //         isCompleting: false,
            //     };
            // });
            // setActionLoaders(actionLoadersData);
        } catch (err) {
            console.log(err);
        } finally {
            setFetching(false);
        }
    };

    const getCompletedTodoList = async (): Promise<void> => {
        setCompletedTodoFetching(true);
        try {
            // const result = await getTodoListingQuery(Status.COMPLETED);
            // const completedTodos = result.data.listTodos.items;
            // setCompletedTodoList(completedTodos);
            const result: ITodoList = await AmplifyUtils.GetTodoListing(
                TodoListStatus.COMPLETED
            );
            const todos: Array<ITodoListItem> = result.items;
            setCompletedTodoList(todos);
        } catch (err) {
            console.log(err);
        } finally {
            setCompletedTodoFetching(false);
        }
    };

    const getUser = async () => {
        // const user = await getCurrentUser();
        const user: IAuthenticatedUser =
            await AmplifyUtils.GetAuthenticatedUser();
        setUser(user);
    };

    const renderPriorityOptionsList = (): Array<JSX.Element> => {
        return Object.keys(Priority).map((key) => (
            <option key={key} value={Priority[key]}>
                {key}
            </option>
        ));
    };

    const renderButtonLoader = (): JSX.Element => (
        <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
        ></span>
    );

    const isEditMode = (): boolean => (selectedTodoId ? true : false);

    const handleTodoTextChange = (e: any): void => setTodoText(e.target.value);
    const handlePriorityChange = (e: any): void => setPriority(e.target.value);

    const handleDeleteTodo = async (id: string): Promise<void> => {
        setDeletingLoader(id, true);
        try {
            // await deleteTodoQuery(id);
            await AmplifyUtils.DeleteTodoItem(id);
        } catch (err) {
            console.log(err);
        } finally {
            setDeletingLoader(id, false);
        }
    };

    const handleMarkCompleted = async (id: string): Promise<void> => {
        setCompletingLoader(id, true);
        try {
            // const data = await markCompletedQuery(id);
            // const result = data.data.markCompleted;
            const result: ITodoListItem =
                await AmplifyUtils.MarkCompletedTodoItem(id);
            const todos: Array<ITodoListItem> = [
                ...completedTodoList,
                {
                    id: result.id,
                    todo: result.todo,
                    priority: result.priority,
                    status: result.status,
                    __isNew: true,
                },
            ];
            const pendingTodos: Array<ITodoListItem> = [...todoList].filter(
                (todo) => todo.id !== result.id
            );
            setCompletedTodoList(todos);
            setTodoList(pendingTodos);
            setTimeout(() => {
                setCompletedTodoList((prev) => {
                    const updatedTodos: Array<ITodoListItem> = [...prev];
                    const updatedTodo = updatedTodos.find(
                        (t) => t.id === result.id
                    );
                    if (updatedTodo?.__isNew) {
                        delete updatedTodo.__isNew;
                    }
                    return updatedTodos;
                });
            }, 500);
        } catch (err) {
            console.log(err);
        } finally {
            setCompletingLoader(id, false);
        }
    };

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        try {
            // await signOut();
            await AmplifyUtils.SignOut();
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const setEditingLoader = (id: string, value: boolean) => {
        setActionLoaders((prev) => {
            const newData: ActionsLoaderData = { ...prev };
            newData[id].isEditing = value;
            return newData;
        });
    };

    const setDeletingLoader = (id: string, value: boolean) => {
        setActionLoaders((prev) => {
            const newData: ActionsLoaderData = { ...prev };
            newData[id].isDeleting = value;
            return newData;
        });
    };

    const setCompletingLoader = (id: string, value: boolean) => {
        setActionLoaders((prev) => {
            const newData: ActionsLoaderData = { ...prev };
            newData[id].isCompleting = value;
            return newData;
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setRequestSubmitting(true);
        try {
            if (isEditMode()) {
                const id: string = selectedTodoId as string;
                setEditingLoader(id, true);
                // const result = await updateTodoQuery(id, {
                //     todo: todoText,
                //     priority,
                // });
                const result: ITodoListItem = await AmplifyUtils.UpdateTodoItem(
                    id,
                    {
                        todo: todoText,
                        priority: priority,
                    }
                );
                const newTodos: Array<ITodoListItem> = [...todoList];
                const updatedTodo = newTodos.find((todo) => todo.id === id);
                if (updatedTodo) {
                    updatedTodo.todo = result.todo;
                    updatedTodo.priority = result.priority;
                }

                setEditingLoader(id, false);
                setSelectedTodoId(null);
                setTodoText("");
                setTodoList(newTodos);
                setPriority(Priority.NORMAL);
            } else {
                // await createTodoQuery({
                //     todo: todoText,
                //     priority,
                // });
                await AmplifyUtils.CreateTodoItem({
                    todo: todoText,
                    priority: priority,
                });
                setTodoText("");
                setPriority(Priority.NORMAL);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setRequestSubmitting(false);
        }
    };

    return (
        <Container>
            <Row className="mb-4">
                <AppHeader xs="12" className="bg-light">
                    <div></div>
                    <Heading>Amplify Todo App</Heading>
                    <CustomButton
                        type="button"
                        color="danger"
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            renderButtonLoader()
                        ) : (
                            <>
                                <i className="fa fa-power-off mr-1"></i> Logout
                            </>
                        )}
                    </CustomButton>
                </AppHeader>
            </Row>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-4">
                    <Col md="8">
                        <CustomInput
                            value={todoText}
                            onChange={handleTodoTextChange}
                            placeholder="Enter todo task..."
                            required
                        />
                    </Col>
                    <Col md="2">
                        <select
                            className="form-control"
                            value={priority}
                            onChange={handlePriorityChange}
                        >
                            {renderPriorityOptionsList()}
                        </select>
                    </Col>
                    <Col md="2">
                        <Button
                            type="submit"
                            color="primary"
                            disabled={requestSubmitting}
                        >
                            {requestSubmitting
                                ? renderButtonLoader()
                                : isEditMode()
                                ? "Update Todo"
                                : "Add Todo"}
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Row className="mb-4">
                <Col md="12">
                    <h4 className="mb-4 text-center">Pending:</h4>
                    <TodoList
                        data={todoList}
                        onSelectionChange={setSelectedTodoId}
                        onDelete={handleDeleteTodo}
                        onMarkCompleted={handleMarkCompleted}
                        fetching={fetching}
                        actionLoadersData={actionLoaders}
                        renderActionButtons
                        renderPriority
                    />
                </Col>
            </Row>
            <hr className="my-2" />
            <Row className="mt-4">
                <Col md="12">
                    <h4 className="mb-4 text-center">Completed:</h4>
                    <TodoList
                        data={completedTodoList}
                        fetching={completedTodoFetching}
                        renderActionButtons={false}
                        renderPriority={false}
                        renderStatus
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Todo;
