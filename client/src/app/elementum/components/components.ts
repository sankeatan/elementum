

class Position2D implements Component {
    public readonly bitmask: number = 0b1
    public x: number
    public y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}