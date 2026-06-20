import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin, 
  FiInstagram,
  FiBookOpen,
  FiHelpCircle,
  FiUsers,
  FiShield,
  FiFlag,
  FiMapPin as FiEventPin,
  FiBarChart2
} from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Constitution', path: '/constitution', icon: FiBookOpen },
    { name: 'Legal Assistant', path: '/chatbot', icon: FiHelpCircle },
    { name: 'Parliament Scorecard', path: '/mps', icon: FiUsers },
    { name: 'Voting Verification', path: '/voting', icon: FiBarChart2 },
    { name: 'Crime Reporting', path: '/crime', icon: FiFlag },
    { name: 'Public Events', path: '/events', icon: FiEventPin },
    { name: 'Civic Participation', path: '/login', icon: FiShield },
  ];

  const resources = [
    { name: 'Kenyan Constitution 2010', url: 'https://www.kenyalaw.org' },
    { name: 'IEBC Portal', url: 'https://www.iebc.or.ke' },
    { name: 'Parliament of Kenya', url: 'https://www.parliament.go.ke' },
    { name: 'Judiciary of Kenya', url: 'https://www.judiciary.go.ke' },
    { name: 'E-Citizen', url: 'https://www.ecitizen.go.ke' },
  ];

  const contactInfo = [
    { icon: FiMapPin, text: 'Nairobi, Kenya' },
    { icon: FiMail, text: 'info@citizenhub.ke' },
    { icon: FiPhone, text: '+254 700 000 000' },
  ];

  const socialLinks = [
    { icon: FiFacebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: FiTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: FiLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiInstagram, url: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer style={{ 
      backgroundColor: '#1A1A1A', 
      color: '#F5F5F5',
      marginTop: '60px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '48px 24px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      }}>
        
        {/* Column 1: Brand and Description */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#006B3F', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ fontSize: '22px' }}>🇰🇪</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Citizen Hub Kenya</h3>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#B0B0B0', marginBottom: '20px' }}>
            Empowering Kenyan citizens with constitutional knowledge, legal assistance, and civic participation tools.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#B0B0B0', 
                    transition: 'color 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#006B3F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '20px',
            position: 'relative',
            display: 'inline-block'
          }}>
            Quick Links
            <span style={{ 
              position: 'absolute', 
              bottom: '-6px', 
              left: 0, 
              width: '40px', 
              height: '2px', 
              backgroundColor: '#006B3F' 
            }}></span>
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link 
                    to={link.path}
                    style={{ 
                      color: '#B0B0B0', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#006B3F'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                  >
                    <Icon size={14} />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '20px',
            position: 'relative',
            display: 'inline-block'
          }}>
            Resources
            <span style={{ 
              position: 'absolute', 
              bottom: '-6px', 
              left: 0, 
              width: '40px', 
              height: '2px', 
              backgroundColor: '#006B3F' 
            }}></span>
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {resources.map((resource, index) => (
              <li key={index} style={{ marginBottom: '12px' }}>
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#B0B0B0', 
                    textDecoration: 'none', 
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#006B3F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                >
                  {resource.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact and Newsletter */}
        <div>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '20px',
            position: 'relative',
            display: 'inline-block'
          }}>
            Contact Us
            <span style={{ 
              position: 'absolute', 
              bottom: '-6px', 
              left: 0, 
              width: '40px', 
              height: '2px', 
              backgroundColor: '#006B3F' 
            }}></span>
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '24px' }}>
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Icon size={14} style={{ color: '#006B3F' }} />
                  <span style={{ fontSize: '14px', color: '#B0B0B0' }}>{item.text}</span>
                </li>
              );
            })}
          </ul>
          
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#F5F5F5'
          }}>
            Stay Updated
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="email" 
              placeholder="Your email address"
              style={{
                flex: 1,
                padding: '10px 12px',
                backgroundColor: '#2A2A2A',
                border: '1px solid #404040',
                borderRadius: '6px',
                color: '#F5F5F5',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button 
              style={{
                padding: '10px 16px',
                backgroundColor: '#006B3F',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004D2E'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#006B3F'}
            >
              Subscribe
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
            Get updates on civic events and new features
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ 
        borderTop: '1px solid #2A2A2A',
        padding: '20px 24px',
        textAlign: 'center'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '12px',
          color: '#888'
        }}>
          <p style={{ margin: 0 }}>
            © {currentYear} Citizen Hub Kenya. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/privacy" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#006B3F'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#006B3F'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
              Terms of Service
            </Link>
            <Link to="/accessibility" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#006B3F'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
