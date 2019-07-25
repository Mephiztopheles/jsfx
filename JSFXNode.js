"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrappers = {};
function JSFXNode(constructor) {
    wrappers[constructor.name.toLowerCase()] = constructor;
}
exports.default = JSFXNode;
JSFXNode.get = function (name) {
    return wrappers[name];
};
