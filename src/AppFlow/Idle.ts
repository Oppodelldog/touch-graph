import {State} from "../Flow/State";
import {Controller} from "../Controller";

export class Idle extends State {

    constructor(name: string, controller: Controller) {
        super(name,controller);
    }
}
