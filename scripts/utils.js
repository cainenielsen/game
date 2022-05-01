const elById = (id) => {
    let element = document.getElementById(id);
    if (element !== null) {
        return element;
    } else {
        throw new Error('Element does not exist');
    }
};

const copyToClipBoard = async (level) => {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(JSON.stringify(level.tiles));
    }
}

export {
    elById,
    copyToClipBoard
}
