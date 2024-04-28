import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/emailform.css';
import axios from 'axios';

const EmailForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchChatbotResponse = async () => { //fetch response from chatbot and send it to the person who emailed Team Emoti-Commerce
        try {
            const res = await axios.post('http://127.0.0.1:3000/chatbot', { prompt: message });
            const { label, response } = res.data;
            console.log(label, response);  // Log the chatbot response
            const userTemplateParams = {
                from_name: 'Team Emoti-Commerce',
                to_name: name,
                to_email: email,  // User's email address
                message: `Hi ${name}, we appreciate your concern about "${message}", here's what we can come up with: ${response}`
            };
            const serviceId = 'service_n4f94ej';
            const templateId = 'template_v9myi9u';
            const publicKey = 'IE5f5EqJgqlZldBZK';

            emailjs.send(serviceId, templateId, userTemplateParams, publicKey)
                .then((response) => {
                    console.log(`Email reply sent to ${name} successfully!`, response);
                    setName('');
                    setEmail('');
                    setMessage('');
                    setButtonClicked(true);
                    setErrorMessage('');
                    setTimeout(() => {
                        setButtonClicked(false);
                    }, 1000);
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                });

        } catch (error) {
            console.error('Error with chatbot response:', error);
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !message) {
            console.log("Missing fields detected");
            let missingFields = [];
            if (!name) missingFields.push("Name");
            if (!email) missingFields.push("Email");
            if (!message) missingFields.push("Message");

            setErrorMessage(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return;
        }

        await fetchChatbotResponse(); // Ensure chatbot is called here

        const serviceId = 'service_n4f94ej';
        const templateId = 'template_whdtjf4';
        const publicKey = 'IE5f5EqJgqlZldBZK';

        const templateParams = {
            from_name: name,
            from_email: email,
            to_name: 'Emoti-Commerce',
            message: message,
        };

        // const usertemplateParams = {
        //     from_name: 'Team Emoti-Commerce',
        //     to_name: name,
        //     message: response,
        // };

        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully!', response);
                setName('');
                setEmail('');
                setMessage('');
                setButtonClicked(true);
                setErrorMessage('');
                setTimeout(() => {
                    setButtonClicked(false);
                }, 1000);
            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit} className='emailForm'>
            <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
                cols="30"
                rows="10"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            {errorMessage && <div className="error">{errorMessage}</div>}
            <button type='submit' className={buttonClicked ? 'clicked' : ''}>
                {buttonClicked ? 'Email Sent' : 'Send Email'}
            </button>
        </form>
    );
};

export default EmailForm;
