import JSFXElement from "../JSFXElement.js";
import JSFXNode      from "../JSFXNode.js";

@JSFXNode
export default class Div extends JSFXElement {

    protected element: HTMLDivElement;

    constructor ( element?: HTMLDivElement ) {
        super( element );
    }

    public getTagName (): string {
        return "div";
    }
}