const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true,
        enum: ['tech', 'art', 'design', 'other']
    },
    description: { 
        type: String, 
        required: true 
    },
    projectPhotos: [{ 
        type: String,
        required: true 
    }],
    projectVideo: { 
        type: String 
    },
    innovatorName: { 
        type: String, 
        required: true 
    },
    innovatorContact: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);
