const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    reviewedId: { type: String },
    reviewerId: { type: [String] },
    goodReview: [
        {
            description: { type: String },
            count: { type: Number }
        }
    ],
    badReview: [
        {
            description: { type: String },
            count: { type: Number }
        }
    ]
})


const Review = mongoose.model("Review", reviewSchema)
module.exports = Review