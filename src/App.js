import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const presetContentLists = [
  'lên nào anh em ơi',
  'anh em siêng cày thế',
  'gắng lên nào',
  'quẩy lên nào anh em ơi',
  'nghỉ ngơi ăn uống thôi nào anh em',
  'anh em lên level 7 hết chưa nào',
  'cô gắng thôi nao anh em',
  'cày lên lv mà trầy trật quá , vất vả quá',
  'anh em đâu hết cả rồi nhỉ , chiến đấu mạnh tay lên',
  'chiến mạnh lên nào anh em ơi',
  'cày lên lv, em sắp lên 1 rồi, haha',
  'nhiều anh em vẫn chăm chỉ cày',
  'chúc mừng sếp, em cũng sắp lên',
  'ăn xong rồi giờ ngồi chat với anh em',
  'ngủ gì nữa, chat mạnh đi chứ',
  'thôi nghỉ ăn cơm đây các bác à',
  'Lm việc nhà bác ko full time đc Rảnh lên lm vài tin'
];

function App() {
  const [authorization, setAuthorization] = useState('');
  const [chatID, setChatID] = useState('');
  const [contentListType, setContentListType] = useState('custom'); // 'custom' or 'preset'
  const [customContentList, setCustomContentList] = useState('');
  const [presetContentList, setPresetContentList] = useState('');
  const [contentList] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [timeInterval, setTimeInterval] = useState(1); 
  const currentIndexRef = React.useRef(0);

  useEffect(() => {
    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, [intervalId]);

  const makeAPICall = async () => {
    if (!contentList.length && !presetContentList.length) {
      stop();
      window.alert('Content list is empty.');
      return;
    }
  
    const selectedContentList = contentListType === 'custom' ? customContentList : presetContentList;
    const splitted = selectedContentList.split('\n').filter((item) => item.trim() !== '');
    const selectedContent = splitted[currentIndexRef.current];
  
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
      currentIndexRef.current += 1;
  
      if (currentIndexRef.current >= splitted.length) {
        currentIndexRef.current = 0;
      }
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

  const handleContentListTypeChange = (e) => {
    setContentListType(e.target.value);
    if(contentListType === 'preset'){
      setPresetContentList(presetContentLists.join('\n'))
    }
  };

  const handleCustomContentListChange = (e) => {
    setCustomContentList(e.target.value);
  };

  const handlePresetContentListChange = (e) => {
    setPresetContentList(e.target.value);
  };

  const handleTimeIntervalChange = (e) => {
    const inputValue = e.target.value;
    const decimalValue = parseFloat(inputValue).replace(',','.');
  
    if (!isNaN(decimalValue) && decimalValue > 0) {
      setTimeInterval(decimalValue);
    } else {
      console.error('Invalid time interval input. Please enter a positive number.');
    }
  };

  const submit = () => {
    makeAPICall();
  
    const id = setInterval(() => {
      makeAPICall();
    }, timeInterval * 1000);
    
    // window.alert('Sending Message')
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
          Set Time Interval (seconds):
          <input
            type="text"
            value={timeInterval}
            onChange={handleTimeIntervalChange}
          />
        </label>
        <label>
          Select Content List Type:
          <select value={contentListType} onChange={handleContentListTypeChange}>
            <option value="custom">Custom Content List</option>
            <option value="preset">Preset Content List</option>
          </select>
        </label>
        {contentListType === 'custom' ? (
          <label>
            Enter Custom Content List (one item per line):
            <textarea
              rows="10"
              value={customContentList}
              onChange={handleCustomContentListChange}
            />
          </label>
        ) : (
          <label>
            Enter Preset Content List (one item per line):
            <textarea
              rows="10"
              value={presetContentList}
              onChange={handlePresetContentListChange}
            />
          </label>
        )}
        <button onClick={submit}>Send Message</button>
        <button onClick={stop}>Stop Sending Message</button>
      </div>
    </div>
  );
}

export default App;
