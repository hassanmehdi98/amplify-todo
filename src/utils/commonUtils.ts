export const injectConstant = (obj: any, colorObj?: any): any => {
    if (colorObj && Object.keys(colorObj).length === Object.keys(obj).length) {
        Object.setPrototypeOf(obj, {
            __colors: colorObj,
        });
    }
    return obj;
};

export const getConstantColorStyle = (obj: any, name: string): any => {
    return obj.__colors[name];
};
