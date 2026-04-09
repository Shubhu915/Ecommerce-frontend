const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: String,
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }
}, {
    timestamps: true
});

// Middleware to update slug before saving
categorySchema.pre('save', function() {
    this.slug = this.name.split(' ').join('-').toLowerCase();
});

module.exports = mongoose.model('Category', categorySchema);
