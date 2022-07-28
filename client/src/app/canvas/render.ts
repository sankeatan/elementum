type Style = {[key: string]: any}

export abstract class CanvasRender {
    constructor() {
    }

    public abstract isInside(x:number, y: number): boolean
    public abstract draw(ctx: CanvasRenderingContext2D, x: number, y: number): void
    public abstract rotate(angle: number): void
}

export abstract class SimpleCanvasRender extends CanvasRender{
    // a render that applies a style and then draws a shape

    public style: Style = {
        fillStyle: 'white',
        strokeStyle: 'black',
        lineWidth: 6
    }

    constructor(style?: Style) {
        super()
        for(const [key, value] of Object.entries(style)) {
            this.style[key] = value
        }
    }

    protected applyStyle(ctx: CanvasRenderingContext2D): void {
        for(const property in this.style) {
            ctx[property] = this.style[property]
        }
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        this.applyStyle(ctx)
        this.drawShape(ctx, x, y)
    }

    protected abstract drawShape(ctx: CanvasRenderingContext2D, x: number, y: number): void
}

export class CircleCanvasRender extends SimpleCanvasRender {
    public radius: number
    private rotation: number // TODO: use this to rotate gradient

    constructor(radius: number, style?: Style) {
        super(style)
        this.radius = radius
    }

    public isInside(x: number, y: number): boolean {
        return Math.pow((x),2) + Math.pow((y),2) <= Math.pow(this.radius,2)
    }

    protected drawShape(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        this.applyStyle(ctx)
        ctx.beginPath()
        ctx.arc(x, y, this.radius, 0, 2*Math.PI)
        ctx.stroke()
        ctx.fill()
    }

    public rotate(angle: number): void {
        this.rotation = (this.rotation + angle) % (2*Math.PI)
    }
}

export class PolygonCanvasRender extends SimpleCanvasRender {
    private vertices: [x: number, y: number][] = []
    private rotation: number = 0
    private cached_rotations: {[key:number]: [x: number, y: number][]} = {}

    constructor(vertices: [number, number][], style?: Style) {
        super(style)
        vertices.forEach(vertex => {
            this.vertices.push([vertex[0], vertex[1]])
        })
    }

    // https://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    public isInside(x: number, y: number): boolean {
        let verts = this.getRotatedVertices()
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

    protected drawShape(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        let verts = this.getRotatedVertices()
        ctx.beginPath()

        // according to the docs, the first lineTo is treated as a moveTo
        for(const vert of verts) {
            ctx.lineTo(x + vert[0], y + vert[1])
        }

        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }

    public rotate(angle: number): void {
        this.setRotation((this.rotation + angle))
    }

    public setRotation(angle: number): void {
        // the rotation angle is rounded to increase hits in rotation cache at the cost of some precision
        this.rotation = Math.round((angle%(2*Math.PI))*100)/100
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

export class RectangleCanvasRender extends PolygonCanvasRender {
    // TODO: allow modification of width and height
    public readonly width: number
    public readonly height: number

    constructor(width: number, height: number, style?: Style) {
        let vertices: [x: number, y: number][] = [
            [-width/2, -height/2],
            [width/2, -height/2],
            [width/2, height/2],
            [-width/2, height/2],
        ]
        super(vertices, style)
        this.width = width
        this.height = height
    }
}

// export class ImageCanvasRender implements CanvasRender {
//     private path: string
//     private vertices: [x: number, y: number][]

//     constructor(x_pos: number, y_pos: number, path: string, vertices: [number, number][], options?: {}) {
//         vertices.forEach(vertex => {
//             this.vertices.push([vertex[0], vertex[1]])
//         })
//     }
// }