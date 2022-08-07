import { Component, com } from "./component";

export const ComponentSet = {
    position2d: {
        x: 0,
        y: 0
    },
    elementType: {},
    boundingBox: {},
    clickEvents: {},
    frameRender: {},
    slot: {},
    canvasStyle: {},
    vertices2D: {},
}

export class Entity {
    public componentsBitArray: number
    public readonly components: typeof 
}

let x:Component = new com.BoundingBox(3)