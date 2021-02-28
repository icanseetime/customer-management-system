const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    customer_id: {
        type: Number,
        required: true,
        unique: true,
        min: 0000000,
        max: 9999999
    },
    personal_number: {
        type: Number,
        required: true,
        unique: true,
        min: 01010000000,
        max: 31129999999
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
        required: false
    },
    created_date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Customer', customerSchema)