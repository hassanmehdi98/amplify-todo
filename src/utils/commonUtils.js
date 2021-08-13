export const injectConstant = (obj, colorObj) => {
    if (colorObj && Object.keys(colorObj).length === Object.keys(obj).length) {
        Object.setPrototypeOf(obj, {
            __colors: colorObj,
        });
    }
    return obj;
};

export const getConstantColorStyle = (obj, name) => {
    return obj.__colors[name];
};
