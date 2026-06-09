import React, { useState } from 'react';

function Crime() {
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: '',
    incidentDate: '',
    anonymity: 'full'
  });
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted({
        reference: 'CR-' + Date.now(),
        date: new Date().toLocaleDateString()
      });
      setFormData({
        category: '',
        location: '',
        description: '',
        incidentDate: '',
        anonymity: 'full'
      });
      setLoading(false);
    }, 1000);
  };

  const categories = [
    { value: 'theft', label: 'Theft / Robbery' },
    { value: 'assault', label: 'Assault / GBV' },
    { value: 'corruption', label: 'Corruption / Bribery' },
    { value: 'land', label: 'Land Dispute' },
    { value: 'police', label: 'Police Misconduct' },
    { value: 'domestic', label: 'Domestic Violence' },
    { value: 'cyber', label: 'Cybercrime' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <h1 className="heading-1">Crime Reporting</h1>
      <p className="text-muted" style={{ marginBottom: '32px' }}>Report crimes anonymously. Your identity is protected.</p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="card">
          <h2 className="heading-3">Report an Incident</h2>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Crime Category *</label>
              <select name="category" className="input-field" value={formData.category} onChange={handleChange} required>
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Location *</label>
              <input type="text" name="location" className="input-field" placeholder="Enter location address" value={formData.location} onChange={handleChange} required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Incident Date & Time *</label>
              <input type="datetime-local" name="incidentDate" className="input-field" value={formData.incidentDate} onChange={handleChange} required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description *</label>
              <textarea name="description" className="input-field" rows="4" placeholder="Describe what happened..." value={formData.description} onChange={handleChange} required />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Anonymity Level</label>
              <select name="anonymity" className="input-field" value={formData.anonymity} onChange={handleChange}>
                <option value="full">Fully Anonymous - No information shared</option>
                <option value="pseudo">Pseudonymous - Show as Verified Citizen</option>
                <option value="public_map">Show on Map - Help others stay safe</option>
                <option value="named">Named - Police can contact me</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 className="heading-3">Why Report Anonymously?</h2>
            <ul style={{ marginTop: '16px', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Your safety is our priority</li>
              <li>Reports help identify crime hotspots</li>
              <li>Data is shared with authorities while protecting you</li>
              <li>You can track your report status</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="heading-3">What Happens After Reporting?</h2>
            <ol style={{ marginTop: '16px', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>You receive a unique reference number</li>
              <li>Your report is reviewed by our team</li>
              <li>Relevant authorities are notified</li>
              <li>You can track the status online</li>
            </ol>
          </div>
        </div>
      </div>

      {submitted && (
        <div className="card" style={{ marginTop: '32px', backgroundColor: '#E8F5E9' }}>
          <h3 style={{ marginBottom: '16px' }}>Report Submitted Successfully</h3>
          <p><strong>Reference Number:</strong> {submitted.reference}</p>
          <p><strong>Date Submitted:</strong> {submitted.date}</p>
          <p style={{ marginTop: '16px', fontSize: '14px' }}>Save your reference number to track this report.</p>
        </div>
      )}
    </div>
  );
}

export default Crime;
