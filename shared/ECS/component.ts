import { ElementName } from "../shared"
import { Entity } from "./entity"

// TODO: use or get rid of this
function* indexGen() {
    for (let i=0; i<31; i++) {
        yield i
    }
}

const maskGen = indexGen()

function nextIndex() {
    let index = maskGen.next().value
    if(!index) {
        throw new Error("Index limit exceeded")
    }
    else {
        return index as number
    }
}

export abstract class Component {
    abstract mask: number
}

export abstract class c {
    public static Position = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = c.Position.mask
        public x: number
        public y: number

        constructor(x: number, y: number) {
            this.x = x
            this.y = y
        }
    }

    public static ElementType = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.ElementType.mask
        public value: ElementName

        constructor(value: ElementName) {
            this.value = value
        }
    }

    public static BoundingShape = class implements Component {
        public static readonly index = nextIndex()
        public mask = 1 << c.BoundingShape.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static EventHandler = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.EventHandler.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static Renderer = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.Renderer.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static Slot = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.Slot.mask
        public occupant: Entity | null = null

        constructor(initialOccupant?: Entity) {
            if(initialOccupant) {
                this.occupant = initialOccupant
            }
        }
    }
}
