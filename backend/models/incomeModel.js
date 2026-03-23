import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
     type: {
        type: String,
        default: 'income',
    },
}, {
    timestamps: true,
}); 

const incomeModel = mongoose.model('income', incomeSchema) || mongoose.models.income
export default incomeModel;