export const removeArrItem = (arr: any[], item: any) => {
    const copiedItems = [...arr];
    const index = copiedItems.indexOf(item);
    copiedItems.splice(index, 1);
    return copiedItems
}