import { map } from "rxjs"

export class CanvasEntityCollection {
    public displayObjects: CanvasEntity[] = []
    // not used currently. may want to implement for scaling the collection for different canvas sizes
    public scale: number = 1.0

    draw(ctx: CanvasRenderingContext2D): void {
        //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        this.displayObjects.forEach(element => {
            element.draw(ctx)
        })
    }

    getClicked(x: number, y: number, bringToFront: boolean = false): CanvasEntity {
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

    add(displayObject: CanvasEntity): void {
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

    applyStyle(ctx: CanvasRenderingContext2D): void {
        for(const property in this.style) {
            ctx[property] = this.style[property]
        }

        if(this.toggle){
            ctx.fillStyle=this.alternateColor
        } else {
            ctx.fillStyle=ctx.fillStyle
        }
    }

    abstract isInside(x:number, y: number): boolean
    abstract draw(ctx: CanvasRenderingContext2D): void
}

export class RectangleCanvasEntity extends CanvasEntity {
    public readonly width: number
    public readonly height: number
    // TODO: allow modification of width and height

    constructor(x_pos: number, y_pos: number, width: number, height: number, options?: {}) {
        super(x_pos, y_pos, options)
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
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }
}

export class CircleCanvasEntity extends CanvasEntity {
    radius: number

    constructor(x_pos: number, y_pos: number, radius: number, options?: {}) {
        super(x_pos, y_pos, options)
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

export class PolygonCanvasEntity extends CanvasEntity {
    private vertices: [x: number, y: number][] = []
    private rotation: {angle:number, anchor_x:number, anchor_y:number} = {angle:0 ,anchor_x:0 ,anchor_y:0}
    private cached_rotations: any = {}
    private rotation_anchor: {x:number, y:number} = {x:0, y:0}

    constructor(x_pos: number, y_pos: number, vertices: [number, number][], options?: {}) {
        super(x_pos, y_pos, options)
        vertices.forEach(vertex => {
            this.vertices.push([vertex[0], vertex[1]])
        })
    }

    // https://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    isInside(x: number, y: number): boolean {
        let verts = this.getRotatedVertices()
        x -= this.x_pos
        y -= this.y_pos
        let i: number, j: number, c: boolean = false
        for(i = 0, j = verts.length-1; i < verts.length; j = i++ ) {
            if( ( ( verts[i][1] > y ) != ( verts[j][1] > y ) ) &&
                ( x < ( verts[j][0] - verts[i][0] ) * ( y - verts[i][1] ) /
                ( verts[j][1] - verts[i][1] ) + verts[i][0] ) ) {
                    c = !c
            }
        }
        return c
    }

    draw(ctx: CanvasRenderingContext2D): void {
        console.log(this.rotation[0])
        let verts = this.getRotatedVertices()
        console.log(this.rotation)
        this.applyStyle(ctx)
        ctx.beginPath()
        // ctx.moveTo(this.x_pos + verts[0][0], this.y_pos + verts[0][1])
        for(let i=0; i<verts.length; i++) {
            ctx.lineTo(this.x_pos + verts[i][0], this.y_pos + verts[i][1])
        }
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }

    rotate(rotation: {angle: number, anchor_x: number, anchor_y: number}) {
        this.rotation.angle = Math.round(rotation.angle*100)/100
        this.rotation.anchor_x = Math.round(rotation.anchor_x*10)/10
        this.rotation.anchor_y = Math.round(rotation.anchor_y*10)/10
    }

    // https://stackoverflow.com/a/12161405/19585452
    getRotatedVertices() {
        if(this.rotation.angle == 0 && this.rotation.anchor_x == 0 && this.rotation.anchor_y == 0) {
            return this.vertices
        }

        let angle = this.rotation.angle
        let anchor_x =  this.rotation.anchor_x
        let anchor_y = this.rotation.anchor_y
        let rotation_key = [this.rotation.angle, this.rotation.anchor_x, this.rotation.anchor_y].toString()
        let cached_rotation = this.cached_rotations[rotation_key]

        if(cached_rotation) {
            return cached_rotation
        }
        else {
            let new_vertices: [x: number, y: number][] = []
            this.vertices.forEach((vert: [x: number, y:number]) => {
                let newX = anchor_x + (vert[0]-anchor_x)*Math.cos(angle) - (vert[1]-anchor_y)*Math.sin(angle)
                let newY = anchor_y + (vert[0]-anchor_x)*Math.sin(angle) + (vert[1]-anchor_y)*Math.cos(angle)
                new_vertices.push([newX, newY])
            })
            this.cached_rotations[[angle, anchor_x, anchor_y].toString()] = new_vertices
            // TODO: cache multiple rotations?
            return new_vertices
        }
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