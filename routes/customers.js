const express = require('express')
const { createCollection } = require('../models/customer')
const router = express.Router()
const Customer = require('../models/customer')

const customerDetails = require('../public/javascripts/customerDetails')

// GET
// Find customer view
router.get('/', (req, res) => {
    res.render('customers/index', {
        searchOptions: '',
        customers: []
    })
})

// Check if customer exists in database
router.get('/find', async (req, res) => {
    try {
        const customers = await Customer.find({ personal_number: req.query.customerCheck })
        if (customers.length) {
            customersInfo = customers.map(customer => customerDetails(customer))
            res.render('customers/index', {
                customers: customersInfo,
                searchOptions: req.query
            })
        } else {
            res.render('customers/index', {
                errorMessage: 'There is no customer with this personal number.',
                customers: customers,
                searchOptions: req.query || ''
            })
        }
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// POST
// New customer
router.get('/new', (req, res) => {
    if (req.query.pno) {
        res.render('customers/new', {
            customer: new Customer({
                personal_number: req.query.pno
            })
        })
    } else {
        res.render('customers/new', { customer: new Customer() })
    }
})

// Create new customer
router.post('/', async (req, res) => {
    // Create random account number
    const bankReg = '1234'
    const typeOfAcct = req.body.acctType
    let customerNo = Math.floor(Math.random() * 10000).toString()
    let beforeControlNum = bankReg + typeOfAcct + customerNo

    // Get control number for account with mod11 (Norwegian standard)
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
            customerNo = Math.floor(Math.random() * 10000).toString()
            beforeControlNum = bankReg + typeOfAcct + customerNo
            return mod11(beforeControlNum)
        } else {
            return ctrlNum
        }
    }
    const accountNumber = beforeControlNum + mod11(beforeControlNum).toString()

    // Create ID that correlates with account number (Norwegian standard)
    const id = Number(accountNumber.substr(4, 7))

    // Set birthdate
    const pno = req.body.pno
    const date = pno.substr(0, 6)
    const day = date.substr(0, 2)
    const month = date.substr(2, 2)
    const year = date.substr(4, 2) > 21 ? `19${date.substr(4, 2)}` : `20${date.substr(4, 2)}` // Not accounting for 100-year olds
    const birthdate = new Date(`${year}-${month}-${day}`)

    // Create customer object
    const customer = new Customer({
        customer_id: id,
        personal_number: req.body.pno,
        account_number: accountNumber,
        first_name: req.body.fName,
        last_name: req.body.lName,
        date_of_birth: birthdate,
        city: req.body.city
    })

    try {
        const newCustomer = await customer.save()
        // res.redirect(`customers`)
        res.render('customers/index', {
            customers: [],
            searchOptions: {
                customerCheck: req.body.pno
            }
        })
    } catch (err) {
        console.log(err)
        res.render('customers/new', {
            customer: customer,
            errorMessage: 'Something went wrong when trying to create the new customer. Please check the form and try again.'
        })
    }
})

// UPDATE
router.get('/update', (req, res) => {
    if (req.query.pno) {
        res.render('customers/update', {
            customer: new Customer({
                personal_number: req.query.pno
            })
        })
    } else {
        res.render('customers/update', { customer: new Customer() })
    }
})

router.put('/:pno', async (req, res) => {
    try {
        await Customer.updateOne({ personal_number: req.params.pno })
        res.render('customers/update', {
            searchOptions: '',
            customers: [],
            successMessage: `Successfully updated customer with personal number ${req.params.pno}.`
        })
    } catch {
        res.render('customers/update', {
            customer: new Customer({
                personal_number: req.params.pno
            }),
            searchOptions: '',
            customers: [],
            errorMessage: `Could not update customer with personal number ${req.params.pno}. Please try again.`
        })
    }
})

// DELETE
// Delete customer-page
router.get('/delete', (req, res) => {
    if (req.query.pno) {
        res.render('customers/delete', {
            customer: new Customer({
                personal_number: req.query.pno
            }),
            searchOptions: '',
            customers: []
        })
    } else {
        res.render('customers/delete', {
            customer: new Customer(),
            searchOptions: '',
            customers: []
        })
    }
})

// Get customers
router.post('/delete', async (req, res) => {
    try {
        const customers = await Customer.find({ personal_number: req.body.customerCheck })
        if (customers.length) {
            customersInfo = customers.map(customer => customerDetails(customer))
            res.render('customers/delete', {
                customers: customersInfo,
                pno: req.body.customerCheck,
                searchOptions: req.query
            })
        } else {
            res.render('customers/delete', {
                errorMessage: 'There is no customer with this personal number, please try again.',
                customer: new Customer(),
                customers: customers,
                searchOptions: req.query || ''
            })
        }
    } catch {
        res.redirect('/customers/delete')
    }
})

// Delete customer by ID
router.delete('/:pno', async (req, res) => {
    try {
        await Customer.deleteOne({ personal_number: req.params.pno })
        res.render('customers/delete', {
            searchOptions: '',
            customers: [],
            successMessage: `Successfully deleted customer with personal number ${req.params.pno}.`
        })
    } catch {
        res.render('customers/delete', {
            customer: new Customer({
                personal_number: req.params.pno
            }),
            searchOptions: '',
            customers: [],
            errorMessage: `Could not delete customer with personal number ${req.params.pno}. Please try again.`
        })
    }
})

module.exports = router