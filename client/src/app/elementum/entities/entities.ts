import { PlayerSlot } from "../../../../../shared/shared"
import { CanvasRender } from "../components/canvas/render"

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
    public xPos: number = 0
    public yPos: number = 0
    public playerSlot: PlayerSlot = undefined
    public draggable: boolean = false
    public render: CanvasRender
    public boundingShape: CanvasRender = undefined

    constructor(xPos: number, yPos: number, render: CanvasRender, boundingShape?: CanvasRender) {
        this.xPos = xPos
        this.yPos = yPos
        this.render = render
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.render.draw(ctx, this.xPos, this.yPos)
    }

    public isInside(x: number, y: number) {
        let relative_x = x - this.xPos
        let relative_y = y - this.yPos

        if(this.boundingShape) {
            return this.boundingShape.isInside(relative_x, relative_y)
        }

        return this.render.isInside(relative_x, relative_y)
    }

    public rotate(angle: number) {
        this.render.rotate(angle)
    }
}
