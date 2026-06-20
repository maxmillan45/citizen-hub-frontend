import React, { useState, useEffect } from 'react';
import { submitCrimeReport, getMyReports } from '../services/api';
import { FiAlertTriangle, FiMapPin, FiFileText, FiCheckCircle, FiClock, FiXCircle, FiSend } from 'react-icons/fi';

function CrimeReporting() {
  const [report, setReport] = useState({
    category: 'theft',
    description: '',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [myReports, setMyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'theft', label: 'Theft', icon: FiAlertTriangle, color: '#BB0000' },
    { value: 'assault', label: 'Assault', icon: FiAlertTriangle, color: '#D4A017' },
    { value: 'corruption', label: 'Corruption', icon: FiAlertTriangle, color: '#1A1A1A' },
    { value: 'land_dispute', label: 'Land Dispute', icon: FiAlertTriangle, color: '#006B3F' },
    { value: 'other', label: 'Other', icon: FiAlertTriangle, color: '#6c757d' },
  ];

  const statusColors = {
    'pending': { color: '#D4A017', icon: FiClock, label: 'Pending Review' },
    'investigating': { color: '#006B3F', icon: FiAlertTriangle, label: 'Under Investigation' },
    'resolved': { color: '#28a745', icon: FiCheckCircle, label: 'Resolved' },
    'dismissed': { color: '#6c757d', icon: FiXCircle, label: 'Dismissed' },
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    setLoadingReports(true);
    try {
      const response = await getMyReports();
      const data = response.data;
      const reportsArray = data.results || [];
      setMyReports(reportsArray);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await submitCrimeReport({
        category: report.category,
        description: report.description,
        location: report.location
      });
      setSuccess('Your crime report has been submitted successfully. You will receive updates on the status.');
      setReport({
        category: 'theft',
        description: '',
        location: ''
      });
      fetchMyReports();
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
    }
  };

  const getCategoryLabel = (value) => {
    const cat = categories.find(c => c.value === value);
    return cat ? cat.label : value;
  };

  const getStatusInfo = (status) => {
    return statusColors[status] || { color: '#6c757d', icon: FiClock, label: status };
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>Crime Reporting</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Report crimes anonymously. Your identity will be protected and all reports are confidential.
        </p>
      </div>

      <div className="grid grid-2" style={{ gap: '32px' }}>
        {/* Report Form */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiAlertTriangle size={20} color="#BB0000" />
            Submit a Report
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#495057' }}>
                Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = report.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setReport({...report, category: cat.value})}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: isSelected ? 'none' : '1px solid #e9ecef',
                        backgroundColor: isSelected ? cat.color : 'white',
                        color: isSelected ? 'white' : '#495057',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Icon size={14} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#495057' }}>
                <FiFileText size={14} style={{ marginRight: '6px' }} />
                Description
              </label>
              <textarea
                placeholder="Describe the incident in detail..."
                value={report.description}
                onChange={(e) => setReport({...report, description: e.target.value})}
                rows="5"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#495057' }}>
                <FiMapPin size={14} style={{ marginRight: '6px' }} />
                Location
              </label>
              <input
                type="text"
                placeholder="Where did this happen?"
                value={report.location}
                onChange={(e) => setReport({...report, location: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: '#FFEBEE',
                color: '#BB0000',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <FiCheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !report.description || !report.location}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px'
              }}
            >
              <FiSend size={16} />
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>

        {/* My Reports */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            My Reports ({myReports.length})
          </h2>

          {loadingReports ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
              <p style={{ color: '#6c757d' }}>Loading your reports...</p>
            </div>
          ) : myReports.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <FiFileText size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
              <p style={{ color: '#6c757d' }}>You haven't submitted any reports yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myReports.map((report) => {
                const StatusIcon = getStatusInfo(report.status).icon;
                return (
                  <div key={report.id} className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        backgroundColor: '#E9ECEF',
                        fontSize: '12px',
                        color: '#495057'
                      }}>
                        {getCategoryLabel(report.category)}
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: getStatusInfo(report.status).color
                      }}>
                        <StatusIcon size={14} />
                        {getStatusInfo(report.status).label}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#495057', marginBottom: '8px' }}>
                      {report.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#6c757d' }}>
                      <span><FiMapPin size={12} style={{ marginRight: '4px' }} />{report.location}</span>
                      <span>{formatDate(report.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrimeReporting;