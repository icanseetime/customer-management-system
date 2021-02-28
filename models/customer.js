const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    // id: { type: Number, required: true },
    personal_number: { type: Number, required: true },
    // account_number: { type: Number, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    // date_of_birth: { type: Date, required: false }, //Might not need to create date of birth, since this information can be figured out from the personal number
    city: { type: String, required: false }
    // created_date: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Customer', customerSchema)