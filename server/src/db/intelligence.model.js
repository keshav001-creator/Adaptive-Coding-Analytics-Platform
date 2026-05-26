const mongoose = require("mongoose");

const intelligenceSchema = new mongoose.Schema({

    question: {
        type: String,
        required: true,
        unique: true
    },

    priority: {
        type: String
    },

    revisionGapDays: {
        type: Number
    },

    recommendation: {
        type: String
    },

    trendAnalysis: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model("QuestionIntelligence",intelligenceSchema);