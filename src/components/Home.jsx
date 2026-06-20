import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBookOpen, 
  FiMessageSquare, 
  FiBookmark, 
  FiHelpCircle, 
  FiUsers, 
  FiShield,
  FiTrendingUp,
  FiClock,
  FiFlag,
  FiMapPin,
  FiBarChart2,
  FiRefreshCw,
  FiInfo,
  FiUser
} from 'react-icons/fi';
import { getHistoryFacts, getProfile } from '../services/api';

const carouselImages = [
  {
    url: 'https://www.economist.com/cdn-cgi/image/width=1424,quality=80,format=auto/content-assets/images/20240713_MAP002.jpg',
    alt: 'genz being manhandled by police',
    caption: 'Kenyan Gen Z being manhandled by police during protests - A Call for Justice and Reform'
  },
  {
    url: 'https://www.rosalux.de//fileadmin/images/Ausland/Afrika/240924_Kenya_Protests.jpg',
    alt: 'group of Kenyan protesters',
    caption: 'Kenyan Gen Z Protesting for Change - A Vibrant Democracy in Action'
  },
  {
    url: 'https://preview.redd.it/kenyan-gen-z-v0-c8hrec3dyc8d1.jpeg?auto=webp&s=31c43afe8a63b1f28e537402e72df88d77aeed98',
    alt: 'Maandamano movement in Kenya',
    caption: 'Maandamano Movement - Kenyan Gen Z Leading the Charge for Social Justice'
  },
  {
    url: 'https://media.istockphoto.com/id/527373677/photo/kenyatta-international-conference-centre.jpg?s=612x612&w=0&k=20&c=yhK0pqdIYHHVVIxpGSBSoUD3CZuaYI--e_qzDcQXTdc=',
    alt: 'KICC Building',
    caption: 'KICC - Kenya\'s Premier Business District'
  },
  {
    url: 'https://afktravel.com/wp-content/uploads/2014/04/fortjesus.jpg',
    alt: 'Fort Jesus',
    caption: 'Fort Jesus - A Historical Fort in Mombasa'
  },
];

