import { Component, c } from "./component";

export class Entity {
    public componentsMask: number
    public readonly c: {[key: number]: Component}
    public match(componentMask: number) {
        return (this.componentsMask & componentMask) == componentMask
    }
}
