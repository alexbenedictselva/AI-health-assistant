import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { translateTexts } from "../services/translationService";

const BASE_TEXTS = {
  dashboard: 'Dashboard',
  assessment: 'Assessment',
  metrics: 'Metrics',
  logout: 'Logout',
  adminPanel: 'Admin Panel'
};

const getCurrentLanguage = () => localStorage.getItem('language') || 'en';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = Boolean(user?.is_admin);
  const [language, setLanguage] = useState(getCurrentLanguage());
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [texts, setTexts] = useState(BASE_TEXTS);

  useEffect(() => {
    const syncLanguage = () => setLanguage(getCurrentLanguage());
    window.addEventListener('storage', syncLanguage);
    window.addEventListener('language:changed', syncLanguage as EventListener);
    return () => {
      window.removeEventListener('storage', syncLanguage);
      window.removeEventListener('language:changed', syncLanguage as EventListener);
    };
  }, []);

  useEffect(() => {
    if (language === 'en') {
      setTexts(BASE_TEXTS);
      return;
    }

    let mounted = true;
    translateTexts(Object.values(BASE_TEXTS), language).then(translated => {
      if (!mounted) return;
      const keys = Object.keys(BASE_TEXTS) as Array<keyof typeof BASE_TEXTS>;
      const newTexts = {} as typeof BASE_TEXTS;
      keys.forEach((key, i) => { newTexts[key] = translated[i]; });
      setTexts(newTexts);
    });

    return () => {
      mounted = false;
    };
  }, [language]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    window.dispatchEvent(new Event('language:changed'));
    setShowLangMenu(false);
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="modern-header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="brand-logo">
            <img
              src="/logo-glycosense.png"
              alt="GlycoSense"
              style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            />
            <span className="brand-name">GlycoSense</span>
          </Link>
        </div>

        <nav className="nav-menu">
          {!isAdmin && (
            <>
              <Link to="/dashboard" className="nav-link">{texts.dashboard}</Link>
              <Link to="/diabetes" className="nav-link">{texts.assessment}</Link>
              <Link to="/metrics" className="nav-link">{texts.metrics}</Link>
            </>
          )}
          {isAdmin && <Link to="/admin" className="nav-link">{texts.adminPanel}</Link>}
        </nav>

        <div className="user-section">
          <Link to="/profile" className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || "U"}</div>
            <span className="user-name">{user?.name || "User"}</span>
          </Link>
          
          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="logout-btn"
              style={{ minWidth: '100px' }}
            >
              <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{currentLang.flag}</span>
              {currentLang.name}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                style={{ marginLeft: '0.5rem', transform: showLangMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {showLangMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                minWidth: '150px',
                zIndex: 1000
              }}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      background: language === lang.code ? '#F0F9FF' : 'transparent',
                      color: language === lang.code ? '#0EA5E9' : '#64748B',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.95rem',
                      fontWeight: language === lang.code ? '600' : '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lang.code) {
                        e.currentTarget.style.background = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang.code) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={logout} className="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {texts.logout}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
