
// TODO: add ability to round the edges of polygons:

import { ActionSlot, PlayerSlot } from "../../../../shared/shared"
import { CanvasRender } from "../canvas/render"

// https://stackoverflow.com/a/3368118/19585452
export class EntityCollection {
    public entities: Entity[] = []
    // not used currently. may want to implement for scaling the collection for different canvas sizes
    public scale: number = 1.0

    public draw(ctx: CanvasRenderingContext2D): void {
        this.entities.forEach(element => {
            element.draw(ctx)
        })
    }

    private getEntity(x: number, y: number, ignoreEntity: Entity): Entity {
        for(let i=this.entities.length-1; i>=0; i--) {
            let clicked_obj = this.entities[i]
            if(clicked_obj != ignoreEntity && clicked_obj.isInside(x, y)) {
                return clicked_obj
            }
        }

        return null
    }

    public getEntityAt(x: number, y: number): Entity {
        return this.getEntity(x, y, null)
    }

    public getEntityBelow(x: number, y: number, entity: Entity): Entity {
        return this.getEntity(x, y, entity)
    }

    public bringToFront(entity: Entity) {
        // move the clicked object to the end of the array
        this.entities.push(this.entities.splice(this.entities.indexOf(entity),1)[0])
    }

    public add(entity: Entity): void {
        this.entities.push(entity)
    }
}

export abstract class Entity {
    public x_pos: number = 0
    public y_pos: number = 0
    public render: CanvasRender
    public boundingShape: CanvasRender = undefined

    constructor(x_pos: number, y_pos: number, render: CanvasRender, boundingShape?: CanvasRender) {
        this.x_pos = x_pos
        this.y_pos = y_pos
        this.render = render
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.render.draw(ctx, this.x_pos, this.y_pos)
    }

    public isInside(x: number, y: number) {
        let relative_x = x - this.x_pos
        let relative_y = y - this.y_pos

        if(this.boundingShape) {
            return this.boundingShape.isInside(relative_x, relative_y)
        }

        return this.render.isInside(relative_x, relative_y)
    }

    public rotate(angle: number) {
        this.render.rotate(angle)
    }
}
