import React, { useState } from 'react';
import axios from 'axios';
import layoutStyles from './layout.module.css';
import UploadForm from './components/UploadForm';
import ResultsPanel from './components/ResultsPanel';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [minConf, setMinConf] = useState('0.25');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResults(null);
    }
  };

  const handleLatChange = (e) => {
    setLat(e.target.value);
  };

  const handleLonChange = (e) => {
    setLon(e.target.value);
  };

  const handleMinConfChange = (e) => {
    setMinConf(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const parsedMinConf = parseFloat(minConf);
    formData.append('min_conf', Number.isFinite(parsedMinConf) ? parsedMinConf : 0.25);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={layoutStyles.app}>
      <div className={layoutStyles.container}>
        <header className={layoutStyles.header}>
          <h1 className={layoutStyles.title}>Bird Sound Analyzer</h1>
          <p className={layoutStyles.subtitle}>Upload an audio file to detect bird species</p>
        </header>

        <UploadForm
          file={file}
          lat={lat}
          lon={lon}
          minConf={minConf}
          loading={loading}
          onFileChange={handleFileChange}
          onLatChange={handleLatChange}
          onLonChange={handleLonChange}
          onMinConfChange={handleMinConfChange}
          onSubmit={handleSubmit}
        />

        {error && (
          <div className={layoutStyles.errorMessage}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {results && <ResultsPanel results={results} />}
      </div>
    </div>
  );
}

export default App;

