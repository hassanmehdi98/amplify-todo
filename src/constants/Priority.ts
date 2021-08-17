import { injectConstant } from "../utils/commonUtils";

const Priority = {
    HIGH: "HIGH",
    NORMAL: "NORMAL",
};

const PriorityLabelColors = {
    [Priority.HIGH]: "red",
    [Priority.NORMAL]: "green",
};

export default injectConstant(Priority, PriorityLabelColors);
