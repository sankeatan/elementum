export function clamp(input: number, min: number, max: number) {
    if(input <= min) {
        return min
    }
    else if( input >= max) {
        return max
    }
    else {
        return input
    }
}
