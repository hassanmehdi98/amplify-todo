import React from "react";
import { ListGroup, Spinner } from "reactstrap";
import TodoListItem from "./TodoListItem";

const TodoList = (props) => {
    const {
        data,
        onDelete,
        onSelectionChange,
        onMarkCompleted,
        fetching,
        actionLoadersData,
        renderActionButtons = true,
        renderPriority = true,
        renderStatus = false,
    } = props;

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
                    isNew={item.__isNew}
                    onEdit={onSelectionChange}
                    onDelete={onDelete}
                    onMarkCompleted={onMarkCompleted}
                    renderActionButtons={renderActionButtons}
                    renderPriority={renderPriority}
                    renderStatus={renderStatus}
                    actionLoadersData={actionLoadersData}
                />
            ))}
        </ListGroup>
    ) : (
        renderNoTodosText()
    );
};

export default TodoList;
