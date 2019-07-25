import JSFXElement from "../../JSFXElement.js";
import JSFXNode      from "../../JSFXNode.js";

@JSFXNode
export default class Td extends JSFXElement {

    getTagName (): string {
        return "td";
    }
}