const arrayFlatten = (array) => {
    let num = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            num.push(array[i][j]);
        }
    }
    return num;
}



export default arrayFlatten