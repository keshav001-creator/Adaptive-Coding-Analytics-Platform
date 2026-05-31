const mongoose = require("mongoose");


const globalIntelligenceSchema = new mongoose.Schema({
    key: {
        type: String,
        default: "global_intelligence",
        unique: true
    },
    lastProcessedCount: {
        type: Number,
        default: 0
    },
    weakAreas: [String],
    strongAreas: [String],
    personalizedRecommendations: {
        type: String
    }
}, {
    timestamps: true
}
);


module.exports = mongoose.model("GlobalIntelligence", globalIntelligenceSchema);