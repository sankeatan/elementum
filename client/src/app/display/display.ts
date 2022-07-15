export class DisplayObjectCollection {
    private displayObjects: DisplayObject[] = []

    draw(ctx: CanvasRenderingContext2D): void {
        this.displayObjects.forEach(element => {
            element.draw(ctx)
        })
    }

    getClicked(x: number, y: number, bringToFront: boolean = false): DisplayObject {
        for(let i=this.displayObjects.length-1; i>=0; i--) {
            let clicked_obj = this.displayObjects[i]
            if(clicked_obj.isInside(x, y)) {
                if(bringToFront) {
                    // move the clicked object to the end of the array
                    this.displayObjects.push(this.displayObjects.splice(i,1)[0])
                }
                return clicked_obj
            }
        }

        return null
    }

    add(displayObject: DisplayObject): void {
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
        lineWidth: 6
    }
    constructor(x_pos: number, y_pos: number, style?: {}) {
        this.x_pos = x_pos
        this.y_pos = y_pos
        for(const property in style) {
            this.style[property] = style[property]
        }
    }

    applyStyle(ctx: CanvasRenderingContext2D): void {
        for(const property in this.style) {
            ctx[property] = this.style[property]
        }
    }

    abstract isInside(x:number, y: number): boolean
    abstract draw(ctx: CanvasRenderingContext2D): void
}

export class DisplayObjectRectangle extends DisplayObject {
    width: number
    height: number

    constructor(x_pos: number, y_pos: number, width: number, height: number, style?: {}) {
        super(x_pos, y_pos, style)
        this.width = width
        this.height = height
    }

    isInside(x: number, y: number): boolean {
        x -= this.x_pos
        y -= this.y_pos
        return x >= -this.width/2 && x <= this.width/2 && y >= -this.height/2 && y <= this.height/2
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.applyStyle(ctx)
        ctx.beginPath()
        ctx.moveTo(this.x_pos-this.width/2, this.y_pos-this.height/2)
        ctx.lineTo(this.x_pos+this.width/2, this.y_pos-this.height/2)
        ctx.lineTo(this.x_pos+this.width/2, this.y_pos+this.height/2)
        ctx.lineTo(this.x_pos-this.width/2, this.y_pos+this.height/2)
        ctx.lineTo(this.x_pos-this.width/2, this.y_pos-this.height/2)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }
}

export class DisplayObjectCircle extends DisplayObject {
    radius: number

    constructor(x_pos: number, y_pos: number, radius: number, style?: {}) {
        super(x_pos, y_pos, style)
        this.radius = radius
    }

    isInside(x: number, y: number): boolean {
        return Math.pow((x-this.x_pos),2) + Math.pow((y-this.y_pos),2) <= Math.pow(this.radius,2)
    }

    draw(ctx: CanvasRenderingContext2D): void {
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

    draw(ctx: CanvasRenderingContext2D): void {
        this.applyStyle(ctx)
        ctx.beginPath()
        ctx.moveTo(this.x_pos + this.vertices[0][0], this.y_pos + this.vertices[0][1])
        for(let i=1; i<this.vertices.length; i++) {
            ctx.lineTo(this.x_pos + this.vertices[i][0], this.y_pos + this.vertices[i][1])
        }
        ctx.lineTo(this.x_pos, this.y_pos)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }
}

// class DisplayObjectImage implements DisplayObject {
//     path: string
// }
