import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const App = () => {
  const [wordFrequency, setWordFrequency] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);
    fetch('https://www.terriblytinytales.com/test.txt')
      .then(response => response.text())
      .then(data => {
        const words = data.split(/\s+/);
        const frequency = words.reduce((acc, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {});
        setWordFrequency(frequency);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  const handleExportClick = () => {
    let csvContent = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, frequency]) => `${word},${frequency}`)
    csvContent.unshift("Word, Frequency")
    csvContent = csvContent.join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'frequency.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const histogramData = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, frequency]) => ({ word, frequency }));

  return (
    <div>
      <button type="button" onClick={handleButtonClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>

      {histogramData.length > 0 && (
        <div>
          <h2>Word Frequency Histogram:</h2>
          <BarChart width={600} height={400} data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#8884d8" />
          </BarChart>
          <button type="button" onClick={handleExportClick}>
            Export
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
