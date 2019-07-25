"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const properties = {};
function JSFXProperty(name, updateOnChange = true, intercept = JSFXProperty.DEFAULT) {
    return function (target, propertyKey) {
        let p = properties[target.constructor.name];
        if (p == null)
            p = properties[target.constructor.name] = [];
        p.push({ propertyKey, name, intercept, updateOnChange });
    };
}
exports.default = JSFXProperty;
JSFXProperty.get = function (name) {
    return properties[name];
};
JSFXProperty.DEFAULT = function (property, value) {
    property.value = value;
};
JSFXProperty.ARRAY = function (property, value) {
    const newValue = [];
    for (let i = 0; i < value.length; i++)
        newValue.push(value[i]);
    property.value = newValue;
};
JSFXProperty.EXISTING = function (property, value) {
    property.value = value != null;
};
