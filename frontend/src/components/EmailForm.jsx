import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/emailform.css';

const EmailForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        //trigger alert if anything is missing
        if (!name || !email || !message) {
            console.log("Missing fields detected");
            let missingFields = [];
            if (!name) missingFields.push("Name");
            if (!email) missingFields.push("Email");
            if (!message) missingFields.push("Message");

            setErrorMessage(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return;
        }

        const serviceId = 'service_n4f94ej';
        const templateId = 'template_whdtjf4';
        const publicKey = 'IE5f5EqJgqlZldBZK';

        const templateParams = {
            from_name: name,
            from_email: email,
            to_name: 'Emoti-Commerce',
            message: message,
        };

        emailjs
            .send(serviceId, templateId, templateParams, publicKey)
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
            >
            </textarea>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <button type='submit' className={buttonClicked ? 'clicked' : ''} >
                {buttonClicked ? 'Email Sent' : 'Send Email'}
            </button>

        </form>
    );
};

export default EmailForm;