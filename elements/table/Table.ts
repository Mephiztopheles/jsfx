import JSFXElement from "../../JSFXElement.js";
import JSFXNode      from "../../JSFXNode.js";

@JSFXNode
export default class Table extends JSFXElement {

    getTagName (): string {
        return "table";
    }
}