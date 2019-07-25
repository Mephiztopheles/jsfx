const cache = new WeakMap();

const rbrace = /^(?:{[\w\W]*}|\[[\w\W]*])$/,
    rmultiDash = /[A-Z]/g;

function getData(data) {

    if (data === "true")
        return true;

    if (data === "false")
        return false;

    if (data === "null")
        return null;

    // Only convert to a number if it doesn't change the string
    if (data === +data + "")
        return +data;

    if (rbrace.test(data))
        return JSON.parse(data);

    return data;
}

function dataAttr(elem, key) {

    let name;

    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute

    name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
    let data = elem.getAttribute(name);

    if (typeof data === "string") {

        try {
            data = getData(data);
        } catch (e) {
        }

    } else {
        data = undefined;
    }

    return data;
}

export default class Data {

    private constructor(props) {
    }


    public static get(element: Element, name: string) {

        let cached = cache.get(element);

        if (cached == null)
            cache.set(element, cached = {});

        let data = cached[name];
        if (data === undefined)
            data = dataAttr(element, name);

        return data;
    }

    public static set(element: Element, name: string, value: any) {

        let cached = cache.get(element);

        if (cached == null)
            cache.set(element, cached = {});

        cached[name] = value;
    }
}