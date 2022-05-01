const detectContaining = (containing, container) => {
    if (containing.bounding.leftX >= container.bounding.leftX &&
        containing.bounding.rightX <= container.bounding.rightX &&
        containing.bounding.topY >= container.bounding.topY &&
        containing.bounding.bottomY <= container.bounding.bottomY) {
        return true;
    }
    return false;
}

export default detectContaining;
