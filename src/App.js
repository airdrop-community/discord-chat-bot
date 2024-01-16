import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [authorization, setAuthorization] = useState('');
  const [chatID, setChatID] = useState('');
  const [contentList, setContentList] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [timeInterval, setTimeInterval] = useState(1); 
  const currentIndexRef = React.useRef(0);

  useEffect(() => {
    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, [intervalId]);

  const makeAPICall = async () => {
    if (contentList.length === 0) {
      stop();
      window.alert('Content list is empty.');
      return;
    }
    const splitted = contentList.split('\n').filter((item) => item.trim() !== '');
    const selectedContent = splitted[currentIndexRef.current];
    if(!selectedContent){
      currentIndexRef.current = 0;
    } else {
      currentIndexRef.current += 1;
    }

    try {
      const response = await axios.post(
        `https://discord.com/api/v9/channels/${chatID}/messages`,
        {
          content: selectedContent,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authorization,
          },
        }
      );
      console.log('API Response send message successful: ', response.data.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAuthorizationChange = (e) => {
    setAuthorization(e.target.value);
  };

  const handleChatIDChange = (e) => {
    setChatID(e.target.value);
  };

  const handleContentListChange = (e) => {
    setContentList(e.target.value);
  };

  const handleTimeIntervalChange = (e) => {
    const inputValue = Number(e.target.value);
  
    if (!isNaN(inputValue) && inputValue > 0) {
      setTimeInterval(inputValue);
    } else {
      console.error('Invalid time interval input. Please enter a positive number.');
    }
  };

  const submit = () => {
    makeAPICall();
  
    const id = setInterval(() => {
      makeAPICall();
    }, timeInterval * 60 * 1000);
    
    window.alert('Sending Message')
    setIntervalId(id);
  };

  const stop = () => {
    currentIndexRef.current = 0;
    clearInterval(intervalId);
    setIntervalId(null);
  };

  return (
    <div className="container">
      <div className="input-group">
        <label>
          Enter Authorization:
          <input
            type="text"
            value={authorization}
            onChange={handleAuthorizationChange}
          />
        </label>
        <br />
        <label>
          Enter chatID:
          <input
            type="text"
            value={chatID}
            onChange={handleChatIDChange}
          />
        </label>
        <label>
          Set Time Interval (minutes):
          <input
            type="number"
            value={timeInterval}
            onChange={handleTimeIntervalChange}
          />
        </label>
        <label>
          Enter Content List (one item per line):
          <textarea
            rows="20"
            value={contentList}
            onChange={handleContentListChange}
          />
        </label>
        <button onClick={submit}>Send Message</button>
        <button onClick={stop}>Stop Sending Message</button>
      </div>
    </div>
  );
}

export default App;
