import React, { useState, useEffect } from 'react';
import { getEvents } from '../services/api';
import { 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiUsers, 
  FiFilter, 
  FiRefreshCw,
  FiChevronRight,
  FiInfo,
  FiBookmark,
  FiBell
} from 'react-icons/fi';

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedEvents, setSavedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState(false);

  const counties = [
    'all', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 
    'Uasin Gishu', 'Kakamega', 'Machakos', 'Meru', 'Nyeri'
  ];

  const eventTypes = [
    { value: 'all', label: 'All Events', color: '#006B3F' },
    { value: 'national', label: 'National Holidays', color: '#BB0000' },
    { value: 'participation', label: 'Public Participation', color: '#006B3F' },
    { value: 'community', label: 'Community Events', color: '#1A1A1A' },
  ];

  useEffect(() => {
    fetchEvents();
    const saved = localStorage.getItem('saved_events');
    const attending = localStorage.getItem('attending_events');
    if (saved) setSavedEvents(JSON.parse(saved));
    if (attending) setAttendingEvents(JSON.parse(attending));
  }, []);

  useEffect(() => {
    let filtered = [...events];
    
    if (selectedCounty !== 'all') {
      filtered = filtered.filter(e => e.county === selectedCounty);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(e => e.event_type === selectedType);
    }
    
    filtered.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    
    setFilteredEvents(filtered);
  }, [selectedCounty, selectedType, events]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEvents();
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (err) {
      setError('Unable to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveEvent = (eventId) => {
    let newSaved;
    if (savedEvents.includes(eventId)) {
      newSaved = savedEvents.filter(id => id !== eventId);
    } else {
      newSaved = [...savedEvents, eventId];
    }
    setSavedEvents(newSaved);
    localStorage.setItem('saved_events', JSON.stringify(newSaved));
  };

  const toggleAttendEvent = (eventId) => {
    let newAttending;
    if (attendingEvents.includes(eventId)) {
      newAttending = attendingEvents.filter(id => id !== eventId);
      alert('You have cancelled your attendance');
    } else {
      newAttending = [...attendingEvents, eventId];
      alert('Thank you for confirming your attendance! You will receive reminders before the event.');
    }
    setAttendingEvents(newAttending);
    localStorage.setItem('attending_events', JSON.stringify(newAttending));
  };

  const handleSubscribe = () => {
    setShowSubscribeMessage(true);
    setTimeout(() => {
      setShowSubscribeMessage(false);
    }, 3000);
  };

  const getEventTypeStyle = (type) => {
    switch(type) {
      case 'national':
        return { bg: '#BB0000', label: 'National Holiday' };
      case 'participation':
        return { bg: '#006B3F', label: 'Public Participation' };
      default:
        return { bg: '#1A1A1A', label: 'Community Event' };
    }
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>Public Events</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Discover and participate in national holidays, public forums, and community gatherings across Kenya
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '20px 24px', 
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiFilter size={16} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {(selectedCounty !== 'all' || selectedType !== 'all') && (
            <button onClick={() => { setSelectedCounty('all'); setSelectedType('all'); }} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Clear All Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>County</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {counties.map(county => (
                  <button key={county} onClick={() => setSelectedCounty(county)} style={{ padding: '6px 14px', borderRadius: '20px', border: selectedCounty === county ? 'none' : '1px solid #e9ecef', backgroundColor: selectedCounty === county ? '#006B3F' : 'white', color: selectedCounty === county ? 'white' : '#495057', cursor: 'pointer', fontSize: '13px' }}>
                    {county === 'all' ? 'All Counties' : county}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>Event Type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {eventTypes.map(type => (
                  <button key={type.value} onClick={() => setSelectedType(type.value)} style={{ padding: '6px 14px', borderRadius: '20px', border: selectedType === type.value ? 'none' : '1px solid #e9ecef', backgroundColor: selectedType === type.value ? type.color : 'white', color: selectedType === type.value ? 'white' : '#495057', cursor: 'pointer', fontSize: '13px' }}>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {!loading && !error && (
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Showing <strong style={{ color: '#006B3F' }}>{filteredEvents.length}</strong> events
            {selectedCounty !== 'all' && ` in ${selectedCounty}`}
            {selectedType !== 'all' && ` (${eventTypes.find(t => t.value === selectedType)?.label})`}
          </p>
          {filteredEvents.length > 0 && <p style={{ color: '#6c757d', fontSize: '13px' }}>Sorted by upcoming date</p>}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <p style={{ color: '#6c757d' }}>Loading events...</p>
        </div>
      ) : error ? (
        <div style={{ background: '#FFEBEE', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #FFCDD2' }}>
          <p style={{ color: '#BB0000', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchEvents} className="btn-secondary"><FiRefreshCw size={16} style={{ marginRight: '8px' }} /> Try Again</button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
          <FiCalendar size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>No events found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your filters or check back later for upcoming events</p>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: '28px' }}>
          {filteredEvents.map((event) => {
            const typeStyle = getEventTypeStyle(event.event_type);
            const upcoming = isUpcoming(event.event_date);
            const isSaved = savedEvents.includes(event.id);
            const isAttending = attendingEvents.includes(event.id);
            
            return (
              <div key={event.id} className="card" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease', position: 'relative' }}>
                <div style={{ padding: '20px 24px', background: `linear-gradient(135deg, ${typeStyle.bg} 0%, ${typeStyle.bg}CC 100%)`, color: 'white', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                      <FiInfo size={12} /> {typeStyle.label}
                    </span>
                    <button onClick={() => toggleSaveEvent(event.id)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <FiBookmark size={16} color={isSaved ? '#BB0000' : 'white'} fill={isSaved ? '#BB0000' : 'none'} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', marginTop: '16px', marginBottom: '12px', lineHeight: '1.3' }}>{event.name}</h3>
                  {!upcoming && <span style={{ position: 'absolute', top: '20px', right: '24px', fontSize: '11px', padding: '2px 8px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '20px' }}>Past Event</span>}
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6c757d' }}><FiCalendar size={16} /> <span>{formatDate(event.event_date)}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6c757d' }}><FiMapPin size={16} /> <span>{event.location}, {event.county}</span></div>
                    {event.start_time && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6c757d' }}><FiClock size={16} /> <span>{event.start_time} - {event.end_time}</span></div>}
                  </div>
                  <p style={{ lineHeight: '1.6', color: '#495057', marginBottom: '20px' }}>{event.description}</p>
                  {upcoming ? (
                    <button onClick={() => toggleAttendEvent(event.id)} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: isAttending ? '#1A1A1A' : '#006B3F' }}>
                      <FiUsers size={16} /> {isAttending ? 'Attending' : 'I\'m Attending'} <FiChevronRight size={16} />
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#6c757d', cursor: 'not-allowed' }} disabled>
                      <FiUsers size={16} /> Event Passed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredEvents.length > 0 && (
        <div style={{ marginTop: '48px', padding: '32px', background: 'linear-gradient(135deg, #006B3F 0%, #004D2E 100%)', borderRadius: '16px', textAlign: 'center', color: 'white' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Stay Informed</h3>
          <p style={{ opacity: 0.9, marginBottom: '16px' }}>Get notified about upcoming public participation events in your county</p>
          <button onClick={handleSubscribe} className="btn-primary" style={{ backgroundColor: 'white', color: '#006B3F', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FiBell size={16} /> Subscribe to Updates
          </button>
          {showSubscribeMessage && <div style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '14px' }}>Thank you for subscribing! You will receive notifications about upcoming events.</div>}
        </div>
      )}
    </div>
  );
}

export default Events;
