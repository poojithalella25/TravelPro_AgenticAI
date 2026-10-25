import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Search, Calendar, Map, Landmark, ArrowRight
} from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../data/indiaTravelData';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Search Widget State
  const [selectedDestination, setSelectedDestination] = useState('Goa');
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [startLocation, setStartLocation] = useState('Hyderabad');

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      destination: selectedDestination,
      start_location: startLocation,
      month: selectedMonth
    });
    navigate(`/create-trip?${queryParams.toString()}`);
  };

  return (
    <div className="animate-slide-up" style={{ minHeight: '100vh', backgroundColor: '#fcfcfd', paddingBottom: '60px' }}>
      
      {/* Main Full-Width Hero Section */}
      <section style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #fee2e2',
        padding: '50px 24px 40px 24px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)'
      }}>
        <div className="full-width-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            
            {/* Left Hero Text Column */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fee2e2', color: '#991b1b', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800, marginBottom: '16px' }}>
                <Sparkles size={16} /> SMART INDIAN TRAVEL DISCOVERY
              </div>

              <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.15, margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
                Discover India by <span style={{ color: '#dc2626' }}>State, UT</span> & <span style={{ color: '#dc2626' }}>Travel Seasons</span>
              </h1>

              <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, margin: '0 0 28px 0' }}>
                Plan your ideal getaway across 28 states and 8 Union Territories with month-wise seasonal recommendations, interactive maps, and agentic itinerary building.
              </p>

              {/* Quick Jump Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/create-trip')}
                  className="glass-button"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                >
                  <Sparkles size={20} /> Launch Adventure Builder
                </button>

                <button
                  onClick={() => navigate('/smart-calendar')}
                  className="glass-button-secondary"
                  style={{ padding: '14px 24px', fontSize: '0.95rem' }}
                >
                  <Calendar size={18} style={{ color: '#dc2626' }} /> Smart Calendar
                </button>
              </div>
            </div>

            {/* Right Hero Interactive Planner Search Box */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '2px solid #fca5a5',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 12px 36px rgba(220, 38, 38, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#dc2626', padding: '8px', borderRadius: '10px' }}>
                  <Search size={20} style={{ color: '#ffffff' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Quick Trip Discovery</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Find optimal destinations for your dates</span>
                </div>
              </div>

              <form onSubmit={handleQuickSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    DESTINATION OR STATE:
                  </label>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {INDIA_STATES_AND_UTS.map(r => (
                      <option key={r.id} value={r.name}>{r.name} ({r.type})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                      TRAVEL MONTH:
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      {monthsList.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                      START LOCATION:
                    </label>
                    <input
                      type="text"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      placeholder="City..."
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="glass-button"
                  style={{ width: '100%', marginTop: '8px', padding: '14px' }}
                >
                  Find Destinations & Plan Trip <ArrowRight size={18} />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Core Platform Pillars Section */}
      <section style={{ marginTop: '48px' }}>
        <div className="full-width-container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>
              Four Core Travel Planning Pillars
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>
              Seamlessly navigate Indian states, territories, seasonal weather calendars, and dynamic trip building.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            
            {/* Card 1: Adventure Builder */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Adventure Builder</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 20px 0', flex: 1 }}>
                Configure trip parameters across full content width with multi-column preference controls and dynamic real-time summary preview.
              </p>
              <button
                onClick={() => navigate('/create-trip')}
                className="glass-button"
                style={{ width: '100%', padding: '10px' }}
              >
                Launch Builder <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 2: States */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Map size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>28 Indian States</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 20px 0', flex: 1 }}>
                Explore all 28 states of India with rich representative imagery, capitals, major destinations, and detailed modal views.
              </p>
              <button
                onClick={() => navigate('/states')}
                className="glass-button-secondary"
                style={{ width: '100%', padding: '10px' }}
              >
                Explore States <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 3: Union Territories */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Landmark size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>8 Union Territories</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 20px 0', flex: 1 }}>
                Discover Andaman, Lakshadweep, Ladakh, Puducherry, Delhi, and all 8 Union Territories with high-res galleries and guides.
              </p>
              <button
                onClick={() => navigate('/union-territories')}
                className="glass-button-secondary"
                style={{ width: '100%', padding: '10px' }}
              >
                Explore UTs <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 4: Smart Months Calendar */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Smart Months Calendar</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 20px 0', flex: 1 }}>
                Interactive month-wise grid from January to December with season tags (Winter, Summer, Monsoon, Post-Monsoon) & climate advice.
              </p>
              <button
                onClick={() => navigate('/smart-calendar')}
                className="glass-button-secondary"
                style={{ width: '100%', padding: '10px' }}
              >
                View Calendar <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Destinations Showcase Section */}
      <section style={{ marginTop: '56px' }}>
        <div className="full-width-container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b', backgroundColor: '#fee2e2', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                FEATURED HIGHLIGHTS
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 0 0' }}>
                Popular States & Destinations
              </h2>
            </div>
            
            <button
              onClick={() => navigate('/states')}
              style={{ fontSize: '0.9rem', fontWeight: 800, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All 28 States <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {INDIA_STATES_AND_UTS.slice(0, 6).map(region => (
              <div
                key={region.id}
                className="glass-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', height: '180px' }}>
                  <img src={region.coverImage} alt={region.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: region.type === 'State' ? '#dc2626' : '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {region.type}
                  </span>
                </div>

                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 4px 0', color: '#0f172a' }}>{region.name}</h3>
                  <span style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 700, marginBottom: '8px' }}>Best: {region.bestSeason}</span>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {region.description}
                  </p>

                  <button
                    onClick={() => navigate(region.type === 'State' ? `/states?state=${region.id}` : `/union-territories?ut=${region.id}`)}
                    style={{
                      marginTop: 'auto',
                      backgroundColor: '#fee2e2',
                      border: '1px solid #fca5a5',
                      color: '#991b1b',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    Explore Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
