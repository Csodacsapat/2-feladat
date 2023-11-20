export function linSpace(numOfSpaces: number, startValue: number = 0, stopValue: number = 1): number[] {
    if (numOfSpaces < 1) {
        return [];
    }
    const arr = [];
    const step = Math.abs((stopValue - startValue)) / (numOfSpaces -1);
    for (let i = 0; i < numOfSpaces; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}
