import React, { useRef, useEffect } from 'react';
import './Chat.css'
const Chat = ({ messages }) => {
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${(message.talkingAboutYou) ? "user" : ""}`}>
                        {message.message}
                    </div>
                ))}
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Chat;
