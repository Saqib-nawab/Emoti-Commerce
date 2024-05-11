import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CallHistoryComponent = () => {
    const [callHistory, setCallHistory] = useState([]);

    useEffect(() => {
        const fetchCallHistory = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/callHistories');
                setCallHistory(response.data);
            } catch (error) {
                console.error('Error fetching call history:', error);
            }
        };

        fetchCallHistory();
    }, []);

    return (
        <div>
            <ul>
                {callHistory.map((call) => (
                    <li key={call._id}>
                        <p>Username: {call.username}</p>
                        <p>User Prompt: {call.userPrompt}</p>
                        <p>Sentiment: {call.sentiment}</p>
                        <p>Detail Sentiment:</p>
                        <ul>
                            {call.detail_sentiment.map((subArray, index) => (
                                <li key={index}>
                                    <p>Array {index + 1}:</p>
                                    <ul>
                                        {subArray.map((item, subIndex) => (
                                            <li key={subIndex}>
                                                <p>Label: {item.label}</p>
                                                <p>Score: {item.score}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CallHistoryComponent;
