const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        fileReader.onload = () => {
            resolve(fileReader.result.substr(fileReader.result.indexOf(',') + 1))
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

export default convertBase64