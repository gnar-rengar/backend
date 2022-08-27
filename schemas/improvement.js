const mongoose = require('mongoose')

const improvementSchema = mongoose.Schema({
    context: { type: String },
})

const Improvement = mongoose.model('Improvement', improvementSchema)
module.exports = Improvement
