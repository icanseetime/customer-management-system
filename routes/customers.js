const express = require('express')
const { createCollection } = require('../models/customer') // TODO: check this
const router = express.Router()

// DB schema
const Customer = require('../models/customer')

// Local functions
const customerDetails = require('../public/javascripts/customerDetails')
const setBirthdate = require('../public/javascripts/setBirthdate')
const generateAccountNumber = require('../public/javascripts/generateAccountNumber')

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
        console.log(customers)
        if (customers.length) {
            customersInfo = customers.map(customer => customerDetails(customer))
            res.render('customers/index', {
                customers: customersInfo,
                searchOptions: req.query
            })
        } else {
            res.render('customers/index', {
                errorMessage: 'There is no customer with this personal number.',
                dbError: false,
                customers: customers,
                searchOptions: req.query || ''
            })
        }
    } catch (err) {
        console.log(err)
        // res.redirect('/')
        res.render('customers/index', {
            errorMessage: 'Something went wrong while trying to find customers. Please try again.',
            dbError: true,
            customers: [],
            searchOptions: req.query || ''
        })
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
router.post('/new', async (req, res) => {
    // Generate account number
    const accountNumber = generateAccountNumber(req.body.acctType)

    // Create ID that correlates with account number (Norwegian standard)
    const id = Number(accountNumber.substr(4, 7))

    // Set birthdate
    const birthdate = setBirthdate(req.body.pno)


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
            }),
            update: false
        })
    } else {
        res.render('customers/update', { customer: new Customer() })
    }
})

router.post('/update', async (req, res) => {
    try {
        // Find customer
        const customer = await Customer.findOne({ personal_number: req.body.customerCheck })

        if (customer) {
            // If data is found
            res.render('customers/update', {
                customer: customer,
                customers: [],
                searchOptions: req.body.pno,
                update: true
            })
        } else {
            // If data is not found
            res.render('customers/update', {
                customer: new Customer(),
                errorMessage: 'There is no customer with this personal number.',
                customers: [],
                searchOptions: req.body.pno || '',
                update: false
            })
        }
    } catch (err) {
        // If something goes wrong when trying to find data
        console.log(err)
        res.render('customers/update', {
            errorMessage: 'Something went wrong while trying to get customer from database. Please try again.',
            customers: customers,
            searchOptions: req.body.pno || '',
            update: false
        })
    }
})

// TODO: check for no updates or remove code
router.put('/:pno', async (req, res) => {
    try {
        // Find customer to update
        const customer = await Customer.findOne({ personal_number: req.params.pno })
        // let customerCopy = Object.create(customer)

        // console.log(customer == customerCopy)
        // console.log(Object.is(customer, customerCopy))

        // Personal number & date of birth
        if (customer.personal_number !== req.body.pno) {
            console.log('This works!')
            customer.personal_number = req.body.pno
            console.log(customer.personal_number)
            customer.date_of_birth = setBirthdate(customer.personal_number)
            console.log(customer.date_of_birth)
        }

        // Names & city
        customer.first_name = customer.first_name == req.body.fName ? customer.first_name : req.body.fName
        customer.last_name = customer.last_name == req.body.fName ? customer.last_name : req.body.lName
        customer.city = customer.city == req.body.city ? customer.city : req.body.city

        // Type of account (generates new account number, but does not update customer ID)
        if (customer.account_number.substring(4, 2) !== req.body.acctType) {
            customer.account_number = generateAccountNumber(req.body.acctType)
        }

        // console.log(customer)
        // console.log(customerCopy)

        // if (Object.is(customer, customerCopy)) {
        //     // If no changes were made
        //     res.render('customers/update', {
        //         searchOptions: '',
        //         customers: [],
        //         successMessage: `No changes were made to customer with personal number ${req.params.pno}.`
        //     })
        // } else {
        // If successfully updated
        await customer.save()
        res.render('customers/update', {
            searchOptions: '',
            customers: [],
            successMessage: `Successfully updated customer with personal number ${req.params.pno}.`
        })
        // }
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