import React, { useState, useRef, useEffect } from 'react';
import './CallScreen.css'; // Make sure to create a corresponding CSS file for styling
import defaultImage from './default.jpeg';
import axios from 'axios';
import { useSelector } from 'react-redux';


const CallScreen = () => {
    const userInfo = useSelector((state) => state.auth.userInfo);
    const [name, setName] = useState('User');

    useEffect(() => {
        if (userInfo && userInfo.name) {
            setName(userInfo.name);
        }
    }, [userInfo]);

    const [callActive, setCallActive] = useState(false);
    const [callPause, setCallPause] = useState(true);
    const [callMute, setCallMute] = useState(false);
    const [reminder, setReminder] = useState(false);
    const [follow, setFollow] = useState(false);
    const [isCallConnected, setCallConnected] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    const handleCallConnect = () => {
        setCallConnected(true);
    };

    // Function that gets called when the call disconnects
    const handleCallDisconnect = () => {
        setCallConnected(false);
    };

    // Dynamic class for the ripple effect
    const rippleClass = callActive ? 'connected' : ''; //for ripples when call is connected
    const recognitionRef = useRef(null);
    const speechSynthRef = useRef(window.speechSynthesis);

    // React useEffect hook that runs when the callActive state changes
    useEffect(() => {
        if (callActive) {
            // Log and announce the start of an active call
            console.log("Call is active, initiating welcome message and listening.");
            // Speak out a welcome message and start listening after speaking
            speakOut("Welcome, how can I help you?", () => startListening());
        } else {
            // Log and handle the deactivation of a call
            console.log("Call has been deactivated.");
            if (recognitionRef.current) {
                // Stop any ongoing speech recognition
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
            // Speak out a goodbye message when the call is deactivated
            // speakOut("Thank you for using our service. Goodbye!");
        }
    }, [callActive]);  // Depend on callActive to trigger this effect

    // Function to handle speech synthesis
    const speakOut = (text, callback) => {
        setSpeaking(false);
        // Create a speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        // Define what to do when the speech ends
        utterance.onend = () => callback && callback();
        // Start speaking
        speechSynthRef.current.speak(utterance);
    };

    // Function to handle the chatbot's response
    const handleResponse = (responseText) => {
        // Log the response from the chatbot
        console.log('Response from chatbot:', responseText);
        // Speak out the response and start listening again after a delay
        speakOut(responseText, () => {
            if (callActive) {
                // Delay before starting to listen again to give the user time to respond
                setTimeout(() => {
                    startListening();
                }, 1000);
            }
        });
    };

    // Function to start speech recognition
    const startListening = () => {
        // Check if the call is still active before starting to listen
        if (!callActive) {
            console.log("Call is not active, not starting speech recognition.");
            return;
        }
        console.log("Starting speech recognition.");
        setSpeaking(true);
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.continuous = true;  // Continue listening until explicitly stopped
        recognitionRef.current.interimResults = false;  // Only consider final results

        // Handle the results from speech recognition
        recognitionRef.current.onresult = event => {
            const lastResult = event.results[event.resultIndex];
            if (lastResult.isFinal) {
                const userPrompt = lastResult[0].transcript;
                console.log('Recognized Speech:', userPrompt);
                recognitionRef.current.stop();  // Stop recognition to process speech
                // Send the user's speech to the backend
                axios.post('http://127.0.0.1:3000/chatbot', { prompt: userPrompt })
                    .then(response => {
                        const responseText = response.data.response;
                        console.log('Chatbot response:', responseText);
                        handleResponse(responseText);


                        // Perform sentiment analysis on the user's speech
                        axios.post('http://127.0.0.1:3000/analyze_sentiment', { comment: userPrompt })
                            .then(sentimentResponse => {
                                console.log('Sentiment analysis result:', sentimentResponse.data);
                                // Handle sentiment analysis result if needed
                            })
                            .catch(sentimentError => {
                                console.error('Sentiment analysis request failed:', sentimentError);
                            });
                    })
                    .catch(error => console.error('Error making the API call:', error));
            }
        };

        // Handle errors in speech recognition
        recognitionRef.current.onerror = event => {
            console.error('Speech recognition error:', event.error);
            if (callActive) {
                speakOut("I didn't catch that, could you please repeat?");
            }
            setTimeout(() => {
                startListening();
            }, 1000);
        };

        // Define what happens when speech recognition ends
        recognitionRef.current.onend = () => {
            console.log("Speech recognition ended.");
            if (callActive) {
                console.log("Automatically restarting speech recognition.") // Automatically restart speech recognition after a short delay
            }
        };

        // Start the speech recognition service
        recognitionRef.current.start();
    };

    // Function to initiate a call
    const startCall = () => {
        console.log("Starting call.");
        setCallActive(true);
    };

    const endCall = () => {
        // TODO: Implement end call logic
        setCallActive(false);
        setCallPause(true);
        setCallMute(true); //

        console.log("Ending call.");
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setCallActive(false);
        speakOut("Thank you for using our service. Goodbye!");
    };

    const handlePause = () => {
        setCallPause(!callPause);
    }
    const handleMute = () => {
        setCallMute(!callMute);
    }

    const handleFollow = () => {
        setFollow(!follow);
    }

    const handleReminder = () => {
        setReminder(!reminder);
    }

    return (
        <div className="callscreen-wrapper">
            <div className="callscreen-header">
                <div className="left-content">
                    <span className="name"><i className="fa-solid fa-person"></i>    {name}</span>

                    <span className="phone"><i className="fa-solid fa-phone"></i>  +92-310-6241365</span>
                </div>

                {speaking ? (
                    <p className='speaking' ><i class="fa-solid fa-bullhorn"></i></p>
                ) : (
                    <p className='speaking' ><i class="fa-solid fa-hourglass-start"></i></p>
                )}


                <div className="right-content">
                    <div className="controls">
                        {reminder ? (
                            <button className="genreal-button" onClick={handleReminder}>
                                <i className="fa-solid fa-bell"></i>
                            </button>
                        ) : (
                            <button className="genreal-off-button" onClick={handleReminder}>
                                <i className="fa-solid fa-bell-slash"></i>
                            </button>
                        )}
                    </div>

                    <div className="controls">
                        {follow ? (
                            <button className="vvibrant-followed-button" onClick={handleFollow}>
                                Followed
                            </button>
                        ) : (
                            <button className="vibrant-follow-us-button" onClick={handleFollow}>
                                Follow Us
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="callscreen-container">
                <div className={`profile-image ${rippleClass}`}>
                    <img src={defaultImage} alt="Profile" />
                </div>
            </div>

            <div className="callscreen-footer">
                <p></p>
                <div className='callscreen-footer-mid'>
                    <div className="controls">
                        {!callActive ? (
                            <button className="call-button" onClick={startCall}>
                                <i className="fa-solid fa-phone-volume"></i>
                            </button>
                        ) : (
                            <button className="end-call-button" onClick={endCall}>
                                <i className="fa-solid fa-phone-volume"></i>
                            </button>
                        )}
                    </div>
                    <div className="controls">
                        {!callPause ? (
                            <button className="genreal-button" onClick={handlePause}>
                                <i className="fa-solid fa-pause"></i>
                            </button>
                        ) : (
                            <button className="genreal-off-button" onClick={handlePause}>
                                <i className="fa-solid fa-play"></i>
                            </button>
                        )}
                    </div>
                    <div className="controls">
                        {!callMute ? (
                            <button className="genreal-button" onClick={handleMute}>
                                <i className="fa-solid fa-microphone-lines"></i>
                            </button>
                        ) : (
                            <button className="genreal-off-button" onClick={handleMute}>
                                <i className="fa-solid fa-microphone-lines-slash"></i>
                            </button>
                        )}
                    </div>
                </div>
                <p></p>
            </div>
        </div>
    );
};


export default CallScreen;