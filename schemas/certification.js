const mongoose = require('mongoose')

const certificationSchema = mongoose.Schema({
    userId: { type: String },
    verifyCode: { type: String },
})

const Certification = mongoose.model('Certification', certificationSchema)
module.exports = Certification
