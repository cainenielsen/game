const clearBrush = 'rgba(255, 255, 255, 0)';

const detectContaining = (containing, container) => {
    if (containing.bounding.leftX >= container.bounding.leftX &&
        containing.bounding.rightX <= container.bounding.rightX &&
        containing.bounding.topY >= container.bounding.topY &&
        containing.bounding.bottomY <= container.bounding.bottomY) {
        return true;
    }
    return false;
}

const detectCollision = (rec1, rec2) => {
    if (rec1.bounding.leftX <= rec2.bounding.rightX && // if 1 left is less than 2 right
        rec1.bounding.rightX >= rec2.bounding.leftX && // if 1 right is more than 2 left
        rec1.bounding.topY <= rec2.bounding.bottomY && // if 1 top is less than 2 bottom
        rec1.bounding.bottomY >= rec2.bounding.topY) { // if 1 bottom is more than 2 top
        return true;
    }
    return false;
};

// https://stackoverflow.com/questions/29861096/detect-which-side-of-a-rectangle-is-colliding-with-another-rectangle
function detectCollision2(rec1, rec2) {
    const xDistance = (rec1.bounding.leftX + rec1.dimensions.width / 2) - (rec2.bounding.leftX + rec2.dimensions.width / 2);
    const yDistance = (rec1.bounding.topY + rec1.dimensions.height / 2) - (rec2.bounding.topY + rec2.dimensions.height / 2);

    const width = (rec1.dimensions.width + rec2.dimensions.width) / 2;
    const height = (rec1.dimensions.height + rec2.dimensions.height) / 2;

    const crossWidth = width * yDistance;
    const crossHeight = height * xDistance;

    let collision = 'none';

    if (Math.abs(xDistance) <= width && Math.abs(yDistance) <= height) {
        if (crossWidth > crossHeight) {
            collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
        } else {
            collision = (crossWidth > - (crossHeight)) ? 'right' : 'top';
        }
    }

    return (collision);
}

const isBetween = (num1, num2, value) => value > num1 && value < num2;

const repeat = (func, times) => {
    func(times);
    times && --times && repeat(func, times);
}
