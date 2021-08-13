import React from "react";
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
        <li className="list-group-item">
            <div className="row">
                <div className="col-md-8">{todo}</div>
                <div
                    className="col-md-2"
                    style={{ color: getConstantColorStyle(Priority, priority) }}
                >
                    {getIconForPriority(priority)} {priority}
                </div>
                <div className="col-md-2">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onEdit(id)}
                    >
                        <i className="fa fa-edit"></i>
                    </button>
                    <button
                        className="btn btn-danger btn-sm ml-1"
                        onClick={() => onDelete(id)}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default TodoListItem;
