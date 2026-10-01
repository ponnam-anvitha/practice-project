const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        marks: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        grade: {
            type: String,
            required: true
        },

        result: {
            type: String,
            enum: ['Pass', 'Fail'],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Marks', marksSchema);