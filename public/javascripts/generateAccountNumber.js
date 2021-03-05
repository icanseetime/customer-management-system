function generateAccountNumber(accountType) {
    // Create random account number
    let beforeControlNum = numsBeforeControlNum(accountType)

    // Get control number for account with mod11 (Norwegian standard)
    return beforeControlNum + mod11(beforeControlNum, accountType).toString()
}

function numsBeforeControlNum(accountType) {
    const bankReg = '1234'
    let customerNo = Math.floor(Math.random() * 10000).toString()
    return bankReg + accountType + customerNo
}

// Get control number for account with mod11 (Norwegian standard)
function mod11(account, accountType) {
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < account.length; i++) {
        sum += Number(account[i]) * weights[i]
    }
    const ctrlNum = (11 - (sum % 11))
    if (ctrlNum == 11) {
        return '0'
    } else if (ctrlNum == 10) {
        let beforeControlNum = numsBeforeControlNum(accountType)
        return mod11(beforeControlNum)
    } else {
        return ctrlNum
    }
}

module.exports = generateAccountNumber
