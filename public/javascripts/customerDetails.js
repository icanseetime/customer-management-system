function customerDetails({ customer_id, personal_number, account_number, first_name, last_name, date_of_birth, city, created_date }) {
    // Format PNO
    const pno = `${personal_number.substr(0, 6)} ${personal_number.substr(6, 5)}`

    // Merge names
    const fullName = `${first_name} ${last_name}`

    // Format account number
    const accNo = `${account_number.substr(0, 4)}.${account_number.substr(4, 2)}.${account_number.substr(6, 5)}`

    // Set account type
    let accountType = account_number.substr(4, 2)
    switch (accountType) {
        case '30':
            accountType = 'Investment account'
            break
        case '40':
            accountType = 'Savings account'
            break
        case '50':
            accountType = 'Deposit account'
            break
        case '60':
            accountType = 'Current account'
            break
    }

    // Format DOB
    const birthdate = formatDate(date_of_birth)

    // Format 'customer since'
    const sinceDate = formatDate(created_date)

    return {
        cid: customer_id,
        pno,
        accNo,
        accountType,
        fullName,
        birthdate,
        city,
        sinceDate
    }
}

function formatDate(iso) {
    iso = new Date(iso)
    return iso.toLocaleDateString('no-NO')
}

module.exports = customerDetails