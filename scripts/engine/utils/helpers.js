const isBetween = (num1, num2, value) => value > num1 && value < num2;

const repeat = (func, times) => {
    func(times);
    times && --times && repeat(func, times);
}

const clamp = (value, min, max) => {
    if (value < min) return min;
    else if (value > max) return max;
    return value;
}

export {
    isBetween,
    repeat,
    clamp
};
