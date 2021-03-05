function setBirthdate(pno) {
    const date = pno.substr(0, 6)
    const day = date.substr(0, 2)
    const month = date.substr(2, 2)
    const year = date.substr(4, 2) > 21 ? `19${date.substr(4, 2)}` : `20${date.substr(4, 2)}` // Not accounting for 100-year olds
    return new Date(`${year}-${month}-${day}`)
}

module.exports = setBirthdate