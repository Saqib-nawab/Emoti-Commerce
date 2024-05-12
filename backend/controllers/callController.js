import asyncHandler from 'express-async-handler';
import CallHistory from '../models/callHistoryModel.js';

import { useSelector } from 'react-redux';

// @desc    Fetch all call histories
// @route   GET /api/callHistories
// @access  Private/Admin
const getCallHistories = asyncHandler(async (req, res) => {
    const callHistories = await CallHistory.find({});
    res.json(callHistories);
});

// @desc    Fetch single call history by ID
// @route   GET /api/callHistories/:id
// @access  Private/Admin
const getCallHistoryById = asyncHandler(async (req, res) => {
    const callHistory = await CallHistory.findById(req.params.id);

    if (callHistory) {
        res.json(callHistory);
    } else {
        res.status(404);
        throw new Error('Call history not found');
    }
});

// @desc    Create a new call history
// @route   POST /api/callHistories
// @access  Private/Admin
const createCallHistory = asyncHandler(async (req, res) => {



    const { username, userPrompt, sentiment, detail_sentiment } = req.body;

    const callHistory = await CallHistory.create({
        username,
        userPrompt,
        sentiment,
        detail_sentiment,
    });

    res.status(201).json(callHistory);
});

// @desc    Update a call history
// @route   PUT /api/callHistories/:id
// @access  Private/Admin
const updateCallHistory = asyncHandler(async (req, res) => {
    const { username, userPrompt, sentiment, detail_sentiment } = req.body;

    const callHistory = await CallHistory.findById(req.params.id);

    if (callHistory) {
        callHistory.username = username;
        callHistory.userPrompt = userPrompt;
        callHistory.sentiment = sentiment;
        callHistory.detail_sentiment = detail_sentiment;

        const updatedCallHistory = await callHistory.save();
        res.json(updatedCallHistory);
    } else {
        res.status(404);
        throw new Error('Call history not found');
    }
});

// @desc    Delete a call history
// @route   DELETE /api/callHistories/:id
// @access  Private/Admin
const deleteCallHistory = asyncHandler(async (req, res) => {
    const callHistory = await CallHistory.findById(req.params.id);

    if (callHistory) {
        await callHistory.remove();
        res.json({ message: 'Call history removed' });
    } else {
        res.status(404);
        throw new Error('Call history not found');
    }
});

export {
    getCallHistories,
    getCallHistoryById,
    createCallHistory,
    updateCallHistory,
    deleteCallHistory,
};
