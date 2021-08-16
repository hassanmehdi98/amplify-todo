import React, { useEffect, useState } from "react";
import {
    createTodoQuery,
    createTodoSubscription,
    deleteTodoQuery,
    deleteTodoSubscription,
    getCurrentUser,
    getSortedTodoListingByPriorityQuery,
    signOut,
    updateTodoQuery,
    updateTodoSubscription,
} from "../../utils/amplifyUtils";
import TodoList from "./TodoList";
import { Priority, SortDirection } from "../../constants";
import { Button, Col, Container, Form, Input, Row } from "reactstrap";

const Todo = (props) => {
    const [todoText, setTodoText] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [selectedTodoId, setSelectedTodoId] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [requestSubmitting, setRequestSubmitting] = useState(false);
    const [priority, setPriority] = useState(Priority.NORMAL);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser();
        getTodoList();
    }, []);

    useEffect(() => {
        if (user) {
            const createTodoListener = createTodoSubscription(
                user.username,
                (todo) => {
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
        } catch (err) {
            console.log(err);
        } finally {
            setFetching(false);
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
        try {
            await deleteTodoQuery(id);
        } catch (err) {
            console.log(err);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRequestSubmitting(true);
        try {
            if (selectedTodoId) {
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
                <Col
                    xs="12"
                    className="text-center bg-light d-flex justify-content-between align-items-center mt-2"
                >
                    <div></div>
                    <h2>Amplify Todo App</h2>
                    <Button
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
                    </Button>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-4">
                    <Col md="8">
                        <Input
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
            <Row>
                <Col md="12">
                    <TodoList
                        data={todoList}
                        selectedTodoId={selectedTodoId}
                        onSelectionChange={setSelectedTodoId}
                        onDelete={handleDeleteTodo}
                        fetching={fetching}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Todo;
