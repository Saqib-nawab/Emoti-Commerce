import mongoose from 'mongoose';

const callHistorySchema = new mongoose.Schema({
    username: String,
    sentiment: String,
    detail_sentiment: [[
        {
            label: String,
            score: Number,
        }
    ]],
    userPromptsArr: {
        type: [String],
        required: true // Make sure this array is required
    },
    chatbotResponsesArr: {
        type: [String],
        required: true // Make sure this array is required
    },
});

const CallHistory = mongoose.model('CallHistory', callHistorySchema);

export default CallHistory;


