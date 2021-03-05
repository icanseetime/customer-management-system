const mongoose = require('mongoose')

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

module.exports = mongoose.model('Customer', customerSchema)