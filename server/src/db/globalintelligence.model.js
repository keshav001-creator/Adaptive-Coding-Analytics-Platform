const mongoose = require("mongoose");


const globalIntelligenceSchema = new mongoose.Schema({

    weakAreas: [String],
    strongAreas: [String],
    personalizedRecommendations: {
        type:String
    },
},{
    timestamps:true
}
);


module.exports = mongoose.model("GlobalIntelligence", globalIntelligenceSchema);