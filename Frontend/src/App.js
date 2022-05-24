import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    getEmailAndPassword();
  }, []);

  const handleGettingNewToken = async () => {
    try {
      const response = await axios.post('http://localhost:5000/gettingNewToken', {
        email,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        setTokens((prevTokens) => [...prevTokens, data.token]);

        // Save tokens to local file
        const fileData = tokens.join('\n');
        saveTokensToFile(fileData, 'tokens.txt');
      } else {
        console.log(data.error); // Handle registration error
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getEmailAndPassword = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      const data = response.data;

      if (response.status === 200) {
        setTokens(data);
      } else {
        console.log(data.error); // Handle error getting email and password
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const saveTokensToFile = (fileData, fileName) => {
    const element = document.createElement('a');
    const file = new Blob([fileData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold">Get New Token For QLik Account</h1>
      <div className="w-80">
        <input
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleGettingNewToken}
        >
          Getting Token
        </button>
      </div>
      {tokens.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full mt-8">
          <h2 className="w-full mb-4 text-2xl font-bold text-center">Saved Tokens:</h2>
          <ul className="flex flex-col flex-wrap items-center justify-center w-4/5 space-x-2">
            {tokens.map((token, index) => (
              <li
                className="w-4/5 px-4 py-2 my-2 bg-gray-200 rounded-md"
                key={index}
              >
                <p>Email: {token.email}</p>
                <p>Password: {token.password}</p>
                <p className='break-words '>Token: {token.token}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
 