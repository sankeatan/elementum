export class GameDisplay {
    private ctx: CanvasRenderingContext2D
    private displayObjects: DisplayObject[]
    private width: number
    private height: number

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.width = width
        this.height = height
        this.ctx = ctx
        this.displayObjects = [new DisplayObjectPolygon()]
    }

    draw() {
        this.displayObjects.forEach((displayObject) => {
            displayObject.draw(this.ctx)
        })
    }
}

export abstract class DisplayObject {
    pos_x: number = 0
    pos_y: number = 0
    rotation: number = 0
    style: {} = {
        fillStyle: '#f1f',
        strokeStyle: '#000',
        lineWidth: 1
    }
    abstract isInside(x:number, y: number): boolean
    abstract draw(ctx: CanvasRenderingContext2D): void
}

// width, height, x, y, rotation, isInside(x, y)

// class DisplayObjectRectangle extends DisplayObject {
//     width: number; height: number
// }

// class DisplayObjectCircle extends DisplayObject {
//     radius: number
// }

export class DisplayObjectPolygon extends DisplayObject {
    vertices: {x: number, y: number}[] = [{x: 0, y: 0}, {x: 10, y: 0}, {x: 10, y: 10}, {x: 0, y: 10}]
    isInside(x: number, y: number) {
        let i: number, j: number, c: boolean = false
        for( i = 0, j = this.vertices.length-1; i < this.vertices.length; j = i++ ) {
            if( ( ( this.vertices[i].y > y ) != ( this.vertices[j].y > y ) ) &&
                ( x < ( this.vertices[j].x - this.vertices[i].x ) * ( y - this.vertices[i].y ) /
                ( this.vertices[j].y - this.vertices[i].y ) + this.vertices[i].x ) ) {
                    c = !c
            }
        }
        return c
    }

    draw(ctx: CanvasRenderingContext2D) {
        for(const property in this.style) {
            ctx[property] = this.style[property]
        }
        ctx.beginPath()
        ctx.moveTo(this.pos_x + this.vertices[0].x, this.pos_y + this.vertices[0].y)
        for(let i=1; i<this.vertices.length; i++) {
            ctx.lineTo(this.pos_x + this.vertices[i].x, this.pos_y + this.vertices[i].y)
        }
        ctx.lineTo(this.pos_x, this.pos_y)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}

// class DisplayObjectImage implements DisplayObject {
//     path: string
// }
