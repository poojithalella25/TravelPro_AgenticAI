import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Users, IndianRupee, Compass, 
  Sparkles, Check, Calendar, Sun, X, LogIn, UserPlus, Lock,
  Mountain, Palmtree, Castle, Heart, Coffee, Flame
} from 'lucide-react';
import { INDIA_STATES_AND_UTS, MONTHLY_TRAVEL_STRATEGY, getCurrentRealWorldMonthInfo, getOtherPlacesInRegion } from '../data/indiaTravelData';

const CreateTrip: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const realWorldInfo = useMemo(() => getCurrentRealWorldMonthInfo(), []);

  // Modal state for guest login requirement prompt
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form State - dynamically default to real-world month & date
  const [selectedRegion, setSelectedRegion] = useState('Maharashtra');
  const [startLocation, setStartLocation] = useState('Hyderabad');
  const [selectedMonth, setSelectedMonth] = useState(realWorldInfo.currentMonthName);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationDays, setDurationDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  
  // Budget & Preferences State
  const [budgetTier, setBudgetTier] = useState<'Economy' | 'Moderate' | 'Premium'>('Moderate');
  const [customBudget, setCustomBudget] = useState(25000);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Beaches', 'Nature', 'Food']);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Interest options with icons
  const interestOptions = [
    { label: 'Adventure', icon: Flame },
    { label: 'Nature', icon: Mountain },
    { label: 'Beaches', icon: Palmtree },
    { label: 'Mountains', icon: Mountain },
    { label: 'Heritage', icon: Castle },
    { label: 'Culture', icon: Compass },
    { label: 'Wildlife', icon: Sparkles },
    { label: 'Food', icon: Coffee },
    { label: 'Relaxation', icon: Sun },
    { label: 'Family', icon: Users },
    { label: 'Solo', icon: Compass },
    { label: 'Couple', icon: Heart },
  ];

  // Parse query params or location state on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('destination')) {
      const dest = params.get('destination') || 'Goa';
      setSelectedRegion(dest);
    }
    if (params.has('month')) {
      const m = params.get('month');
      if (m && monthsList.includes(m)) setSelectedMonth(m);
    }
    if (params.has('start_location')) {
      setStartLocation(params.get('start_location') || 'Vijayawada');
    }

    // Restore saved planRequest from location state if user just logged in
    const statePlanReq = (location.state as any)?.planRequest;
    if (statePlanReq) {
      if (statePlanReq.destination) setSelectedRegion(statePlanReq.destination);
      if (statePlanReq.start_location) setStartLocation(statePlanReq.start_location);
      if (statePlanReq.month) setSelectedMonth(statePlanReq.month);
      if (statePlanReq.budget) setCustomBudget(statePlanReq.budget);
      if (statePlanReq.duration_days) setDurationDays(statePlanReq.duration_days);
      if (statePlanReq.travelers) setTravelers(statePlanReq.travelers);
      if (statePlanReq.interests) setSelectedInterests(statePlanReq.interests);
      if (statePlanReq.style) setTravelStyle(statePlanReq.style);
    }
  }, [location.search, location.state]);

  // Handle budget tier change
  const handleBudgetTierSelect = (tier: 'Economy' | 'Moderate' | 'Premium') => {
    setBudgetTier(tier);
    if (tier === 'Economy') setCustomBudget(15000);
    else if (tier === 'Moderate') setCustomBudget(30000);
    else setCustomBudget(65000);
  };

  // Find active region object
  const currentRegionObj = useMemo(() => {
    const term = selectedRegion.toLowerCase().trim();
    return INDIA_STATES_AND_UTS.find(r => 
      r.name.toLowerCase() === term || r.id === term || term.includes(r.name.toLowerCase())
    ) || INDIA_STATES_AND_UTS[5]; // fallback Goa
  }, [selectedRegion]);

  // Determine season and monthly strategy
  const currentMonthStrategy = useMemo(() => {
    return MONTHLY_TRAVEL_STRATEGY.find(s => s.month === selectedMonth) || MONTHLY_TRAVEL_STRATEGY[8];
  }, [selectedMonth]);

  // Recommended states & UTs for selected month
  const recommendedRegionsForMonth = useMemo(() => {
    const targetStateNames = currentMonthStrategy.states;
    return INDIA_STATES_AND_UTS.filter(r => targetStateNames.includes(r.name));
  }, [currentMonthStrategy]);

  // Multi-destination toggle
  const toggleDestinationChoice = (placeName: string) => {
    if (selectedDestinations.includes(placeName)) {
      setSelectedDestinations(selectedDestinations.filter(p => p !== placeName));
    } else {
      setSelectedDestinations([...selectedDestinations, placeName]);
    }
  };

  // Interest toggle
  const toggleInterestChoice = (label: string) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter(i => i !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const constructPlanRequest = () => {
    const finalDest = selectedDestinations.length > 0 
      ? `${currentRegionObj.name} (${selectedDestinations.join(', ')})`
      : currentRegionObj.name;

    // Compute exact end_date based on startDate and durationDays
    let endDateStr = startDate;
    try {
      const parts = startDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const dt = new Date(year, month, day);
        dt.setDate(dt.getDate() + Math.max(1, durationDays) - 1);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        endDateStr = `${yyyy}-${mm}-${dd}`;
      }
    } catch (e) {
      console.error('Date parsing error:', e);
    }

    return {
      start_location: startLocation,
      destination: finalDest,
      budget: customBudget,
      start_date: startDate,
      end_date: endDateStr,
      duration_days: durationDays,
      travelers,
      interests: selectedInterests,
      style: travelStyle,
      month: selectedMonth,
      selected_nearby_places: selectedDestinations
    };
  };

  const handleGenerateItinerary = () => {
    const planRequest = constructPlanRequest();

    // REQUIREMENT 1 & 2: If user is not logged in, prompt for Auth!
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    navigate('/dashboard', { state: { newPlanRequest: planRequest } });
  };

  const handleAuthRedirect = (target: 'login' | 'register') => {
    const planRequest = constructPlanRequest();
    setShowAuthModal(false);
    navigate(`/${target}`, {
      state: {
        from: { pathname: '/create-trip', search: location.search },
        planRequest
      }
    });
  };

  return (
    <div className="animate-slide-up" style={{ minHeight: '100vh', backgroundColor: '#fcfcfd', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <section style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #fee2e2',
        padding: '36px 24px 28px 24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
      }}>
        <div className="full-width-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b', backgroundColor: '#fee2e2', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
              AGENTIC ADVENTURE BUILDER
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Full Width Dynamic Orchestrator</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Build Your <span style={{ color: '#dc2626' }}>Custom Indian Adventure</span>
          </h1>
          <p style={{ fontSize: '1.02rem', color: '#475569', margin: 0, maxWidth: '900px' }}>
            Select your destination, month, duration, interests, and budget. Our connected seasonal intelligence automatically adapts recommendations for your trip.
          </p>
        </div>
      </section>

      {/* Main Full-Width Dashboard Layout Container */}
      <section style={{ marginTop: '32px' }}>
        <div className="full-width-container">
          
          <div className="responsive-create-trip-grid">
            
            {/* LEFT COLUMN: Organized Planning Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* SECTION 1: DESTINATION SELECTION */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ backgroundColor: '#fee2e2', padding: '8px', borderRadius: '10px', color: '#dc2626' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>1. Destination & Starting Point</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Choose any Indian State or Union Territory</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {/* Primary Region Select */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                      SELECT STATE OR UNION TERRITORY:
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setSelectedDestinations([]);
                      }}
                      style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                    >
                      <optgroup label="28 Indian States">
                        {INDIA_STATES_AND_UTS.filter(r => r.type === 'State').map(r => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="8 Union Territories">
                        {INDIA_STATES_AND_UTS.filter(r => r.type === 'Union Territory').map(r => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Starting Location */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                      STARTING FROM (ORIGIN CITY):
                    </label>
                    <input
                      type="text"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      placeholder="e.g. Vijayawada, Hyderabad, Delhi, Mumbai"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Multiple Destination Checkbox Pills */}
                {currentRegionObj && currentRegionObj.places.length > 0 && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
                      SELECT SPECIFIC PLACES IN {currentRegionObj.name.toUpperCase()} (MULTIPLE ALLOWED):
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {currentRegionObj.places.map(place => {
                        const active = selectedDestinations.includes(place.name);
                        return (
                          <button
                            key={place.name}
                            type="button"
                            onClick={() => toggleDestinationChoice(place.name)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: active ? 800 : 600,
                              border: active ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                              backgroundColor: active ? '#fee2e2' : '#ffffff',
                              color: active ? '#991b1b' : '#475569',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {active && <Check size={14} />}
                            {place.name} <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>({place.category})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Places to Visit Quick Explorer Badge */}
                {(() => {
                  const regPlaces = getOtherPlacesInRegion(selectedRegion);
                  return (
                    <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#fff1f2', borderRadius: '10px', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#9f1239' }}>
                        📍 Places to Visit in {regPlaces.regionName}: {regPlaces.allPlacesInRegion.map(p => p.name).join(', ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#be123c', backgroundColor: '#ffffff', padding: '3px 10px', borderRadius: '12px', border: '1px solid #fda4af' }}>
                        {regPlaces.allPlacesInRegion.length} Places Available
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* SECTION 2: TRAVEL TIME & SEASON CONNECTIVITY */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ backgroundColor: '#fee2e2', padding: '8px', borderRadius: '10px', color: '#dc2626' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>2. Travel Time & Season</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Selecting a month adapts seasonal recommendations</span>
                  </div>
                </div>

                {/* Real-World Dynamic Seasonal Banner */}
                <div style={{
                  backgroundColor: '#fff1f2',
                  border: '1.5px solid #fecdd3',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#be123c', backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '10px', border: '1px solid #fda4af' }}>
                      🔴 REAL-WORLD TODAY: {realWorldInfo.formattedDate}
                    </span>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#881337', marginTop: '4px' }}>
                      Current Real-World Month: <u>{realWorldInfo.currentMonthName} {realWorldInfo.currentYear}</u>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9f1239', fontWeight: 700 }}>
                    ⏳ Transitions next month to <strong>{realWorldInfo.nextMonthName}</strong> ({realWorldInfo.nextStrategy.seasonTag})
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  {/* Month Select */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
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

                  {/* Start Date */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                      START DATE:
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Duration Days */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                      NUMBER OF DAYS ({durationDays} DAYS):
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="14"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#dc2626', margin: '8px 0' }}
                    />
                  </div>

                  {/* Travelers */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                      TRAVELERS:
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800, cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '1rem', fontWeight: 800, minWidth: '40px', textAlign: 'center' }}>{travelers}</span>
                      <button
                        type="button"
                        onClick={() => setTravelers(travelers + 1)}
                        style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800, cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seasonal Context Alert Bar */}
                <div style={{
                  marginTop: '20px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.4rem' }}>{currentMonthStrategy.icon}</span>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase' }}>
                      {selectedMonth} Season Highlight: {currentMonthStrategy.seasonTag}
                    </span>
                    <p style={{ margin: '2px 0 6px 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>
                      {currentMonthStrategy.description}
                    </p>
                    {recommendedRegionsForMonth.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b' }}>TOP RECOMMENDED:</span>
                        {recommendedRegionsForMonth.map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setSelectedRegion(r.name)}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #dc2626',
                              color: '#0f172a',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            + {r.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: TRAVEL PREFERENCES GRID */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ backgroundColor: '#fee2e2', padding: '8px', borderRadius: '10px', color: '#dc2626' }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>3. Travel Preferences & Interests</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Select all experiences you wish to prioritize</span>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '12px'
                }}>
                  {interestOptions.map(opt => {
                    const Icon = opt.icon;
                    const active = selectedInterests.includes(opt.label);
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => toggleInterestChoice(opt.label)}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: active ? '2px solid #dc2626' : '1px solid #cbd5e1',
                          backgroundColor: active ? '#fee2e2' : '#ffffff',
                          color: active ? '#991b1b' : '#475569',
                          fontWeight: active ? 800 : 600,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Icon size={16} style={{ color: active ? '#dc2626' : '#94a3b8' }} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: BUDGET & TRAVEL STYLE */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ backgroundColor: '#fee2e2', padding: '8px', borderRadius: '10px', color: '#dc2626' }}>
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>4. Budget Range & Travel Style</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Set financial parameters and pacing style</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                  
                  {/* Budget Tier Buttons */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
                      BUDGET CATEGORY:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {(['Economy', 'Moderate', 'Premium'] as const).map(tier => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => handleBudgetTierSelect(tier)}
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            border: budgetTier === tier ? '2px solid #dc2626' : '1px solid #cbd5e1',
                            backgroundColor: budgetTier === tier ? '#fee2e2' : '#ffffff',
                            color: budgetTier === tier ? '#991b1b' : '#475569',
                            fontWeight: budgetTier === tier ? 800 : 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                        TARGET BUDGET: ₹{customBudget.toLocaleString()} Total
                      </label>
                      <input
                        type="range"
                        min="5000"
                        max="150000"
                        step="5000"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#dc2626' }}
                      />
                    </div>
                  </div>

                  {/* Travel Style */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
                      TRAVEL PACING STYLE:
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Relaxed', 'Balanced', 'Adventure-focused', 'Cultural', 'Nature-focused'].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setTravelStyle(st)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: travelStyle === st ? '2px solid #dc2626' : '1px solid #cbd5e1',
                            backgroundColor: travelStyle === st ? '#fee2e2' : '#ffffff',
                            color: travelStyle === st ? '#991b1b' : '#475569',
                            fontWeight: travelStyle === st ? 800 : 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{st}</span>
                          {travelStyle === st && <Check size={16} style={{ color: '#dc2626' }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Dynamic Trip Summary Dashboard */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #fca5a5',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 12px 36px rgba(220, 38, 38, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ borderBottom: '1px solid #fee2e2', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#991b1b', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                    DYNAMIC TRIP PREVIEW
                  </span>
                  <h3 style={{ margin: '6px 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                    {currentRegionObj.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    {currentRegionObj.type} • Capital: {currentRegionObj.capital}
                  </span>
                </div>

                {/* Summary Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Travel Month:</span>
                    <strong style={{ color: '#0f172a' }}>{selectedMonth} ({currentMonthStrategy.seasonTag.split('&')[0]})</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Start Location:</span>
                    <strong style={{ color: '#0f172a' }}>{startLocation}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Duration & Guests:</span>
                    <strong style={{ color: '#0f172a' }}>{durationDays} Days / {travelers} Guests</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Budget Tier:</span>
                    <strong style={{ color: '#dc2626' }}>{budgetTier} (₹{customBudget.toLocaleString()})</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Pacing Style:</span>
                    <strong style={{ color: '#0f172a' }}>{travelStyle}</strong>
                  </div>

                </div>

                {/* Selected Destinations Checklist */}
                {selectedDestinations.length > 0 && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      SELECTED DESTINATIONS ({selectedDestinations.length}):
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {selectedDestinations.map(d => (
                        <span key={d} style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.78rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Preferences Badges */}
                {selectedInterests.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      SELECTED INTERESTS ({selectedInterests.length}):
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {selectedInterests.map(i => (
                        <span key={i} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.78rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  onClick={handleGenerateItinerary}
                  className="glass-button"
                  style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '8px' }}
                >
                  <Sparkles size={20} /> Generate AI Itinerary
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* REQUIREMENT 1: Guest Authentication Prompt Modal */}
      {showAuthModal && (
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
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(220,38,38,0.2)',
            position: 'relative',
            textAlign: 'center'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid #fca5a5'
            }}>
              <Lock size={32} />
            </div>

            {/* Clear Requirement Message */}
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>
              Authentication Required
            </h2>
            
            <p style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#dc2626',
              backgroundColor: '#fee2e2',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #fca5a5',
              margin: '0 0 16px 0'
            }}>
              Please register or log in to use the Trip Planner.
            </p>

            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Your selected trip parameters for <strong style={{ color: '#0f172a' }}>{selectedRegion}</strong> ({durationDays} days, ₹{customBudget.toLocaleString()}) will be saved and automatically loaded after you sign in.
            </p>

            {/* Login & Register Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleAuthRedirect('login')}
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  border: '2px solid #dc2626',
                  color: '#dc2626',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <LogIn size={18} /> Login
              </button>

              <button
                onClick={() => handleAuthRedirect('register')}
                className="glass-button"
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  fontSize: '0.95rem'
                }}
              >
                <UserPlus size={18} /> Register
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateTrip;
