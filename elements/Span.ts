import JSFXElement from "../JSFXElement.js";
import JSFXNode      from "../JSFXNode.js";

@JSFXNode
export default class Span extends JSFXElement {

    protected element: HTMLSpanElement;

    constructor ( element?: HTMLSpanElement ) {
        super( element );
    }

    public getTagName (): string {
        return "span";
    }
}