import JSFXElement from "../../JSFXElement.js";
import JSFXNode      from "../../JSFXNode.js";

@JSFXNode
export default class Tr extends JSFXElement {

    getTagName (): string {
        return "tr";
    }
}