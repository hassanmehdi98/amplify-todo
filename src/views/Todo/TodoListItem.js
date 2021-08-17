import React, { useState } from "react";
import { Button, Col, ListGroupItem, Row, Tooltip } from "reactstrap";
import { Priority, Status } from "../../constants";
import { getConstantColorStyle } from "../../utils/commonUtils";

const getIconForPriority = (priority) => {
    const icons = {
        [Priority.HIGH]: "fa fa-arrow-up mr-1",
        [Priority.NORMAL]: "fa fa-arrow-down mr-1",
    };

    return <i className={icons[priority]}></i>;
};

const renderButtonLoader = () => (
    <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
    ></span>
);

const TodoListItem = (props) => {
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

    const [tooltipOpen, setToolTipOpen] = useState(false);

    const toggle = () => setToolTipOpen(!tooltipOpen);

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
                            onClick={() => onEdit(id)}
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
                            onClick={() => onDelete(id)}
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
                            onClick={() => onMarkCompleted(id)}
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
