import JSFXProperty from "./JSFXProperty.js";
import JSFXNode from "./JSFXNode.js";
import ArrayProperty from ".//properties/properties/ArrayProperty.js";
import StringProperty from ".//properties/properties/StringProperty.js";
import BooleanProperty from ".//properties/properties/BooleanProperty.js";
import ReadOnlyNumberProperty from ".//properties/properties/ReadOnlyNumberProperty.js";
import NumberProperty from ".//properties/properties/NumberProperty.js";
import ObjectProperty from ".//properties/properties/ObjectProperty.js";
import Style from "./helper/Style.js";
import Data from "./helper/Data.js";

const nodeMap = new WeakMap();

const rnothtmlwhite = (/[^\x20\t\r\n\f]+/g),
    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

export interface Attributes {
    [name: string]: string
}

interface EventHandle {
    listener: (this: Element, ev: Event) => any;
    namespaces: string[];
    type: string;
}

export default abstract class JSFXElement {

    protected element: HTMLElement;

    public readonly children: ArrayProperty<JSFXElement> = new ArrayProperty<JSFXElement>();

    @JSFXProperty("classList", false, JSFXProperty.ARRAY)
    public readonly classes: ArrayProperty<string> = new ArrayProperty<string>();

    @JSFXProperty("id")
    public readonly id: StringProperty = new StringProperty();

    @JSFXProperty("disabled")
    public readonly disabled: BooleanProperty = new BooleanProperty();

    @JSFXProperty("innerText")
    public readonly text: StringProperty = new StringProperty();

    @JSFXProperty("innerHTML")
    public readonly html: StringProperty = new StringProperty();

    @JSFXProperty("clientHeight", false)
    public readonly clientHeight: ReadOnlyNumberProperty = new NumberProperty();

    @JSFXProperty("clientWidth", false)
    public readonly clientWidth: ReadOnlyNumberProperty = new NumberProperty();

    @JSFXProperty("clientLeft", false)
    public readonly clientLeft: ReadOnlyNumberProperty = new NumberProperty();

    @JSFXProperty("scrollTop", false)
    public readonly scrollTop: ReadOnlyNumberProperty = new NumberProperty();

    @JSFXProperty("scrollLeft", false)
    public readonly scrollLeft: ReadOnlyNumberProperty = new NumberProperty();

    @JSFXProperty("onClick")
    public readonly onClick: ObjectProperty<Function> = new ObjectProperty<Function>();


    protected listeners: Map<string, Array<EventHandle>> = new Map();

    constructor(element?: HTMLElement) {

        this.element = element;

        if (this.element == null)
            this.element = document.createElement(this.getTagName());

        nodeMap.set(this.element, this);

        const observer = new MutationObserver((mutations) => {

            mutations.forEach((mutation) => {
                this.mutated(mutation);
            });

            JSFXElement.forEachPrototype(this, constructor => {

                const properties = JSFXProperty.get(constructor.constructor.name);

                if (properties != null) {

                    properties.forEach(property => {

                        if (property.updateOnChange)
                            this[property.propertyKey].value = this.element[property.name];
                    });
                }
            });
        });

        observer.observe(this.element, {attributes: true, childList: false, characterData: false});

        this.applyListeners();
    }

    public abstract getTagName(): string;

    protected mutated(mutation: MutationRecord) {

        if (mutation.type === "attributes") {

            if (mutation.attributeName === "id")
                this.id.value = this.element.id;

            if (mutation.attributeName === "class") {

                let classes = [];
                this.element.classList.forEach(className => {
                    classes.push(className);
                });

                this.classes.value = classes;
            }
        }
    }

    protected applyListeners() {

        this.classes.addListener(() => {
            this.element.className = this.classes.join(" ");
        });

        this.children.addListener(newValue => {

            newValue.forEach((child, index) => {

                if (index == newValue.length - 1)
                    this.element.lastChild.after(child.element);
                else
                    this.element.lastChild.before(child.element);
            });
        });

        const properties = JSFXProperty.get(this.constructor.name);

        if (properties != null) {

            properties.forEach(property => {

                if (property.updateOnChange) {

                    this[property.propertyKey].addListener(value => {
                        this.element[property.name] = value;
                    });
                }
            });
        }
    }

    public get parent() {

        if (this.element.parentElement == null)
            return null;

        return JSFXElement.compile(this.element.parentElement);
    }

    public get firstChild() {
        return this.children.get(0);
    }

    public attr(attribute: string, value: string | number): string {

        if (value == null)
            return this.element.getAttribute(attribute);

        this.element.setAttribute(attribute, value.toString());
        return value.toString();
    }

    public removeAttr(attribute: string) {
        this.element.removeAttribute(attribute);
    }

    public add<T extends JSFXElement>(child: T) {

        this.children.push(child);
        this.element.appendChild(child.element);
    }

