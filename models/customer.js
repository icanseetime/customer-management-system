const mongoose = require('mongoose')
const calcLatency = require('../scripts/latency')

const customerSchema = new mongoose.Schema({
    customer_id: {
        type: Number,
        required: true,
        unique: true,
        min: 3000000,
        max: 9999999
    },
    personal_number: {
        type: String,
        required: true,
        unique: true
    },
    account_number: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// Custom middleware for calculating latency
// Customer.find()
customerSchema.pre('find', () => {
    this.start = Date.now()
})

customerSchema.post('find', () => {
    const latency = (Date.now() - this.start)
    calcLatency(latency, 'find')
})

// Customer.save()
customerSchema.pre('save', () => {
    this.start = Date.now()
})

customerSchema.post('save', () => {
    const latency = (Date.now() - this.start)
    calcLatency(latency, 'save')
})

// Customer.deleteOne()
customerSchema.pre('deleteOne', () => {
    this.start = Date.now()
})

customerSchema.post('deleteOne', () => {
    const latency = (Date.now() - this.start)
    calcLatency(latency, 'deleteOne')
})

module.exports = mongoose.model('Customer', customerSchema)