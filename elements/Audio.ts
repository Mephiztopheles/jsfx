import JSFXNode from "../JSFXNode.js";
import JSFXElement from "../JSFXElement.js";

@JSFXNode
export default class Audio extends JSFXElement {

    protected element: HTMLAudioElement;

    constructor(element?: HTMLAudioElement) {
        super(element);
    }

    public getTagName(): string {
        return "audio";
    }

    public play() {
        return this.element.play();
    }

    public pause() {
        return this.element.pause();
    }
}