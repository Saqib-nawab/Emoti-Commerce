import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {


    const [conversation, setConversation] = useState([]);
    const [inputText, setInputText] = useState('');

    const fetchChatbotResponse = async (userInput) => {
        try {
            const res = await axios.post('http://127.0.0.1:3000/chatbot', { prompt: userInput });
            const { label, response } = res.data;

            const updatedConversation = [
                ...conversation,
                { type: 'chatbot', text: response },
                { type: 'user', text: userInput }
            ];

            setConversation(updatedConversation.reverse()); // Reverse to show newest messages first

            if (label === "goodbye") {
                console.log("Chat ended.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        fetchChatbotResponse(inputText);
        setInputText('');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your message"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <div className="input-group-append mx-2">
                                <button className="btn btn-primary" type="submit">Send</button>
                            </div>
                        </div>
                    </form>
                    <div className="conversation-container mt-4">
                        {conversation.map((item, index) => (
                            <div key={index} className={`message-container ${item.type}`}>
                                <div className={`message ${item.type}`}>
                                    <div className="message-content">
                                        {item.type === 'user' && (
                                            <div className="message-text">
                                                <span className="message-name"><i className="fa-solid fa-user"></i>:</span> {item.text}
                                            </div>
                                        )}
                                        {item.type === 'chatbot' && (
                                            <div className="message-text my-2">
                                                <span className="message-name"><i className="fa-solid fa-robot"></i>:</span> {item.text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Add a horizontal line after each user prompt and chatbot response pair */}
                                {index < conversation.length - 1 && <hr />}
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
