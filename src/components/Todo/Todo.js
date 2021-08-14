import React, { useEffect, useState } from "react";
import {
    createTodoQuery,
    createTodoSubscription,
    deleteTodoQuery,
    deleteTodoSubscription,
    getSortedTodoListingByPriorityQuery,
    updateTodoQuery,
    updateTodoSubscription,
} from "../../utils/amplifyUtils";
import TodoList from "./TodoList";
import { Auth, Hub } from "aws-amplify";
import { Priority, SortDirection } from "../../constants";

const Todo = (props) => {
    const [todoText, setTodoText] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [selectedTodoId, setSelectedTodoId] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [requestSubmitting, setRequestSubmitting] = useState(false);
    const [priority, setPriority] = useState(Priority.NORMAL);

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
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
    };

    const getPriorityList = () => {
        return Object.keys(Priority).map((key) => (
            <option key={key} value={Priority[key]}>
                {key}
            </option>
        ));
    };

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
        try {
            await Auth.signOut();
            Hub.dispatch("UI Auth", {
                event: "AuthStateChange",
                message: "signedout",
            });
        } catch (err) {
            console.log(err);
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
        <div className="container container-fluid">
            <div className="row mb-4">
                <div className="col-md-12 text-center bg-light d-flex justify-content-between align-items-center mt-2">
                    <div></div>
                    <h2>Amplify Todo App</h2>
                    <button className="btn btn-danger" onClick={handleSignOut}>
                        <i className="fa fa-power-off mr-1"></i> Logout
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                    <div className="col-md-8">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter todo task..."
                            value={todoText}
                            onChange={handleTodoTextChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-control"
                            value={priority}
                            onChange={handlePriorityChange}
                        >
                            {getPriorityList()}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button
                            className="btn btn-primary ml-1"
                            disabled={requestSubmitting}
                        >
                            {requestSubmitting ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            ) : selectedTodoId ? (
                                "Update Todo"
                            ) : (
                                "Add Todo"
                            )}
                        </button>
                    </div>
                </div>
            </form>
            <div className="row">
                <div className="col-md-12">
                    <TodoList
                        data={todoList}
                        selectedTodoId={selectedTodoId}
                        onSelectionChange={setSelectedTodoId}
                        onDelete={handleDeleteTodo}
                        fetching={fetching}
                    />
                </div>
            </div>
        </div>
    );
};

export default Todo;
