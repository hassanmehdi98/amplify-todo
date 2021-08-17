import React, { useEffect, useState } from "react";
import {
    createTodoQuery,
    createTodoSubscription,
    deleteTodoQuery,
    deleteTodoSubscription,
    getCurrentUser,
    getSortedTodoListingByPriorityQuery,
    getTodoListingQuery,
    markCompletedQuery,
    signOut,
    updateTodoQuery,
    updateTodoSubscription,
} from "../../utils/amplifyUtils";
import TodoList from "./TodoList";
import { Priority, SortDirection, Status } from "../../constants";
import { Button, Col, Container, Form, Row } from "reactstrap";
import Styled from "styled-components";
import { CustomButton } from "../../components/Button";
import { AppHeader } from "../../components/Header";
import { CustomInput } from "../../components/Input";

const Heading = Styled.h2``;

const Todo = (props) => {
    const [todoText, setTodoText] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [selectedTodoId, setSelectedTodoId] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [requestSubmitting, setRequestSubmitting] = useState(false);
    const [priority, setPriority] = useState(Priority.NORMAL);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [completedTodoList, setCompletedTodoList] = useState([]);
    const [completedTodoFetching, setCompletedTodoFetching] = useState(false);
    const [actionLoaders, setActionLoaders] = useState({});

    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser();
        getTodoList();
        getCompletedTodoList();
    }, []);

    useEffect(() => {
        if (user) {
            const createTodoListener = createTodoSubscription(
                user.username,
                (todo) => {
                    setActionLoaders((prev) => {
                        const newData = { ...prev };
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

            const updateTodoListener = updateTodoSubscription(
                user.username,
                (updatedTodo) => {
                    const newTodos = [...todoList];
                    const index = newTodos.findIndex(
                        (todo) => todo.id === updatedTodo.id
                    );
                    newTodos[index] = updatedTodo;
                    setTodoList(newTodos);
                }
            );

            const deleteTodoListener = deleteTodoSubscription(
                user.username,
                (deletedTodo) => {
                    const newTodos = todoList.filter(
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
            const todo = todoList.find((todo) => todo.id === selectedTodoId);
            if (todo) {
                setTodoText(todo.todo);
                setPriority(todo.priority);
            }
        }
    }, [selectedTodoId, todoList]);

    const getTodoList = async () => {
        setFetching(true);
        try {
            const result = await getSortedTodoListingByPriorityQuery(
                SortDirection.ASC
            );
            const todos = result.data.listTodosByPriority.items;
            setTodoList(todos);
            const actionLoadersData = {};
            todos.forEach((todo) => {
                actionLoadersData[todo.id] = {
                    isEditing: false,
                    isDeleting: false,
                    isCompleting: false,
                };
            });
            setActionLoaders(actionLoadersData);
        } catch (err) {
            console.log(err);
        } finally {
            setFetching(false);
        }
    };

    const getCompletedTodoList = async () => {
        setCompletedTodoFetching(true);
        try {
            const result = await getTodoListingQuery(Status.COMPLETED);
            const completedTodos = result.data.listTodos.items;
            setCompletedTodoList(completedTodos);
        } catch (err) {
            console.log(err);
        } finally {
            setCompletedTodoFetching(false);
        }
    };

    const getUser = async () => {
        const user = await getCurrentUser();
        setUser(user);
    };

    const renderPriorityOptionsList = () => {
        return Object.keys(Priority).map((key) => (
            <option key={key} value={Priority[key]}>
                {key}
            </option>
        ));
    };

    const renderButtonLoader = () => (
        <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
        ></span>
    );

    const isEditMode = () => (selectedTodoId ? true : false);

    const handleTodoTextChange = (e) => setTodoText(e.target.value);
    const handlePriorityChange = (e) => setPriority(e.target.value);

    const handleDeleteTodo = async (id) => {
        setDeletingLoader(id, true);
        try {
            await deleteTodoQuery(id);
        } catch (err) {
            console.log(err);
        } finally {
            setDeletingLoader(id, false);
        }
    };

    const handleMarkCompleted = async (id) => {
        setCompletingLoader(id, true);
        try {
            const data = await markCompletedQuery(id);
            const result = data.data.markCompleted;
            const todos = [
                ...completedTodoList,
                {
                    id: result.id,
                    todo: result.todo,
                    priority: result.priority,
                    status: result.status,
                    __isNew: true,
                },
            ];
            const pendingTodos = [...todoList].filter(
                (todo) => todo.id !== result.id
            );
            setCompletedTodoList(todos);
            setTodoList(pendingTodos);
            setTimeout(() => {
                setCompletedTodoList((prev) => {
                    const updatedTodos = [...prev];
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
            await signOut();
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const setEditingLoader = (id, value) => {
        setActionLoaders((prev) => {
            const newData = { ...prev };
            newData[id].isEditing = value;
            return newData;
        });
    };

    const setDeletingLoader = (id, value) => {
        setActionLoaders((prev) => {
            const newData = { ...prev };
            newData[id].isDeleting = value;
            return newData;
        });
    };

    const setCompletingLoader = (id, value) => {
        setActionLoaders((prev) => {
            const newData = { ...prev };
            newData[id].isCompleting = value;
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRequestSubmitting(true);
        try {
            if (isEditMode()) {
                setEditingLoader(selectedTodoId, true);
                const result = await updateTodoQuery(selectedTodoId, {
                    todo: todoText,
                    priority,
                });
                const newTodos = [...todoList];
                const updatedTodo = newTodos.find(
                    (todo) => todo.id === selectedTodoId
                );
                updatedTodo.todo = result.data.updateItem.todo;
                updatedTodo.priority = result.data.updateItem.priority;

                setEditingLoader(selectedTodoId, false);
                setSelectedTodoId(null);
                setTodoText("");
                setTodoList(newTodos);
                setPriority(Priority.NORMAL);
            } else {
                await createTodoQuery({
                    todo: todoText,
                    priority,
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
                        selectedTodoId={selectedTodoId}
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
