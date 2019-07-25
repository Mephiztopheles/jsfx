"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MethodNotSupportedException extends Error {
    constructor(name) {
        super(`Method "${name}" is not supported`);
    }
}
exports.default = MethodNotSupportedException;
