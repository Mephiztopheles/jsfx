export default class MethodNotSupportedException extends Error {

    constructor(name:string) {
        super(`Method "${name}" is not supported`);
    }
}