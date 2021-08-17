import React from "react";
import { ListGroup, Spinner } from "reactstrap";
import { ITodoListItem } from "../../utils/amplify";
import TodoListItem from "./TodoListItem";

export type TodoListProps = {
    data: any;
    onDelete?: Function;
    onSelectionChange?: Function;
    onMarkCompleted?: Function;
    fetching: boolean;
    actionLoadersData?: any;
    renderActionButtons?: boolean;
    renderPriority?: boolean;
    renderStatus?: boolean;
};

type ItemData = ITodoListItem & { __isNew?: boolean };

const renderLoader = (): JSX.Element => (
    <div className="text-center">
        <Spinner color="primary" />
    </div>
);

const renderNoTodosText = (): JSX.Element => (
    <div className="text-center">
        <p>No todos created yet.</p>
    </div>
);

const TodoList = (props: TodoListProps) => {
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

    return fetching ? (
        renderLoader()
    ) : data?.length ? (
        <ListGroup>
            {data.map((item: ItemData) => (
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
