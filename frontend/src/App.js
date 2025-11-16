import React, { useState } from 'react';
import axios from 'axios';
import layoutStyles from './layout.module.css';
import UploadForm from './components/UploadForm';
import ResultsPanel from './components/ResultsPanel';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelected = () => {
    setError(null);
    setResults(null);
  };

  const handleSubmit = async (values) => {
    if (!values.file) {
      setError('Please select an audio file');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', values.file);
    if (values.lat) formData.append('lat', values.lat);
    if (values.lon) formData.append('lon', values.lon);

    const parsedMinConf = parseFloat(values.minConf);
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
          loading={loading}
          onSubmit={handleSubmit}
          onFileSelected={handleFileSelected}
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

