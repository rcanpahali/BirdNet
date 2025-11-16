import React from 'react';
import styles from './UploadForm.module.css';

function UploadForm({
  file,
  lat,
  lon,
  minConf,
  loading,
  onFileChange,
  onLatChange,
  onLonChange,
  onMinConfChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="file" className={styles.label}>Audio File</label>
        <input
          type="file"
          id="file"
          accept="audio/*"
          onChange={onFileChange}
          disabled={loading}
          className={styles.fileInput}
        />
        {file && <p className={styles.fileInfo}>Selected: {file.name}</p>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="lat" className={styles.label}>Latitude (optional)</label>
          <input
            type="number"
            id="lat"
            step="any"
            value={lat}
            onChange={onLatChange}
            placeholder="e.g., 35.4244"
            disabled={loading}
            className={styles.textInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lon" className={styles.label}>Longitude (optional)</label>
          <input
            type="number"
            id="lon"
            step="any"
            value={lon}
            onChange={onLonChange}
            placeholder="e.g., -120.7463"
            disabled={loading}
            className={styles.textInput}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="minConf" className={styles.label}>Minimum Confidence</label>
        <input
          type="number"
          id="minConf"
          min="0"
          max="1"
          step="0.05"
          value={minConf}
          onChange={onMinConfChange}
          disabled={loading}
          className={styles.textInput}
        />
      </div>

      <button type="submit" disabled={loading || !file} className={styles.submitButton}>
        {loading ? 'Analyzing...' : 'Analyze Audio'}
      </button>
    </form>
  );
}

export default UploadForm;
