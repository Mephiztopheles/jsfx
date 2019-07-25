import JSFXElement from "../../JSFXElement.js";
import JSFXNode      from "../../JSFXNode.js";

@JSFXNode
export default class THead extends JSFXElement {

    getTagName (): string {
        return "thead";
    }
}