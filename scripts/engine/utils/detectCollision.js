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
function detectCollision2(bounding1, dimensions1, bounding2, dimensions2) {
    const xDistance = (bounding1.leftX + dimensions1.width / 2) - (bounding2.leftX + dimensions2.width / 2);
    const yDistance = (bounding1.topY + dimensions1.height / 2) - (bounding2.topY + dimensions2.height / 2);

    const width = (dimensions1.width + dimensions2.width) / 2;
    const height = (dimensions1.height + dimensions2.height) / 2;

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

export {
    detectCollision,
    detectCollision2
};
