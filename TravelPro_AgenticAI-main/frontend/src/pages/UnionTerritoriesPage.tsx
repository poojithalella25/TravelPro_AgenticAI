import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Calendar, Sparkles, X, Landmark, 
  Compass, ArrowRight
} from 'lucide-react';
import { INDIA_STATES_AND_UTS, type RegionData } from '../data/indiaTravelData';

const UnionTerritoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<string>('All');
  const [activeUtModal, setActiveUtModal] = useState<RegionData | null>(null);

  // Filter only Union Territories (8 UTs)
  const allUTs = useMemo(() => {
    return INDIA_STATES_AND_UTS.filter(r => r.type === 'Union Territory');
  }, []);

  // Check URL params for auto-opening modal
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const utId = params.get('ut');
    if (utId) {
      const found = allUTs.find(u => u.id === utId || u.name.toLowerCase() === utId.toLowerCase());
      if (found) setActiveUtModal(found);
    }
  }, [location.search, allUTs]);

  // Filter logic
  const filteredUTs = useMemo(() => {
    return allUTs.filter(ut => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        ut.name.toLowerCase().includes(q) ||
        ut.capital.toLowerCase().includes(q) ||
        ut.description.toLowerCase().includes(q) ||
        ut.places.some(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));

      const matchesSeason = selectedSeasonFilter === 'All' || 
        ut.bestSeason.toLowerCase().includes(selectedSeasonFilter.toLowerCase()) ||
        (selectedSeasonFilter === 'Winter' && ut.bestMonths.some(m => ['Dec', 'Jan', 'Feb'].includes(m))) ||
        (selectedSeasonFilter === 'Summer' && ut.bestMonths.some(m => ['May', 'Jun'].includes(m))) ||
        (selectedSeasonFilter === 'Monsoon' && ut.bestMonths.some(m => ['Jul', 'Aug'].includes(m))) ||
        (selectedSeasonFilter === 'Post-Monsoon' && ut.bestMonths.some(m => ['Sep', 'Oct', 'Nov'].includes(m)));

      return matchesSearch && matchesSeason;
    });
  }, [allUTs, searchQuery, selectedSeasonFilter]);

  const handlePlanTripForUT = (utName: string, placeName?: string) => {
    const target = placeName ? `${placeName}, ${utName}` : utName;
    navigate(`/create-trip?destination=${encodeURIComponent(target)}`);
  };

  return (
    <div className="animate-slide-up" style={{ minHeight: '100vh', backgroundColor: '#fcfcfd', paddingBottom: '60px' }}>
      
      {/* Hero Header */}
      <section style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #fee2e2',
        padding: '40px 24px 32px 24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
      }}>
        <div className="full-width-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b', backgroundColor: '#fee2e2', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
              UNION TERRITORIES GUIDE
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>All 8 Union Territories</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            Explore All <span style={{ color: '#dc2626' }}>8 Union Territories</span> of India
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '850px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            From the turquoise island reefs of Andaman and Lakshadweep to the majestic high-altitude cold deserts of Ladakh and French colonial shores of Puducherry, discover India's 8 Union Territories.
          </p>

          {/* Search & Season Filters Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search Union Territory by name, capital or place (e.g., Ladakh, Andaman, Daman)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.95rem'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Season Filter Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginRight: '4px' }}>Season:</span>
              {['All', 'Winter', 'Summer', 'Monsoon', 'Post-Monsoon'].map(season => (
                <button
                  key={season}
                  onClick={() => setSelectedSeasonFilter(season)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: selectedSeasonFilter === season ? 800 : 600,
                    border: selectedSeasonFilter === season ? '1.5px solid #dc2626' : '1px solid #e2e8f0',
                    backgroundColor: selectedSeasonFilter === season ? '#fee2e2' : '#ffffff',
                    color: selectedSeasonFilter === season ? '#991b1b' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UT Grid Section */}
      <section style={{ marginTop: '32px' }}>
        <div className="full-width-container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#475569' }}>
              Showing <strong style={{ color: '#0f172a' }}>{filteredUTs.length}</strong> of 8 Union Territories
            </span>
            {(searchQuery || selectedSeasonFilter !== 'All') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedSeasonFilter('All'); }}
                style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredUTs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <Compass size={48} style={{ color: '#dc2626', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0' }}>No matching Union Territories found</h3>
              <p style={{ color: '#64748b', margin: 0 }}>Try clearing your search query or selecting a different season filter.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {filteredUTs.map(ut => (
                <div
                  key={ut.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1.5px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Card Cover Image */}
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img
                      src={ut.coverImage}
                      alt={ut.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Landmark size={12} style={{ color: '#fca5a5' }} />
                      Capital: {ut.capital}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                        {ut.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#dc2626', fontWeight: 700 }}>
                        <Calendar size={14} />
                        <span>Best: {ut.bestSeason}</span>
                      </div>
                    </div>

                    <p style={{
                      fontSize: '0.88rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      margin: '0 0 16px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {ut.description}
                    </p>

                    {/* Best Months Badges */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                        TOP VISITING MONTHS:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {ut.bestMonths.map(m => (
                          <span
                            key={m}
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#991b1b',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Places */}
                    <div style={{ marginBottom: '20px', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                        MAJOR DESTINATIONS:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {ut.places.slice(0, 3).map(p => (
                          <span
                            key={p.name}
                            style={{
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              padding: '3px 9px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => setActiveUtModal(ut)}
                        className="glass-button"
                        style={{ flex: 1, padding: '10px', fontSize: '0.88rem' }}
                      >
                        Explore UT <ArrowRight size={16} />
                      </button>

                      <button
                        onClick={() => handlePlanTripForUT(ut.name)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1.5px solid #cbd5e1',
                          color: '#0f172a',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Plan trip in Adventure Builder"
                      >
                        <Sparkles size={16} style={{ color: '#dc2626' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* UT Detail Modal */}
      {activeUtModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="animate-slide-up" style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveUtModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
              }}
            >
              <X size={20} style={{ color: '#0f172a' }} />
            </button>

            {/* Modal Hero Banner */}
            <div style={{ position: 'relative', height: '260px' }}>
              <img
                src={activeUtModal.coverImage}
                alt={activeUtModal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)',
                padding: '24px',
                color: '#ffffff'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, backgroundColor: '#febb02', color: '#0f172a', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  UNION TERRITORY DETAILS
                </span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '6px 0 0 0' }}>{activeUtModal.name}</h2>
                <span style={{ fontSize: '0.95rem', color: '#fef08a', fontWeight: 700 }}>Capital / Headquarters: {activeUtModal.capital}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Overview & Season Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                backgroundColor: '#fefce8',
                border: '1px solid #fef08a',
                padding: '16px',
                borderRadius: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#854d0e', fontWeight: 700, textTransform: 'uppercase' }}>BEST SEASON</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{activeUtModal.bestSeason}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#854d0e', fontWeight: 700, textTransform: 'uppercase' }}>OPTIMAL MONTHS</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {activeUtModal.bestMonths.map(m => (
                      <span key={m} style={{ backgroundColor: '#febb02', color: '#0f172a', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#854d0e', fontWeight: 700, textTransform: 'uppercase' }}>SUGGESTED DURATION</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>3 - 6 Days Recommended</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>About {activeUtModal.name}</h4>
                <p style={{ color: '#334155', lineHeight: 1.6, margin: 0, fontSize: '0.98rem' }}>{activeUtModal.description}</p>
              </div>

              {/* Major Destinations Grid */}
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>Major Destinations ({activeUtModal.places.length})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                  {activeUtModal.places.map(place => (
                    <div
                      key={place.name}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <img src={place.image} alt={place.name} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
                      <div style={{ padding: '12px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#d97706', backgroundColor: '#fef08a', padding: '2px 6px', borderRadius: '4px' }}>
                          {place.category}
                        </span>
                        <h5 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 4px 0', color: '#0f172a' }}>{place.name}</h5>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0', lineHeight: 1.4 }}>{place.description}</p>
                        
                        {place.nearbyPlaces && place.nearbyPlaces.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#475569', backgroundColor: '#f8fafc', padding: '6px 8px', borderRadius: '6px' }}>
                            <strong>Nearby:</strong> {place.nearbyPlaces.join(', ')}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setActiveUtModal(null);
                            handlePlanTripForUT(activeUtModal.name, place.name);
                          }}
                          style={{
                            width: '100%',
                            marginTop: '10px',
                            backgroundColor: '#fef08a',
                            border: '1px solid #fde047',
                            color: '#854d0e',
                            padding: '6px',
                            borderRadius: '6px',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          Plan for {place.name} <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Banner */}
              <div style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '20px',
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Plan your trip to {activeUtModal.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8' }}>Create an agentic itinerary with custom stay, route & activity recommendations.</p>
                </div>
                <button
                  onClick={() => {
                    const name = activeUtModal.name;
                    setActiveUtModal(null);
                    handlePlanTripForUT(name);
                  }}
                  className="glass-button"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Sparkles size={18} /> Build Itinerary for {activeUtModal.name}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UnionTerritoriesPage;
