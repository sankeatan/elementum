
// TODO: add ability to round the edges of polygons:
// https://stackoverflow.com/a/3368118/19585452

export class CanvasEntityCollection {
    public displayObjects: CanvasEntity[] = []
    // not used currently. may want to implement for scaling the collection for different canvas sizes
    public scale: number = 1.0

    public draw(ctx: CanvasRenderingContext2D): void {
        this.displayObjects.forEach(element => {
            element.draw(ctx)
        })
    }

    public getClicked(x: number, y: number, bringToFront: boolean = false): CanvasEntity {
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

    public add(displayObject: CanvasEntity): void {
        this.displayObjects.push(displayObject)
    }
}

export abstract class CanvasEntity {
    public fixed: boolean = false
    public x_pos: number = 0
    public y_pos: number = 0
    public alternateColor?: string = '#111'
    public toggle: boolean = false
    public style: {} = {
        fillStyle: 'beige',//'#f1f',
        strokeStyle: '#000',
        lineWidth: 6
    }
    constructor(x_pos: number, y_pos: number, options?: object) {
        this.x_pos = x_pos
        this.y_pos = y_pos
        for(const option in options) {
            // TODO: Might want to address runtime falibility of these dynamic options/suboptions
            if(options[option] instanceof Object && Object.getPrototypeOf(options[option]) == Object.prototype) {
                for(const suboption in options[option]) {
                    this[option][suboption] = options[option][suboption]
                }
            }
            else {
                this[option] = options[option]
            }
        }
    }

    protected applyStyle(ctx: CanvasRenderingContext2D): void {
        for(const property in this.style) {
            ctx[property] = this.style[property]
        }

        if(this.toggle){
            ctx.fillStyle=this.alternateColor
        } else {
            ctx.fillStyle=ctx.fillStyle
        }
    }

    public abstract isInside(x:number, y: number): boolean
    public abstract draw(ctx: CanvasRenderingContext2D): void
}

export class RectangleCanvasEntity extends CanvasEntity {
    // TODO: allow modification of width and height
    public readonly width: number
    public readonly height: number

    constructor(x_pos: number, y_pos: number, width: number, height: number, options?: {}) {
        super(x_pos, y_pos, options)
        this.width = width
        this.height = height
    }

    public isInside(x: number, y: number): boolean {
        x -= this.x_pos
        y -= this.y_pos
        return x >= -this.width/2 && x <= this.width/2 && y >= -this.height/2 && y <= this.height/2
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.applyStyle(ctx)
        ctx.beginPath()
        ctx.moveTo(this.x_pos-this.width/2, this.y_pos-this.height/2)
        ctx.lineTo(this.x_pos+this.width/2, this.y_pos-this.height/2)
        ctx.lineTo(this.x_pos+this.width/2, this.y_pos+this.height/2)
        ctx.lineTo(this.x_pos-this.width/2, this.y_pos+this.height/2)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }
}

export class CircleCanvasEntity extends CanvasEntity {
    public radius: number

    constructor(x_pos: number, y_pos: number, radius: number, options?: {}) {
        super(x_pos, y_pos, options)
        this.radius = radius
    }

    public isInside(x: number, y: number): boolean {
        return Math.pow((x-this.x_pos),2) + Math.pow((y-this.y_pos),2) <= Math.pow(this.radius,2)
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.applyStyle(ctx)
        ctx.beginPath()
        ctx.arc(this.x_pos, this.y_pos, this.radius, 0, 2*Math.PI)
        ctx.stroke()
        ctx.fill()
    }
}

export class PolygonCanvasEntity extends CanvasEntity {
    private vertices: [x: number, y: number][] = []
    private rotation: number = 0
    private cached_rotations: {[key:number]: [x: number, y: number][]} = {}

    constructor(x_pos: number, y_pos: number, vertices: [number, number][], options?: {}) {
        super(x_pos, y_pos, options)
        vertices.forEach(vertex => {
            this.vertices.push([vertex[0], vertex[1]])
        })
    }

    // https://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    public isInside(x: number, y: number): boolean {
        let verts = this.getRotatedVertices()
        x -= this.x_pos
        y -= this.y_pos
        let inside = false
        for(let i = 0, j = verts.length-1; i < verts.length; j = i++ ) {
            if( ((verts[i][1] > y) != (verts[j][1] > y)) &&
                (x < (verts[j][0] - verts[i][0]) * (y - verts[i][1]) /
                (verts[j][1] - verts[i][1]) + verts[i][0])) {
                    inside = !inside
            }
        }
        return inside
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        let verts = this.getRotatedVertices()
        this.applyStyle(ctx)
        ctx.beginPath()

        // according to the docs, the first lineTo is treated as a moveTo
        for(const vert of verts) {
            ctx.lineTo(this.x_pos + vert[0], this.y_pos + vert[1])
        }

        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }

    public rotate(angle: number): void {
        // the rotation angle is rounded to increase hits in rotation cache at the cost of some precision
        this.rotation = Math.round(angle*100)/100
    }

    // https://stackoverflow.com/a/12161405/19585452
    private getRotatedVertices(): [x: number, y: number][] {
        if(this.rotation == 0) {
            return this.vertices
        }

        let cached_rotation = this.cached_rotations[this.rotation]
        if(cached_rotation) {
            return cached_rotation
        }

        let new_vertices: [x: number, y: number][] = []

        this.vertices.forEach((vert: [x: number, y: number]) => {
            let newX = vert[0]*Math.cos(this.rotation) + vert[1]*Math.sin(this.rotation)
            let newY = vert[1]*Math.cos(this.rotation) - vert[0]*Math.sin(this.rotation)
            new_vertices.push([newX, newY])
        })

        this.cached_rotations[this.rotation] = new_vertices

        return new_vertices
    }
}

// export class CanvasEntityImage implements CanvasEntity {
//     private path: string
//     private vertices: [x: number, y: number][]

//     constructor(x_pos: number, y_pos: number, path: string, vertices: [number, number][], options?: {}) {
//         vertices.forEach(vertex => {
//             this.vertices.push([vertex[0], vertex[1]])
//         })
//     }
// }
