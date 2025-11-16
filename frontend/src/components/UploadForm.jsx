import React from 'react';
import { Formik, Form } from 'formik';
import styles from './UploadForm.module.css';

const initialValues = {
  file: null,
  lat: '',
  lon: '',
  minConf: '0.25',
};

const validate = (values) => {
  const errors = {};

  if (!values.file) {
    errors.file = 'Please select an audio file';
  }

  if (values.lat !== '' && Number.isNaN(Number(values.lat))) {
    errors.lat = 'Latitude must be a number';
  }

  if (values.lon !== '' && Number.isNaN(Number(values.lon))) {
    errors.lon = 'Longitude must be a number';
  }

  if (values.minConf !== '') {
    const parsed = parseFloat(values.minConf);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
      errors.minConf = 'Enter a value between 0 and 1';
    }
  }

  return errors;
};

function UploadForm({ loading, onSubmit, onFileSelected }) {
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={async (values, formikHelpers) => {
        try {
          await onSubmit(values, formikHelpers);
        } finally {
          formikHelpers.setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
      }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="file" className={styles.label}>Audio File</label>
            <input
              type="file"
              id="file"
              accept="audio/*"
              onChange={(event) => {
                const selectedFile = event.currentTarget.files?.[0] ?? null;
                setFieldValue('file', selectedFile, true);
                setFieldTouched('file', true, false);
                if (selectedFile) {
                  onFileSelected?.();
                }
              }}
              disabled={loading || isSubmitting}
              className={styles.fileInput}
            />
            {values.file && <p className={styles.fileInfo}>Selected: {values.file.name}</p>}
            {touched.file && errors.file && <p className={styles.errorText}>{errors.file}</p>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="lat" className={styles.label}>Latitude (optional)</label>
              <input
                type="number"
                id="lat"
                name="lat"
                step="any"
                value={values.lat}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., 35.4244"
                disabled={loading || isSubmitting}
                className={styles.textInput}
              />
              {touched.lat && errors.lat && <p className={styles.errorText}>{errors.lat}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lon" className={styles.label}>Longitude (optional)</label>
              <input
                type="number"
                id="lon"
                name="lon"
                step="any"
                value={values.lon}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., -120.7463"
                disabled={loading || isSubmitting}
                className={styles.textInput}
              />
              {touched.lon && errors.lon && <p className={styles.errorText}>{errors.lon}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="minConf" className={styles.label}>Minimum Confidence</label>
            <input
              type="number"
              id="minConf"
              name="minConf"
              min="0"
              max="1"
              step="0.05"
              value={values.minConf}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || isSubmitting}
              className={styles.textInput}
            />
            {touched.minConf && errors.minConf && <p className={styles.errorText}>{errors.minConf}</p>}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              isSubmitting ||
              Object.keys(errors).length > 0
            }
            className={styles.submitButton}
          >
            {loading || isSubmitting ? 'Analyzing...' : 'Analyze Audio'}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default UploadForm;
