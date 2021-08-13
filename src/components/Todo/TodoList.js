import React from "react";
import TodoListItem from "./TodoListItem";

const TodoList = (props) => {
    const { data, onDelete, onSelectionChange, fetching } = props;
    return fetching ? (
        <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    ) : data?.length ? (
        <ul className="list-group">
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
        </ul>
    ) : (
        <div className="text-center">
            <p>No todos created yet.</p>
        </div>
    );
};

export default TodoList;
