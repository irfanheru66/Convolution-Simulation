export const array2DFlatten = (array) => {
    let num = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            num.push(array[i][j]);
        }
    }
    return num;
}

export const arrayObjectFlatten = (arr = []) => {
    let num = []
    arr.map((row, index) => {
        row.value.map((row_2, index_2) => {
            num.push(row_2.value)
        })
    })
    return num
}