import React, { useState, useEffect } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import QB from 'quickblox';
import { QB_CONFIG } from '../utils/quickblox-config';

// Initialize QuickBlox
QB.init(QB_CONFIG.appId, QB_CONFIG.authKey, QB_CONFIG.authSecret);

const { GoogleGenerativeAI } = require("@google/generative-ai");

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // No initial message here
  }, []);

  const handleMessageSend = async () => {
    if (input.trim() !== '') {
      const newMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ]
      const generationConfig = {
        stopSequences: ["red"],
        maxOutputTokens: 200,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
      };

      // Send user's message to the bot and get response
      try {
        const genAI = new GoogleGenerativeAI("AIzaSyADGphaw9y-cM1A45IsAsHK83Pou5xKBHE");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" ,safetySettings , generationConfig});
        const chat = model.startChat();
        const result = await chat.sendMessage(input);
        const response = await result.response;
        const text = response.text();
        const botMessage = { text: text, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending message to bot:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <header className="banner">
        <img src="./logo.jpg" alt="Logo" className="logo" style={{ display: 'block', margin: '0 auto' }} />
        <h1>QuickBlox Chat AI Assistant</h1>
      </header>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === 'bot' ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              message.text
            )}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMessageSend();
            }
          }}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
      <footer className="footer">
        <p>Made with ❤️ by <a href="https://adityaseth.in/linkedin" target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>Aditya</a></p>
        <a href="https://github.com/AdityaSeth777/qbadi" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center' }}>
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" style={{ width: '20px', verticalAlign: 'middle', marginRight: '5px' }} />
          GitHub Repo
        </a>
      </footer>
    </div>
  );
}

export default Chatbot;
