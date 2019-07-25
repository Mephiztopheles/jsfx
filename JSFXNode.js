const wrappers = {};
export default function JSFXNode(constructor) {
    wrappers[constructor.name.toLowerCase()] = constructor;
}
JSFXNode.get = function (name) {
    return wrappers[name];
};
