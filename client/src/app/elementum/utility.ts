export function clamp(input: number, min: number, max: number): number {
    return input <= min ? min : input >= max ? max : input
}

// https://stackoverflow.com/a/2450976
export function shuffleArray<T>(array: T[]): T[] {
    let shuffleArray = [...array]

    for (let i = shuffleArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        let swap = shuffleArray[i]
        shuffleArray[i] = shuffleArray[j]
        shuffleArray[j] = swap
    }

    return shuffleArray
}
