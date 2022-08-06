import { Component, ComponentType } from "./component";

export interface Entity {
    componentsBitArray: number
    components: {[key in ComponentType]: Component}
}
