import { ElementName } from "../shared"

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
    public static Position2D = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = c.Position2D.mask
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

    public static BoundingBox = class implements Component {
        public static readonly index = nextIndex()
        public mask = 1 << c.BoundingBox.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static ClickEvent = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.ClickEvent.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static FrameRender = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.FrameRender.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static Slot = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.Slot.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static CanvasStyle = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.CanvasStyle.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static Vertices2D = class implements Component {
        public static readonly index = nextIndex()
        public static readonly mask = 1 << this.index
        public readonly mask = 1 << c.Vertices2D.mask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }
}
let x = new c.BoundingBox(3)
