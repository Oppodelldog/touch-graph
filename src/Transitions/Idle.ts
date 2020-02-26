import {State} from "../State/State";
import {Controller} from "../Controller";

export class Idle extends State {
    private controller: Controller;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
    }
}
