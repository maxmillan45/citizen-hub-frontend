import React, { useState } from 'react';
import { submitCrimeReport } from '../services/api';

function CrimeReporting() {
  const [report, setReport] = useState({ title: '', description: '', location: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitCrimeReport(report);
      alert('Report submitted anonymously');
      setReport({ title: '', description: '', location: '' });
    } catch (err) {
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '48px' }}>
      <h1>Crime Reporting</h1>
      <p>Report crimes anonymously</p>
      <form onSubmit={handleSubmit} className="card">
        <input type="text" placeholder="Title" value={report.title} onChange={(e) => setReport({...report, title: e.target.value})} required />
        <textarea placeholder="Description" value={report.description} onChange={(e) => setReport({...report, description: e.target.value})} rows="5" required />
        <input type="text" placeholder="Location" value={report.location} onChange={(e) => setReport({...report, location: e.target.value})} required />
        <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Submitting...' : 'Submit Report'}</button>
      </form>
    </div>
  );
}

export default CrimeReporting;
