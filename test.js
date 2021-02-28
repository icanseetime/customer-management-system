// // Create birthdate from pno
// const now = Date.now()
// console.log(now)

// const pno = 14059342631
// let date = pno.toString().substr(0, 6) //140593
// const day = date.substr(0, 2)
// const month = date.substr(2, 2)
// const year = date.substr(4, 2) > 21 ? `19${date.substr(4, 2)}` : `20${date.substr(4, 2)}`

// const birthdate = new Date(`${year}-${month}-${day}`)
// console.log(birthdate)

// Create random account number
const bankReg = '1234'
const typeOfAcct = '00'
let customerNo = Math.floor(Math.random() * 10000).toString()
let beforeControlNum = bankReg + typeOfAcct + customerNo

// Get control number for account with mod11
function mod11(account) {
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    sum = 0
    for (let i = 0; i < account.length; i++) {
        sum += Number(account[i]) * weights[i]
    }
    const ctrlNum = (11 - (sum % 11))
    if (ctrlNum == 11) {
        return '0'
    } else if (ctrlNum == 10) {
        customerNo = Math.floor(Math.random() * 10000)
        beforeControlNum = bankReg + typeOfAcct + customerNo
        return mod11(beforeControlNum)
    } else {
        return ctrlNum
    }
}
const accountNumber = beforeControlNum + mod11(beforeControlNum).toString()
console.log(accountNumber)
// console.log('0'.toString())