import React, { useState, useEffect } from 'react';
import { getEvents } from '../services/api';
import { 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiFilter, 
  FiRefreshCw,
  FiChevronRight,
  FiInfo,
  FiBookmark,
  FiBell,
  FiDollarSign
} from 'react-icons/fi';

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedEvents, setSavedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState(false);

  const locations = [
    'all', 'Nairobi'
  ];

  const categories = [
    { value: 'all', label: 'All Events', color: '#006B3F' },
    { value: 'public_holiday', label: 'Public Holiday', color: '#BB0000' },
    { value: 'town_hall', label: 'Town Hall', color: '#006B3F' },
    { value: 'civic_education', label: 'Civic Education', color: '#1A1A1A' },
    { value: 'community_meeting', label: 'Community Meeting', color: '#D4A017' },
    { value: 'parliament', label: 'Parliament', color: '#1A1A1A' },
    { value: 'government', label: 'Government', color: '#006B3F' },
    { value: 'health', label: 'Health', color: '#BB0000' },
    { value: 'environment', label: 'Environment', color: '#006B3F' },
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
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(e => e.location && e.location.includes(selectedLocation));
    }
    
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setFilteredEvents(filtered);
  }, [selectedCategory, selectedLocation, events]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEvents();
      const data = response.data;
      const eventsArray = data.results || [];
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load events. Please try again later.');
      setEvents([]);
      setFilteredEvents([]);
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

  const getCategoryStyle = (category) => {
    const styles = {
      'public_holiday': { bg: '#BB0000', label: 'Public Holiday' },
      'town_hall': { bg: '#006B3F', label: 'Town Hall' },
      'civic_education': { bg: '#1A1A1A', label: 'Civic Education' },
      'community_meeting': { bg: '#D4A017', label: 'Community Meeting' },
      'parliament': { bg: '#1A1A1A', label: 'Parliament' },
      'government': { bg: '#006B3F', label: 'Government' },
      'health': { bg: '#BB0000', label: 'Health' },
      'environment': { bg: '#006B3F', label: 'Environment' },
    };
    return styles[category] || { bg: '#6c757d', label: 'Event' };
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

  const getCategoryLabel = (category) => {
    const labels = {
      'public_holiday': 'Public Holiday',
      'town_hall': 'Town Hall',
      'civic_education': 'Civic Education',
      'community_meeting': 'Community Meeting',
      'parliament': 'Parliament',
      'government': 'Government',
      'health': 'Health',
      'environment': 'Environment'
    };
    return labels[category] || category;
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>Public Events</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Discover and participate in public events, holidays, and community gatherings across Kenya
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiFilter size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {(selectedCategory !== 'all' || selectedLocation !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Clear All Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                <FiMapPin size={14} style={{ marginRight: '6px' }} />
                Location
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: selectedLocation === location ? 'none' : '1px solid #e9ecef',
                      backgroundColor: selectedLocation === location ? '#006B3F' : 'white',
                      color: selectedLocation === location ? 'white' : '#495057',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {location === 'all' ? 'All Locations' : location}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                <FiInfo size={14} style={{ marginRight: '6px' }} />
                Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: selectedCategory === cat.value ? 'none' : '1px solid #e9ecef',
                      backgroundColor: selectedCategory === cat.value ? cat.color : 'white',
                      color: selectedCategory === cat.value ? 'white' : '#495057',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.label}
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
            {selectedLocation !== 'all' && ` in ${selectedLocation}`}
            {selectedCategory !== 'all' && ` (${getCategoryLabel(selectedCategory)})`}
          </p>
          {filteredEvents.length > 0 && (
            <p style={{ color: '#6c757d', fontSize: '13px' }}>
              Sorted by upcoming date
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <p style={{ color: '#6c757d' }}>Loading events...</p>
        </div>
      ) : error ? (
        <div style={{ 
          background: '#FFEBEE', 
          borderRadius: '12px', 
          padding: '40px', 
          textAlign: 'center',
          border: '1px solid #FFCDD2'
        }}>
          <p style={{ color: '#BB0000', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchEvents} className="btn-secondary">
            <FiRefreshCw size={16} style={{ marginRight: '8px' }} /> Try Again
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center',
          border: '1px solid #f0f0f0'
        }}>
          <FiCalendar size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>No events found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your filters or check back later for upcoming events</p>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: '28px' }}>
          {filteredEvents.map((event) => {
            const categoryStyle = getCategoryStyle(event.category);
            const upcoming = isUpcoming(event.date);
            const isSaved = savedEvents.includes(event.id);
            const isAttending = attendingEvents.includes(event.id);
            
            return (
              <div 
                key={event.id} 
                className="card"
                style={{ 
                  padding: '0',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  padding: '20px 24px',
                  background: `linear-gradient(135deg, ${categoryStyle.bg} 0%, ${categoryStyle.bg}CC 100%)`,
                  color: 'white',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      <FiInfo size={12} />
                      {categoryStyle.label}
                    </span>
                    <button
                      onClick={() => toggleSaveEvent(event.id)}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <FiBookmark size={16} color={isSaved ? '#BB0000' : 'white'} fill={isSaved ? '#BB0000' : 'none'} />
                    </button>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    marginTop: '16px',
                    marginBottom: '12px',
                    lineHeight: '1.3'
                  }}>
                    {event.title}
                  </h3>
                  
                  {!upcoming && (
                    <span style={{
                      position: 'absolute',
                      top: '20px',
                      right: '24px',
                      fontSize: '11px',
                      padding: '2px 8px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: '20px'
                    }}>
                      Past Event
                    </span>
                  )}
                </div>

                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6c757d' }}>
                      <FiCalendar size={16} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '14px' }}>{formatDate(event.date)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6c757d' }}>
                      <FiMapPin size={16} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '14px' }}>{event.location}</span>
                    </div>
                    {event.organizer && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6c757d' }}>
                        <FiUsers size={16} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '14px' }}>Organized by: {event.organizer}</span>
                      </div>
                    )}
                    {!event.is_free && event.fee_amount && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6c757d' }}>
                        <FiDollarSign size={16} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '14px' }}>Fee: KES {event.fee_amount}</span>
                      </div>
                    )}
                    {event.is_free && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#006B3F' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Free Entry</span>
                      </div>
                    )}
                  </div>

                  <p style={{ 
                    lineHeight: '1.6', 
                    color: '#495057',
                    marginBottom: '20px'
                  }}>
                    {event.description}
                  </p>

                  {upcoming ? (
                    <button 
                      onClick={() => toggleAttendEvent(event.id)}
                      className="btn-primary"
                      style={{ 
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: isAttending ? '#1A1A1A' : '#006B3F'
                      }}
                    >
                      <FiUsers size={16} />
                      {isAttending ? 'Attending' : 'I\'m Attending'}
                      <FiChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      className="btn-primary"
                      style={{ 
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: '#6c757d',
                        cursor: 'not-allowed'
                      }}
                      disabled
                    >
                      <FiUsers size={16} />
                      Event Passed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredEvents.length > 0 && (
        <div style={{ 
          marginTop: '48px',
          padding: '32px',
          background: 'linear-gradient(135deg, #006B3F 0%, #004D2E 100%)',
          borderRadius: '16px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Stay Informed</h3>
          <p style={{ opacity: 0.9, marginBottom: '16px' }}>
            Get notified about upcoming public events in your area
          </p>
          <button 
            onClick={handleSubscribe}
            className="btn-primary" 
            style={{ backgroundColor: 'white', color: '#006B3F', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <FiBell size={16} />
            Subscribe to Updates
          </button>
          {showSubscribeMessage && (
            <div style={{ 
              marginTop: '16px', 
              padding: '8px 16px', 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              Thank you for subscribing! You will receive notifications about upcoming events.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Events;