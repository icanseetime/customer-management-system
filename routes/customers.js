const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')

// GET
// Find customer
router.get('/', async (req, res) => {
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
            res.render('customers/index', {
                customers: customers,
                searchOptions: req.query
            })
        } else {
            // Fix the code so this doesn't display when rendered the first time
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
    const customer = new Customer({
        personal_number: req.body.pno,
        first_name: req.body.fName,
        last_name: req.body.lName,
        city: req.body.city
    })

    try {
        const newCustomer = await customer.save()
        // res.redirect(`customers/${newCustomer.id}`)
        res.redirect(`customers`)
    } catch (err) {
        console.log(err)
        res.render('customers/new', {
            customer: customer,
            errorMessage: 'Something went wrong when trying to create the new customer. Please try again.'
        })
    }
})

module.exports = router