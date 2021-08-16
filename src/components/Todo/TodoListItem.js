import React from "react";
import { Button, Col, ListGroupItem, Row } from "reactstrap";
import { Priority } from "../../constants";
import { getConstantColorStyle } from "../../utils/commonUtils";

const getIconForPriority = (priority) => {
    const icons = {
        [Priority.HIGH]: "fa fa-arrow-up mr-1",
        [Priority.NORMAL]: "fa fa-arrow-down mr-1",
    };

    return <i className={icons[priority]}></i>;
};

const TodoListItem = (props) => {
    const { id, todo, priority, onEdit, onDelete } = props;

    return (
        <ListGroupItem>
            <Row>
                <Col md="8">{todo}</Col>
                <Col
                    md="2"
                    style={{ color: getConstantColorStyle(Priority, priority) }}
                >
                    {getIconForPriority(priority)} {priority}
                </Col>
                <Col md="2">
                    <Button
                        color="primary"
                        size="sm"
                        onClick={() => onEdit(id)}
                    >
                        <i className="fa fa-edit"></i>
                    </Button>
                    <Button
                        color="danger"
                        size="sm"
                        className="ml-1"
                        onClick={() => onDelete(id)}
                    >
                        <i className="fa fa-times"></i>
                    </Button>
                </Col>
            </Row>
        </ListGroupItem>
    );
};

export default TodoListItem;
