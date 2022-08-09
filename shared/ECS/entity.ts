import { Component, c } from "./component";

export class Entity {
    public componentsMask: number
    public readonly components: {[key: number]: Component}
}
