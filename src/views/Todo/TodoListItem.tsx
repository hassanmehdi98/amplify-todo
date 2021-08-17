import React, { useState } from "react";
import { Button, Col, ListGroupItem, Row, Tooltip } from "reactstrap";
import { Priority, Status } from "../../constants";
import { getConstantColorStyle } from "../../utils/commonUtils";

export type TodoListItemProps = {
    id: string;
    todo: string;
    priority: string;
    onEdit?: Function;
    onDelete?: Function;
    onMarkCompleted?: Function;
    renderActionButtons?: boolean;
    renderPriority?: boolean;
    renderStatus?: boolean;
    actionLoadersData: any;
    isNew?: boolean;
};

const getIconForPriority = (priority: any): JSX.Element => {
    const icons = {
        [Priority.HIGH]: "fa fa-arrow-up mr-1",
        [Priority.NORMAL]: "fa fa-arrow-down mr-1",
    };

    return <i className={icons[priority]}></i>;
};

const renderButtonLoader = (): JSX.Element => (
    <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
    ></span>
);

const TodoListItem = (props: TodoListItemProps) => {
    const {
        id,
        todo,
        priority,
        isNew,
        onEdit,
        onDelete,
        onMarkCompleted,
        renderActionButtons,
        renderPriority,
        renderStatus,
        actionLoadersData,
    } = props;

    const [tooltipOpen, setToolTipOpen] = useState<boolean>(false);

    const toggle = (): void => setToolTipOpen(!tooltipOpen);

    return (
        <ListGroupItem style={isNew ? { backgroundColor: "#ccffcc" } : {}}>
            <Row>
                <Col md="8">{todo}</Col>
                {renderPriority && (
                    <Col
                        md="2"
                        style={{
                            color: getConstantColorStyle(Priority, priority),
                        }}
                    >
                        {getIconForPriority(priority)} {priority}
                    </Col>
                )}
                {renderStatus && (
                    <Col md="2" style={{ color: "green" }}>
                        <span>
                            <i className="fa fa-check"></i> {Status.COMPLETED}
                        </span>
                    </Col>
                )}
                {renderActionButtons && (
                    <Col md="2">
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => {
                                if (onEdit) {
                                    onEdit(id);
                                }
                            }}
                        >
                            {actionLoadersData[id].isEditing ? (
                                renderButtonLoader()
                            ) : (
                                <i className="fa fa-edit"></i>
                            )}
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            className="ml-1"
                            onClick={() => {
                                if (onDelete) {
                                    onDelete(id);
                                }
                            }}
                        >
                            {actionLoadersData[id].isDeleting ? (
                                renderButtonLoader()
                            ) : (
                                <i className="fa fa-times"></i>
                            )}
                        </Button>
                        <Button
                            id={`btn-mark-completed-${id}`}
                            color="success"
                            size="sm"
                            className="ml-1"
                            onClick={() => {
                                if (onMarkCompleted) {
                                    onMarkCompleted(id);
                                }
                            }}
                        >
                            {actionLoadersData[id].isCompleting ? (
                                renderButtonLoader()
                            ) : (
                                <i className="fa fa-check"></i>
                            )}
                        </Button>
                        <Tooltip
                            placement="top"
                            target={`btn-mark-completed-${id}`}
                            isOpen={tooltipOpen}
                            toggle={toggle}
                        >
                            Mark as completed
                        </Tooltip>
                    </Col>
                )}
            </Row>
        </ListGroupItem>
    );
};

export default TodoListItem;
