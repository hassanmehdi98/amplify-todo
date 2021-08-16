import React from "react";
import { ListGroup, Spinner } from "reactstrap";
import TodoListItem from "./TodoListItem";

const TodoList = (props) => {
    const { data, onDelete, onSelectionChange, fetching } = props;

    const renderLoader = () => (
        <div className="text-center">
            <Spinner color="primary" />
        </div>
    );

    const renderNoTodosText = () => (
        <div className="text-center">
            <p>No todos created yet.</p>
        </div>
    );

    return fetching ? (
        renderLoader()
    ) : data?.length ? (
        <ListGroup>
            {data.map((item) => (
                <TodoListItem
                    key={item.id}
                    id={item.id}
                    todo={item.todo}
                    priority={item.priority}
                    onEdit={onSelectionChange}
                    onDelete={onDelete}
                />
            ))}
        </ListGroup>
    ) : (
        renderNoTodosText()
    );
};

export default TodoList;
