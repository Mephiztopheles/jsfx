const wrappers = {};

export default function JSFXNode (constructor: Function ) {
    wrappers[ constructor.name.toLowerCase() ] = constructor;
}

JSFXNode.get = function (name ) {
    return wrappers[ name ];
};