function Home({ user: propUser }) {
  const [user, setUser] = useState(propUser || null);
  const [randomFact, setRandomFact] = useState(null);
  const [allFacts, setAllFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [userStats, setUserStats] = useState({
    civic_points: 0,
    reports_filed: 0,
    events_attended: 0,
    user_level: 'Bronze Citizen',
    next_level_points: 100
  });

  // Check localStorage for user if not passed as prop
  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    fetchAllFacts();
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await getProfile();
      if (response.data) {
        const civicPoints = response.data.civic_score || 0;
        let userLevel = 'Bronze Citizen';
        let nextLevel = 100;
        
        if (civicPoints >= 600) {
          userLevel = 'Platinum Citizen';
          nextLevel = 0;
        } else if (civicPoints >= 300) {
          userLevel = 'Gold Citizen';
          nextLevel = 600 - civicPoints;
        } else if (civicPoints >= 100) {
          userLevel = 'Silver Citizen';
          nextLevel = 300 - civicPoints;
        } else {
          userLevel = 'Bronze Citizen';
          nextLevel = 100 - civicPoints;
        }
        
        setUserStats({
          civic_points: civicPoints,
          reports_filed: 0,
          events_attended: 0,
          user_level: userLevel,
          next_level_points: nextLevel
        });
      }
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  const fetchAllFacts = async () => {
    setIsLoading(true);
    try {
      const response = await getHistoryFacts();
      if (response.data && response.data.length > 0) {
        setAllFacts(response.data);
        const randomIndex = Math.floor(Math.random() * response.data.length);
        setRandomFact(response.data[randomIndex]);
      }
    } catch (err) {
      console.error('Failed to fetch facts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = () => {
    if (!isShuffling && allFacts.length > 0) {
      setIsShuffling(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * allFacts.length);
        setRandomFact(allFacts[randomIndex]);
        setIsShuffling(false);
      }, 300);
    }
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const stats = [
    { value: '33+', label: 'Constitution Articles', icon: FiBookOpen },
    { value: '19+', label: 'Legal FAQs', icon: FiHelpCircle },
    { value: '90+', label: 'MPs Tracked', icon: FiUsers },
    { value: '24/7', label: 'AI Assistance', icon: FiClock },
  ];

  const features = [
    { title: 'Constitution Search', description: 'Full text search of the Constitution of Kenya 2010 with simplified explanations', link: '/constitution', icon: FiBookOpen, color: '#006B3F' },
    { title: 'AI Legal Assistant', description: 'Get answers to your constitutional questions powered by artificial intelligence', link: '/chatbot', icon: FiMessageSquare, color: '#006B3F' },
    { title: 'Kenyan History', description: 'Explore fascinating facts about Kenya\'s rich heritage and culture', link: '/history', icon: FiBookmark, color: '#D4A017' },
    { title: 'Legal FAQ', description: 'Common legal questions answered by legal experts', link: '/faq', icon: FiHelpCircle, color: '#1A1A1A' },
    { title: 'Parliament Scorecard', description: 'Track your MP\'s performance, attendance, and bills sponsored', link: '/mps', icon: FiTrendingUp, color: '#006B3F' },
    { title: 'Voting Verification', description: 'Check your voter registration status and verify your vote', link: '/voting', icon: FiBarChart2, color: '#BB0000' },
    { title: 'Crime Reporting', description: 'Report crimes anonymously and track their status', link: '/crime', icon: FiFlag, color: '#BB0000' },
    { title: 'Public Events', description: 'Find and attend public participation events in your county', link: '/events', icon: FiMapPin, color: '#D4A017' },
    { title: 'Civic Participation', description: 'Participate in democracy and civic activities', link: user ? '/crime' : '/login', icon: FiShield, color: '#1A1A1A' },
  ];

  return (
    <>
      <div style={{ position: 'relative', height: '580px', overflow: 'hidden' }}>
        {carouselImages.map((img, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: imageErrors[index] ? 'none' : `url(${img.url})`,
              backgroundColor: imageErrors[index] ? '#006B3F' : 'transparent',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentImageIndex === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentImageIndex === index ? 1 : 0,
            }}
            onError={() => handleImageError(index)}
          >
            {imageErrors[index] && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background: 'linear-gradient(135deg, #006B3F 0%, #004D2E 100%)',
              }}>
                <span style={{ fontSize: '64px' }}>🇰🇪</span>
              </div>
            )}
          </div>
        ))}
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 2 }} />
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', display: 'flex', zIndex: 3 }}>
          <div style={{ flex: 1, backgroundColor: '#1A1A1A' }}></div>
          <div style={{ flex: 1, backgroundColor: '#BB0000' }}></div>
          <div style={{ flex: 1, backgroundColor: '#006B3F' }}></div>
        </div>
        
        <div style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white' }}>
          <div className="container">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {user && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '8px 20px', borderRadius: '30px', marginBottom: '20px' }}>
                  <FiUser style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  <span style={{ fontSize: '14px' }}>{getGreeting()}, {user.phone_number}</span>
                </div>
              )}
              <h1 style={{ fontSize: '52px', marginBottom: '16px', fontWeight: '700' }}>Citizen Hub Kenya</h1>
              <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>
                Access the Constitution of Kenya, get legal answers from AI, track your MPs, report crimes, verify voting, and participate in democracy - all in one platform.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {user ? (
                  <>
                    <Link to="/constitution" className="btn-primary" style={{ backgroundColor: 'white', color: '#006B3F' }}>Explore Constitution</Link>
                    <Link to="/chatbot" className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>Ask Legal Assistant</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-primary" style={{ backgroundColor: 'white', color: '#006B3F' }}>Get Started Free</Link>
                    <Link to="/constitution" className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>Explore Constitution</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: '60px', left: 0, right: 0, textAlign: 'center', color: 'white', fontSize: '12px', zIndex: 3, backgroundColor: 'rgba(0,0,0,0.65)', padding: '6px 12px', width: 'fit-content', margin: '0 auto', borderRadius: '20px', maxWidth: '90%' }}>
          {carouselImages[currentImageIndex].caption}
        </div>
        
        <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 3 }}>
          {carouselImages.map((_, index) => (
            <button key={index} onClick={() => setCurrentImageIndex(index)} style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }} />
          ))}
        </div>
      </div>

      {user && (
        <div style={{ backgroundColor: '#E8F5E9', padding: '24px 0', borderBottom: '1px solid #c8e6c9' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '4px', color: '#1A1A1A' }}>Welcome to Your Civic Dashboard</h3>
                <p style={{ color: '#555', fontSize: '14px' }}>Track your civic engagement and access personalized services</p>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#006B3F' }}>{userStats.civic_points}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Civic Points</div>
                  <div style={{ fontSize: '10px', color: '#006B3F', marginTop: '4px' }}>{userStats.user_level}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#006B3F' }}>{userStats.reports_filed}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Reports Filed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#006B3F' }}>{userStats.events_attended}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Events Attended</div>
                </div>
              </div>
            </div>
            {userStats.next_level_points > 0 && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#F5F0E8', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#555' }}>{userStats.next_level_points} points needed for {userStats.user_level === 'Bronze Citizen' ? 'Silver Citizen' : userStats.user_level === 'Silver Citizen' ? 'Gold Citizen' : 'Platinum Citizen'}</span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#ddd', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(userStats.civic_points % 100)}%`, height: '100%', backgroundColor: '#006B3F' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '48px 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div className="grid grid-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ width: '60px', height: '60px', margin: '0 auto 12px', backgroundColor: '#F5F0E8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={28} color="#006B3F" />
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A' }}>{stat.value}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="heading-2">Everything You Need as a Kenyan Citizen</h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>Empowering citizens with knowledge and tools to understand their rights and participate in governance</p>
        </div>
        <div className="grid grid-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link to={feature.link} key={index} className="card" style={{ textDecoration: 'none', display: 'block', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }}>
                <div style={{ marginBottom: '16px' }}><Icon size={32} color={feature.color} /></div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1A1A1A' }}>{feature.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{feature.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: '#F5F0E8', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '45px', height: '45px', backgroundColor: '#006B3F', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiInfo size={22} color="white" />
                </div>
                <h2 className="heading-2" style={{ marginBottom: '0' }}>Did You Know?</h2>
              </div>
              
              {isLoading ? (
                <div className="loading"><div className="loading-spinner"></div><p>Loading Kenyan history...</p></div>
              ) : randomFact ? (
                <div style={{ transition: 'all 0.3s ease', opacity: isShuffling ? 0.5 : 1, transform: isShuffling ? 'scale(0.98)' : 'scale(1)' }}>
                  <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#006B3F', borderRadius: '20px', marginBottom: '12px', fontSize: '11px', fontWeight: '600', color: 'white' }}>
                    {randomFact.category?.toUpperCase() || 'KENYAN HISTORY'} {randomFact.year ? `• ${randomFact.year}` : ''}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1A1A1A' }}>{randomFact.title}</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '20px', color: '#444', fontSize: '14px' }}>{randomFact.content}</p>
                  <button onClick={handleShuffle} disabled={isShuffling} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', backgroundColor: '#006B3F', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: isShuffling ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: isShuffling ? 0.6 : 1 }}>
                    <FiRefreshCw size={16} style={{ animation: isShuffling ? 'spin 1s linear infinite' : 'none' }} />
                    {isShuffling ? 'Loading...' : 'Another Fact'}
                  </button>
                </div>
              ) : null}
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #006B3F 0%, #004D2E 100%)', borderRadius: '16px', padding: '32px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🇰🇪</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Join Thousands of Citizens</h3>
              <p style={{ marginBottom: '24px', opacity: 0.9, fontSize: '13px' }}>Already using Citizen Hub Kenya to understand their rights</p>
              {user ? (
                <Link to="/constitution" className="btn-primary" style={{ backgroundColor: 'white', color: '#006B3F' }}>Start Exploring</Link>
              ) : (
                <Link to="/login" className="btn-primary" style={{ backgroundColor: 'white', color: '#006B3F' }}>Create Free Account</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default Home;
