export default class MethodNotSupportedException extends Error {
    constructor(name) {
        super(`Method "${name}" is not supported`);
    }
}
