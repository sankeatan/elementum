export class GameDisplay {
    private ctx: CanvasRenderingContext2D
    private displayObjects: DisplayObject[] = []
    private width: number
    private height: number

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.width = width
        this.height = height
        this.ctx = ctx
    }

    draw() {
        this.displayObjects.forEach((displayObject) => {
            displayObject.draw(this.ctx)
        })
    }

    somethingClicked(x: number, y: number) {
        for(let i=0; i<this.displayObjects.length; i++) {
            if(this.displayObjects[i].isInside(x, y)) {
                return true
            }
        }

        return false
    }

    add(displayObject: DisplayObject) {
        this.displayObjects.push(displayObject)
    }
}

export abstract class DisplayObject {
    x_pos: number = 0
    y_pos: number = 0
    rotation: number = 0
    style: {} = {
        fillStyle: '#f1f',
        strokeStyle: '#000',
        lineWidth: 1
    }
    constructor(x_pos: number, y_pos: number, style?: {}) {
        this.x_pos = x_pos
        this.y_pos = y_pos
        for(const property in style) {
            this.style[property] = style[property]
        }
    }

    applyStyle(ctx: CanvasRenderingContext2D) {
        for(const property in this.style) {
            ctx[property] = this.style[property]
        }
    }

    abstract isInside(x:number, y: number): boolean
    abstract draw(ctx: CanvasRenderingContext2D): void
}

// export class DisplayObjectRectangle extends DisplayObject {
//     width: number; height: number
// }

export class DisplayObjectCircle extends DisplayObject {
    radius: number

    constructor(x_pos: number, y_pos: number, radius: number, style?: {}) {
        super(x_pos, y_pos, style)
        this.radius = radius
    }

    isInside(x: number, y: number): boolean {
        return Math.pow((x-this.x_pos),2) + Math.pow((y-this.y_pos),2) <= Math.pow(this.radius,2)
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.applyStyle(ctx)
        ctx.beginPath()
        ctx.arc(this.x_pos, this.y_pos, this.radius, 0, 2*Math.PI)
        ctx.stroke()
        ctx.fill()
    }
}

export class DisplayObjectPolygon extends DisplayObject {
    private vertices: [x: number, y: number][]

    constructor(x_pos: number, y_pos: number, vertices: [number, number][], style?: {}) {
        super(x_pos, y_pos, style)
        vertices.forEach(vertex => {
            this.vertices.push([vertex[0], vertex[1]])
        })
    }

    // https://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    isInside(x: number, y: number): boolean {
        x -= this.x_pos
        y -= this.y_pos
        let i: number, j: number, c: boolean = false
        for( i = 0, j = this.vertices.length-1; i < this.vertices.length; j = i++ ) {
            if( ( ( this.vertices[i][1] > y ) != ( this.vertices[j][1] > y ) ) &&
                ( x < ( this.vertices[j][0] - this.vertices[i][0] ) * ( y - this.vertices[i][1] ) /
                ( this.vertices[j][1] - this.vertices[i][1] ) + this.vertices[i][0] ) ) {
                    c = !c
            }
        }
        return c
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.applyStyle(ctx)
        ctx.beginPath()
        ctx.moveTo(this.x_pos + this.vertices[0][0], this.y_pos + this.vertices[0][1])
        for(let i=1; i<this.vertices.length; i++) {
            ctx.lineTo(this.x_pos + this.vertices[i][0], this.y_pos + this.vertices[i][1])
        }
        ctx.lineTo(this.x_pos, this.y_pos)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}

// class DisplayObjectImage implements DisplayObject {
//     path: string
// }
