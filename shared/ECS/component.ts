import { ElementName } from "../shared"

// TODO: use or get rid of this
// function* maskGenerator() {
//     for (let i=0; i<31; i++) {
//         yield 1 << i
//     }
// }
// const maskGen = maskGenerator()

// function nextMask() {
//     let mask = maskGen.next().value
//     if(!mask) {
//         throw new Error("Bit mask limit exceeded")
//     }
//     else {
//         return mask as number
//     }
// }

export abstract class Component {
    abstract bitmask: number
}

export abstract class com {
    public static Position2D = class implements Component {
        public static readonly sBitmask = 1 << 0
        public readonly bitmask: number = com.Position2D.sBitmask
        public x: number
        public y: number

        constructor(x: number, y: number) {
            this.x = x
            this.y = y
        }
    }

    public static ElementType = class implements Component {
        public static readonly sBitmask = 1 << 1
        public readonly bitmask: number = com.ElementType.sBitmask
        public value: ElementName

        constructor(value: ElementName) {
            this.value = value
        }
    }

    public static BoundingBox = class implements Component {
        public static readonly sBitmask = 1 << 2
        public readonly bitmask: number = com.BoundingBox.sBitmask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static ClickEvent = class implements Component {
        public static readonly sBitmask = 1 << 3
        public readonly bitmask: number = com.ClickEvent.sBitmask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static FrameRender = class implements Component {
        public static readonly sBitmask = 1 << 4
        public readonly bitmask: number = com.FrameRender.sBitmask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static Slot = class implements Component {
        public static readonly sBitmask = 1 << 5
        public readonly bitmask: number = com.Slot.sBitmask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static CanvasStyle = class implements Component {
        public static readonly sBitmask = 1 << 6
        public readonly bitmask: number = com.CanvasStyle.sBitmask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }

    public static Vertices2D = class implements Component {
        public static readonly sBitmask = 1 << 7
        public readonly bitmask: number = com.Vertices2D.sBitmask
        public value: any

        constructor(value: any) {
            this.value = value
        }
    }
}
let x = new com.BoundingBox(3)