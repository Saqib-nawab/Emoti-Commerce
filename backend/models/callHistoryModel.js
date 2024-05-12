import mongoose from 'mongoose';

const callHistorySchema = mongoose.Schema({
    name: String,
    userPrompt: String,
    sentiment: String,
    detail_sentiment: [[{
        label: String,
        score: Number,
        _id: String
    }]]
});

const CallHistory = mongoose.model('CallHistory', callHistorySchema);

export default CallHistory;
