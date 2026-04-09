const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    images: [{
        url: String,
        alt: String
    }],
    stock: {
        type: Number,
        default: 0
    },
    ratings: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    // For AI Discovery & Semantic Search
    aiMetadata: {
        primaryColor: String,
        style: String,
        season: String,
        keywords: [String],
        embedding: [Number] // For vector search if using Atlas Search/Pinecone
    }
}, {
    timestamps: true
});

productSchema.pre('save', function() {
    if (this.isModified('name')) {
        this.slug = this.name.split(' ').join('-').toLowerCase();
    }
});

module.exports = mongoose.model('Product', productSchema);
