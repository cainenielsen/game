const clearBrush = 'rgba(255, 255, 255, 0)';

const detectCollision = (bounding1, bounding2) => {
    if (bounding1.leftX <= bounding2.rightX && // if 1 left is less than 2 right
        bounding1.rightX >= bounding2.leftX && // if 1 right is more than 2 left
        bounding1.topY <= bounding2.bottomY && // if 1 top is less than 2 bottom
        bounding1.bottomY >= bounding2.topY) { // if 1 bottom is more than 2 top
        return true;
    }
    return false;
};