    public contains<T extends JSFXElement>(child: T): boolean {
        return this.element.contains(child.element);
    }

    public remove<T extends JSFXElement>(oldChild?: T) {

        if (arguments.length === 0) {

            if (this.element.parentElement != null && this.element.parentElement.contains(this.element))
                this.element.parentElement.removeChild(this.element);

        } else {

            if (this.element.contains(oldChild.element)) {

                this.element.removeChild(oldChild.element);
                let index = this.children.indexOf(oldChild);
                this.children.splice(index);
            }
        }
    }

    public replaceChild<T extends JSFXElement>(newChild: T, oldChild: T) {
        this.element.replaceChild(newChild.element, oldChild.element);
    }

    public find(filter: (component: JSFXElement) => boolean, deep: boolean | number = -1): JSFXElement[] {

        let results = [];

        if (filter(this))
            results.push(this);

        if (deep == false || deep == 0)
            return results;

        (<number>deep)--;

        this.children.forEach(child => {
            results = results.concat(child.find(filter, deep));
        });

        return results;
    }

    public clear() {

        let child = null;
        while (this.firstChild) {

            if (child === this.firstChild)
                throw new Error("error while removing. last removed element is same as removed before");
            child = this.firstChild;
            this.remove(child);
        }
    }

    public click() {
        return this.element.click();
    }

    public data(name: string, value?: any) {

        if (arguments.length == 1)
            return Data.get(this.element, name);
        else
            Data.set(this.element, name, value);
    }

    public hasClass(clazz: string): boolean {
        return this.element.classList.contains(clazz);
    }

    public css(name: string | any, value?: any): any | void {

        if (Object.getPrototypeOf(name) == Object.prototype) {

            for (let key in name)
                if (name.hasOwnProperty(key))
                    Style.style(this.element, key, name[key]);

            return;
        }

        return value !== undefined ?
            Style.style(this.element, name, value) :
            Style.css(this.element, name);
    }


    public on(type: string, listener: (this: Element | MouseEvent | KeyboardEvent, ev: Event) => any, options?: boolean | AddEventListenerOptions) {

        const types = (type || "").match(rnothtmlwhite) || [""];
        types.forEach(type => {

            const tmp = rtypenamespace.exec(type) || [];

            type = tmp[1];
            const namespaces = (tmp[2] || "").split(".").sort();


            let listeners = this.listeners.get(type);

            if (listeners == null)
                this.listeners.set(type, listeners = []);

            listeners.push({
                namespaces,
                type,
                listener
            });

            this.element.addEventListener(type, listener, options);
        });
    }


    public off(type: string) {

        const types = (type || "").match(rnothtmlwhite) || [""];
        types.forEach(type => {

            const tmp = rtypenamespace.exec(type) || [];

            type = tmp[1];
            const namespaces = (tmp[2] || "").split(".").sort();

            // Unbind all events (on this namespace, if provided) for the element
            if (!type) {

                this.listeners.forEach((list, key) => {

                    list.forEach(entry => {

                        if (entry.namespaces.toString() == namespaces.toString())
                            this.element.removeEventListener(key, entry.listener);
                    })
                });
                return;
            }

            const listenersForType = this.listeners.get(type);

            if (listenersForType == null)
                return;

            listenersForType.forEach((handle, index) => {
                if (handle.namespaces.toString() == namespaces.toString()) {

                    listenersForType.splice(index, 1);
                    this.element.removeEventListener(handle.type, handle.listener);
                }
            });
        });
    }

    public trigger(type: string) {
        this.element.dispatchEvent(new Event(type));
    }

    public show() {
        this.css("display", "block");
    }

    public hide() {
        this.css("display", "none");
    }

    public static forEachPrototype<T extends JSFXElement>(container: T, callback: (prototype: any) => any) {

        let constructor = container;
        let stackOverFlowPrevention = 10;

        do {

            constructor = Object.getPrototypeOf(constructor);
            callback(constructor);

            stackOverFlowPrevention--;

        } while (stackOverFlowPrevention > 0 && constructor.constructor.name !== "JSFXElement");
    }

    protected static compile<T extends JSFXElement>(element: Element): T {

        let xElement = nodeMap.get(element);
        if (xElement != null)
            return xElement;

        const clazz = JSFXNode.get(element.localName);
        const compiled: T = new clazz(element);

        this.provideDefaults(compiled, element);

        for (let index = 0; index < element.children.length; index++)
            compiled.children.value.push(this.compile(element.children[index]));

        return compiled;
    }

    private static provideDefaults(container: JSFXElement, element: Element) {

        this.forEachPrototype(container, constructor => {

            const properties = JSFXProperty.get(constructor.constructor.name);

            if (properties != null) {

                properties.forEach(property => {
                    property.intercept(container[property.propertyKey], element[property.name]);
                });
            }
        });
    }
}