import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { tripService, weatherService, agentService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  CloudSun, Hotel, Plane, ArrowLeft, 
  Save, Trash2, Bus, Car, Train, MapPin, 
  ExternalLink, Calendar, RefreshCw,
  Thermometer, Droplets, Wind, CheckCircle2, Plus
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getOtherPlacesInRegion, getCurrentRealWorldMonthInfo } from '../data/indiaTravelData';

const RefreshSpinner = () => (
  <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #fee2e2', borderTopColor: '#d9261c', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export const TripResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  // Primary State
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  
  // Live Weather state
  const [liveWeather, setLiveWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Action Loading State
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch live weather from API
  const fetchLiveWeather = async (destName: string) => {
    if (!destName) return;
    setWeatherLoading(true);
    try {
      const data = await weatherService.getForecast(destName);
      if (data && (data.current_weather || data.daily_forecast || data.current || data.forecast)) {
        setLiveWeather(data);
      }
    } catch (err) {
      console.error("Live weather fetch error:", err);
    } finally {
      setWeatherLoading(false);
    }
  };



  // Load trip from database ID or location state
  useEffect(() => {
    let isMounted = true;
    const loadTrip = async () => {
      setLoading(true);
      setError(null);

      // 1. If URL contains trip ID, always fetch canonical full trip from database first
      if (id) {
        try {
          const fetched = await tripService.get(id);
          if (isMounted) {
            if (fetched && (fetched.destination || (fetched.itinerary && fetched.itinerary.length > 0))) {
              setTrip(fetched);
              setSaved(true);
              setLoading(false);
              if (fetched.destination) {
                fetchLiveWeather(fetched.destination);
              }
              // Async background call for svgMap if missing
              if (!fetched.svg_map && fetched.destination) {
                agentService.getSvgVisual({
                  start_location: fetched.start_location,
                  destination: fetched.destination,
                  num_days: fetched.num_days || 3
                }).then(svgRes => {
                  if (isMounted && svgRes?.svg_map) {
                    setTrip((prev: any) => (prev ? { ...prev, svg_map: svgRes.svg_map } : prev));
                  }
                }).catch(() => {});
              }
              return;
            } else {
              setError("Itinerary not found or empty.");
              setLoading(false);
              return;
            }
          }
        } catch (err: any) {
          console.error("Error fetching trip by ID:", err);
          // Fallback to location state trip if passed
          if (location.state?.trip) {
            if (isMounted) {
              setTrip(location.state.trip);
              setSaved(true);
              setLoading(false);
              if (location.state.trip.destination) fetchLiveWeather(location.state.trip.destination);
            }
            return;
          }
          if (isMounted) {
            setError("Failed to load itinerary. Please check the link or try again.");
            setLoading(false);
          }
          return;
        }
      }

      // 2. Fallback to location state trip if passed without ID parameter
      if (location.state?.trip) {
        const loaded = location.state.trip;
        if (isMounted) {
          setTrip(loaded);
          if (loaded.id || loaded._id) setSaved(true);
          setLoading(false);
        }
        if (loaded.destination) fetchLiveWeather(loaded.destination);
        return;
      }

      if (isMounted) {
        setError("No trip itinerary specified.");
        setLoading(false);
      }
    };

    loadTrip();
    return () => { isMounted = false; };
  }, [id, location.state]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: '#ffffff', minHeight: '80vh' }}>
        <RefreshSpinner />
        <span style={{ display: 'block', marginTop: '16px', color: '#000000', fontWeight: 900, fontSize: '1.1rem' }}>Loading full itinerary details...</span>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#ffffff', minHeight: '80vh', color: '#000000' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px', border: '3px solid #d9261c', borderRadius: '20px', backgroundColor: '#fee2e2' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d9261c', marginTop: 0 }}>Itinerary Not Found</h2>
          <p style={{ fontWeight: 700, margin: '16px 0 24px 0', fontSize: '1rem' }}>{error || "The requested itinerary details could not be found or loaded."}</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#d9261c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: any): string => {
    const num = Number(val);
    if (isNaN(num) || num === null || num === undefined) return '0';
    return num.toLocaleString('en-IN');
  };

  const budgetBreakdown = trip.budget_breakdown || {};
  const rawItinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];
  
  // Deduplicate itinerary by day number & schedule items to guarantee single rendering
  const itineraryMap = new Map();
  rawItinerary.forEach((dayObj: any) => {
    if (dayObj && (dayObj.day !== undefined) && !itineraryMap.has(dayObj.day)) {
      const schedMap = new Map();
      const schedList = Array.isArray(dayObj.schedule) ? dayObj.schedule : [];
      schedList.forEach((item: any) => {
        if (item) {
          const itemKey = `${item.time || ''}-${item.activity || ''}`;
          if (!schedMap.has(itemKey)) {
            schedMap.set(itemKey, item);
          }
        }
      });
      itineraryMap.set(dayObj.day, {
        ...dayObj,
        schedule: Array.from(schedMap.values())
      });
    }
  });
  const itinerary = Array.from(itineraryMap.values());

  const selectedHotel = trip.selected_hotel || {};
  const selectedTransport = trip.selected_transport || {};
  const weatherForecast = Array.isArray(trip.weather_forecast) ? trip.weather_forecast : [];




  // Helper for authentic Google Maps Links
  const getMapsUrl = (placeName: string, locationHint?: string) => {
    if (placeName && (placeName.startsWith('http://') || placeName.startsWith('https://'))) {
      return placeName;
    }
    const query = placeName ? `${placeName}, ${locationHint || trip.destination}` : trip.destination;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  // Calculate Nights
  const numDays = trip.num_days || (itinerary.length > 0 ? itinerary.length : 1);
  const numNights = Math.max(0, numDays - 1);

  // Pie chart data
  const pieData = [
    { name: 'Transport', value: budgetBreakdown.transportation || 0 },
    { name: 'Hotel', value: budgetBreakdown.hotel || 0 },
    { name: 'Food', value: budgetBreakdown.food || 0 },
    { name: 'Local Transit', value: budgetBreakdown.local_transport || 0 },
    { name: 'Activities', value: budgetBreakdown.activities || 0 },
    { name: 'Misc', value: budgetBreakdown.miscellaneous || 0 },
  ].filter(d => d.value > 0);

  const COLORS = ['#d9261c', '#b91c1c', '#991b1b', '#7f1d1d', '#dc2626', '#ef4444'];

  // Save / Book Trip in DB
  const handleSaveTrip = async () => {
    setSaveLoading(true);
    try {
      const tripId = trip.id || trip._id;
      if (tripId) {
        const updatedRes = await tripService.update(tripId, trip);
        if (updatedRes && updatedRes.trip) setTrip(updatedRes.trip);
        setSaved(true);
        showToast('Trip itinerary updated & saved to your account database!', 'success');
      } else {
        const savedData = await tripService.save(trip);
        setTrip(savedData.trip);
        setSaved(true);
        showToast('Trip saved successfully! Accessible anytime from your Dashboard.', 'success');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || 'Failed to save itinerary.';
      showToast(errMsg, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete Trip from DB
  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to delete this trip itinerary?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const tripIdToDelete = trip.id || trip._id;
      if (tripIdToDelete) {
        await tripService.delete(tripIdToDelete);
      }
      showToast('Trip deleted successfully.', 'info');
      navigate('/dashboard');
    } catch (err: any) {
      showToast('Failed to delete trip itinerary.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddPlaceToItinerary = (place: any) => {
    if (!trip) return;
    const regionInfo = getOtherPlacesInRegion(trip.destination);
    const newDayNum = (trip.itinerary?.length || 0) + 1;
    const newDay = {
      day: newDayNum,
      title: `Excursion to ${place.name}`,
      theme: `${place.category} Exploration in ${regionInfo.regionName}`,
      schedule: [
        { time: '08:30 AM', activity: `Travel to ${place.name}`, details: `Scenic journey across ${regionInfo.regionName} to ${place.name}.` },
        { time: '10:30 AM', activity: `Explore ${place.name}`, details: place.description },
        { time: '01:30 PM', activity: `Local Lunch & Regional Specialties`, details: `Taste authentic local cuisine around ${place.nearbyPlaces[0] || place.name}.` },
        { time: '03:30 PM', activity: `Visit Surrounding Attractions`, details: `Key attractions: ${place.nearbyPlaces.join(', ')}.` },
        { time: '07:00 PM', activity: `Evening Leisure & Return`, details: `Enjoy sunset views and relax after full day excursion.` }
      ]
    };

    const updatedItin = [...(trip.itinerary || []), newDay];
    setTrip({ ...trip, itinerary: updatedItin, num_days: newDayNum });
    showToast(`Added full-day excursion to ${place.name} as Day ${newDayNum} in your itinerary!`, 'success');
  };

  const getTransportIcon = (mode: string) => {
    const m = (mode || '').toLowerCase();
    if (m.includes('train')) return <Train size={20} />;
    if (m.includes('bus')) return <Bus size={20} />;
    if (m.includes('car') || m.includes('cab')) return <Car size={20} />;
    return <Plane size={20} />;
  };

  // Weather display resolution (combine live WeatherAPI.com or Open-Meteo API data)
  const curWeather = liveWeather?.current_weather || liveWeather?.current || trip.current_weather || {};
  const currentTemp = curWeather.temperature ? (typeof curWeather.temperature === 'number' ? `${curWeather.temperature}°C` : curWeather.temperature) : (weatherForecast[0]?.temp || "26°C");
  const currentCondition = curWeather.condition || weatherForecast[0]?.condition || "Clear & Pleasant";
  const currentHumidity = curWeather.humidity ? (typeof curWeather.humidity === 'number' ? `${curWeather.humidity}%` : curWeather.humidity) : "60%";
  const currentWind = curWeather.wind_speed ? (typeof curWeather.wind_speed === 'number' ? `${curWeather.wind_speed} km/h` : curWeather.wind_speed) : (curWeather.wind || "10 km/h");
  const forecastList = liveWeather?.daily_forecast || liveWeather?.forecast || weatherForecast;

  return (
    <div className="animate-slide-up" style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto', backgroundColor: '#ffffff', color: '#000000' }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#d9261c',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 900,
            fontSize: '1rem',
            padding: 0
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('places_to_visit')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'places_to_visit' ? '#d9261c' : '#fee2e2',
              border: '2px solid #d9261c',
              color: activeTab === 'places_to_visit' ? '#ffffff' : '#d9261c',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MapPin size={18} /> Places to Visit in {getOtherPlacesInRegion(trip.destination).regionName}
          </button>

          <button 
            onClick={handleSaveTrip}
            disabled={saveLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: saved ? '#ffffff' : '#d9261c',
              border: '2px solid #d9261c',
              color: saved ? '#d9261c' : '#ffffff',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saved ? 'Trip Saved' : (saveLoading ? 'Saving...' : 'Save Trip')}
          </button>

          <button 
            onClick={handleDeleteTrip}
            disabled={deleteLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              border: '2px solid #d9261c',
              color: '#d9261c',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Trash2 size={18} />
            {deleteLoading ? 'Deleting...' : 'Delete Trip'}
          </button>
        </div>
      </div>

      {/* TRIP HEADER SUMMARY BANNER (Clean, replaced misleading badges with real parameters) */}
      <div style={{
        padding: '28px 32px',
        marginBottom: '24px',
        backgroundColor: '#ffffff',
        border: '3px solid #d9261c',
        borderRadius: '20px',
        color: '#000000',
        boxShadow: '0 10px 30px rgba(217, 38, 28, 0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, padding: '4px 14px', background: '#d9261c', color: '#ffffff', borderRadius: '50px' }}>
                {numDays} Days / {numNights} Nights
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, padding: '4px 14px', background: '#fee2e2', color: '#d9261c', borderRadius: '50px', border: '1px solid #fca5a5' }}>
                {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0 0 8px 0', color: '#000000' }}>
              {trip.start_location} → {trip.destination}
            </h1>

            {/* Practical Trip Information Row */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#000000', fontSize: '0.95rem', fontWeight: 800 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={18} style={{ color: '#d9261c' }} />
                Travel Dates: <strong>{trip.start_date}</strong> to <strong>{trip.end_date}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={18} style={{ color: '#d9261c' }} />
                Destination: <strong>{trip.destination}</strong>
              </span>
            </div>
          </div>

          {/* Clean Financial & Weather Summary Box */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Live Weather Preview Pill */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #d9261c',
              borderRadius: '14px',
              padding: '14px 20px',
              textAlign: 'center',
              minWidth: '150px'
            }}>
              <span style={{ fontSize: '0.72rem', color: '#d9261c', fontWeight: 900, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                LIVE WEATHER
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '4px 0' }}>
                <CloudSun size={24} style={{ color: '#d9261c' }} />
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#000000' }}>{currentTemp}</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 800, display: 'block' }}>
                {currentCondition}
              </span>
            </div>

            {/* Estimated Budget Pill */}
            <div style={{
              background: '#fee2e2',
              border: '2px solid #d9261c',
              borderRadius: '14px',
              padding: '14px 22px',
              textAlign: 'right',
              minWidth: '180px'
            }}>
              <span style={{ fontSize: '0.72rem', color: '#000000', fontWeight: 900, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ESTIMATED BUDGET
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d9261c', display: 'block' }}>
                ₹{formatCurrency(budgetBreakdown.total || trip.budget)}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 800, display: 'block' }}>
                User Budget: ₹{formatCurrency(trip.budget)}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* TAB NAVIGATION BAR */}
      <div style={{
        display: 'flex',
        borderBottom: '3px solid #fee2e2',
        marginBottom: '24px',
        overflowX: 'auto',
        gap: '10px',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'itinerary', name: '📅 Day-by-Day Itinerary' },
          { id: 'places_to_visit', name: `📍 Places to Visit in ${getOtherPlacesInRegion(trip.destination).regionName}` },
          { id: 'hotels', name: '🏨 Recommended Hotels' },
          { id: 'weather', name: '🌤️ Live Weather' },
          { id: 'transport', name: '🚌 Transport Options' },
          { id: 'budget', name: '💰 Estimated Budget' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? '#d9261c' : '#ffffff',
              border: '2px solid #d9261c',
              borderRadius: '24px',
              color: activeTab === tab.id ? '#ffffff' : '#000000',
              padding: '10px 22px',
              fontWeight: 900,
              cursor: 'pointer',
              fontSize: '0.92rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 4px 14px rgba(217, 38, 28, 0.3)' : 'none'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* FULL WIDTH TAB CONTENTS */}
      <div>

        {/* TAB: PLACES TO VISIT IN REGION */}
        {activeTab === 'places_to_visit' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Real-World Dynamic Seasonal & Month Bar */}
            {(() => {
              const realTime = getCurrentRealWorldMonthInfo();
              return (
                <div style={{
                  padding: '20px 24px',
                  backgroundColor: '#fff1f2',
                  border: '2px solid #fecdd3',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, backgroundColor: '#e11d48', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                        🔴 REAL-WORLD LIVE TIME & SEASON
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9f1239' }}>
                        {realTime.formattedDate}
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#881337' }}>
                      Current Month: {realTime.currentMonthName} {realTime.currentYear} — {realTime.strategy.seasonTag}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#4c0519', fontWeight: 600 }}>
                      {realTime.strategy.description}
                    </p>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '12px 18px', borderRadius: '12px', border: '1px solid #fda4af' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9f1239', display: 'block', textTransform: 'uppercase' }}>
                      NEXT MONTH TRANSITION
                    </span>
                    <strong style={{ fontSize: '1rem', color: '#881337' }}>
                      {realTime.nextMonthName}: {realTime.nextStrategy.seasonTag}
                    </strong>
                  </div>
                </div>
              );
            })()}

            {/* Places to Visit Explorer Section */}
            {(() => {
              const regionData = getOtherPlacesInRegion(trip.destination);
              return (
                <div>
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #d9261c',
                    borderRadius: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          REGIONAL PLACES EXPLORER
                        </span>
                        <h2 style={{ margin: '4px 0', fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
                          Places to Visit in {regionData.regionName}
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
                          Selected Destination: <strong>{regionData.selectedPlaceName || trip.destination}</strong>. Suggested top places to visit across <strong>{regionData.regionName}</strong> (other than {regionData.selectedPlaceName || trip.destination}):
                        </p>
                      </div>

                      <span style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 800, fontSize: '0.88rem', border: '1px solid #fca5a5' }}>
                        {regionData.otherPlaces.length} Other Places in {regionData.regionName}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {regionData.otherPlaces.map((place, idx) => (
                      <div key={idx} style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                            <img 
                              src={place.image} 
                              alt={place.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <span style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              backgroundColor: '#d9261c',
                              color: '#ffffff',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 900,
                              textTransform: 'uppercase'
                            }}>
                              {place.category}
                            </span>
                            <span style={{
                              position: 'absolute',
                              bottom: '12px',
                              right: '12px',
                              backgroundColor: 'rgba(0,0,0,0.75)',
                              color: '#ffffff',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              In {regionData.regionName}
                            </span>
                          </div>

                          <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                              {place.name}
                            </h3>
                            <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                              {place.description}
                            </p>

                            {place.nearbyPlaces && place.nearbyPlaces.length > 0 && (
                              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                                  Key Attractions in {place.name}:
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {place.nearbyPlaces.map((np: string, nIdx: number) => (
                                    <span key={nIdx} style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                                      • {np}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ padding: '16px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => handleAddPlaceToItinerary(place)}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              backgroundColor: '#d9261c',
                              color: '#ffffff',
                              fontWeight: 900,
                              fontSize: '0.85rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <Plus size={16} /> Add to Itinerary
                          </button>
                          <a
                            href={getMapsUrl(place.name, regionData.regionName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '10px 14px',
                              borderRadius: '10px',
                              backgroundColor: '#ffffff',
                              color: '#d9261c',
                              border: '1.5px solid #d9261c',
                              fontWeight: 900,
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <ExternalLink size={14} /> Maps
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* TAB 1: DAY-BY-DAY ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {itinerary.map((day: any) => (


              <div 
                key={day.day} 
                style={{ 
                  padding: '24px', 
                  backgroundColor: '#ffffff', 
                  border: '2.5px solid #d9261c', 
                  borderRadius: '16px', 
                  color: '#000000',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                }}
              >
                
                {/* Day Header with exact travel date */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #fee2e2',
                  paddingBottom: '14px',
                  marginBottom: '18px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#000000' }}>
                      {day.day_label || `Day ${day.day} – ${day.date_formatted || day.date}`}
                    </h3>
                    <span style={{ fontSize: '0.9rem', color: '#d9261c', fontWeight: 800 }}>
                      Theme: {day.theme || 'Sightseeing & Local Experiences'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', padding: '6px 14px', borderRadius: '50px', border: '1px solid #fca5a5' }}>
                    <CloudSun size={18} style={{ color: '#d9261c' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#000000' }}>
                      {day.weather_condition || day.weather?.condition || 'Clear & Pleasant'} ({day.temp || day.weather?.temp || '24°C'})
                    </span>
                  </div>
                </div>

                {/* Live Weather Forecast Banner for this specific booked travel day */}
                {(() => {
                  const dIdx = (day.day || 1) - 1;
                  const dayW = (forecastList && forecastList[dIdx])
                    ? forecastList[dIdx]
                    : (day.weather || {
                        condition: day.weather_condition || 'Clear & Pleasant',
                        temp: day.temp || '22 - 30°C',
                        icon: day.icon || '☀️',
                        rain_chance: day.rain_chance !== undefined ? day.rain_chance : 15,
                        suitability: day.suitability || 'Great weather for outdoor sightseeing & photography'
                      });

                  const iconStr = dayW.icon || (dayW.condition?.toLowerCase().includes('rain') ? '🌧️' : '☀️');
                  const rainChance = dayW.rain_chance !== undefined ? dayW.rain_chance : (day.rain_chance !== undefined ? day.rain_chance : 15);
                  const suitabilityMsg = dayW.suitability || day.suitability || (rainChance > 50 ? 'Indoor museums & regional dining recommended' : 'Perfect sunny weather for outdoor sightseeing & photography');
                  const dayDate = dayW.date || day.date_formatted || day.date || `Day ${day.day}`;

                  return (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{iconStr}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '1.05rem', color: '#9f1239', fontWeight: 900 }}>
                              {dayW.condition || 'Clear Sky'}
                            </strong>
                            <span style={{ fontSize: '0.85rem', fontWeight: 900, backgroundColor: '#ffffff', color: '#dc2626', padding: '2px 10px', borderRadius: '12px', border: '1px solid #fda4af' }}>
                              🌡️ {dayW.temp || day.temp || '24°C'}
                            </span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, backgroundColor: '#ffffff', color: '#0284c7', padding: '2px 10px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                              💧 {rainChance}% Rain Chance
                            </span>
                          </div>
                          <span style={{ fontSize: '0.84rem', color: '#881337', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                            💡 <strong>Sightseeing Tip for {dayDate}:</strong> {suitabilityMsg}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#be123c', textTransform: 'uppercase', display: 'block' }}>
                          LIVE FORECAST DATE
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>
                          📅 {dayDate}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Activity Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {day.schedule.map((item: any, idx: number) => {
                    const mapsUrl = item.google_maps_url || getMapsUrl(item.activity);
                    return (
                      <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        
                        <span style={{
                          fontSize: '0.88rem',
                          fontWeight: 900,
                          color: '#d9261c',
                          width: '85px',
                          flexShrink: 0,
                          paddingTop: '2px'
                        }}>
                          {item.time}
                        </span>

                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#d9261c',
                          marginTop: '6px',
                          flexShrink: 0
                        }} />

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ fontWeight: 900, fontSize: '1.02rem', color: '#000000' }}>
                              {item.activity}
                            </span>
                            
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 900,
                                color: '#d9261c',
                                backgroundColor: '#fee2e2',
                                border: '1px solid #fca5a5',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                textDecoration: 'none'
                              }}
                            >
                              <MapPin size={13} /> View on Google Maps <ExternalLink size={11} />
                            </a>
                          </div>

                          <p style={{ color: '#000000', fontSize: '0.9rem', fontWeight: 700, margin: '4px 0 0 0', lineHeight: 1.45 }}>
                            {item.details}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        )}



        {/* TAB 3: RECOMMENDED HOTELS & ACCOMMODATIONS */}
        {activeTab === 'hotels' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '24px', backgroundColor: '#ffffff', border: '2.5px solid #d9261c', borderRadius: '16px', color: '#000000' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Hotel size={28} style={{ color: '#d9261c' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#000000' }}>Primary Recommended Accommodation</h3>
                  <span style={{ fontSize: '0.85rem', color: '#000000', fontWeight: 700 }}>Selected based on location proximity and budget criteria</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#fee2e2', padding: '20px', borderRadius: '14px', border: '1px solid #fca5a5', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 900, color: '#000000' }}>{selectedHotel.name}</h4>
                  <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 800, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span>Tariff: <strong style={{ color: '#d9261c' }}>₹{selectedHotel.price_per_night || 0} / night</strong></span>
                    <span>Total Stay ({numNights} Nights): <strong style={{ color: '#d9261c' }}>₹{formatCurrency((Number(selectedHotel.price_per_night) || 0) * Math.max(1, numNights))}</strong></span>
                    <span>Rating: <strong>{selectedHotel.rating} ★ ({selectedHotel.style || 'Standard'})</strong></span>
                    <span>Approx Location: <strong>{selectedHotel.distance_km || '1.5'} km to center</strong></span>
                  </div>
                </div>

                <a
                  href={selectedHotel.google_maps_url || getMapsUrl(selectedHotel.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#d9261c',
                    color: '#ffffff',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    textDecoration: 'none'
                  }}
                >
                  <MapPin size={16} /> View Hotel on Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '10px 0 0 0', color: '#000000' }}>
              Other Available Hotels in {trip.destination}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {trip.hotel_options?.map((h: any) => {
                const isSelected = selectedHotel.name === h.name;
                const mapsUrl = h.google_maps_url || getMapsUrl(h.name);
                return (
                  <div 
                    key={h.id || h.name}
                    style={{ 
                      padding: '20px', 
                      borderRadius: '16px',
                      border: '2.5px solid #d9261c',
                      backgroundColor: isSelected ? '#fee2e2' : '#ffffff',
                      color: '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#d9261c', background: '#ffffff', border: '1px solid #fca5a5', padding: '2px 8px', borderRadius: '50px' }}>
                          {h.style} Tier
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#d9261c' }}>
                          ★ {h.rating}
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 6px 0', fontWeight: 900, fontSize: '1.1rem', color: '#000000' }}>{h.name}</h4>
                      
                      <span style={{ fontSize: '0.95rem', fontWeight: 900, display: 'block', color: '#d9261c', marginBottom: '8px' }}>
                        ₹{h.price_per_night} / night
                      </span>

                      <p style={{ fontSize: '0.85rem', color: '#000000', fontWeight: 700, margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        {h.description}
                      </p>

                      <span style={{ fontSize: '0.8rem', color: '#000000', fontWeight: 800, display: 'block', marginBottom: '12px' }}>
                        📍 Distance: {h.distance_km || '2.0'} km from destination center
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', borderTop: '1px solid #fee2e2', paddingTop: '12px' }}>
                      <button
                        onClick={() => {
                          setTrip({ ...trip, selected_hotel: h });
                          setSaved(false);
                          showToast(`Selected ${h.name} as preferred hotel.`, 'info');
                        }}
                        style={{
                          backgroundColor: isSelected ? '#d9261c' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#d9261c',
                          border: '2px solid #d9261c',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? 'Currently Selected' : 'Select Hotel'}
                      </button>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 900,
                          color: '#d9261c',
                          backgroundColor: '#fee2e2',
                          border: '1px solid #fca5a5',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                      >
                        <MapPin size={14} /> View on Maps <ExternalLink size={12} />
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: LIVE WEATHER SECTION */}
        {activeTab === 'weather' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '24px', backgroundColor: '#ffffff', border: '2.5px solid #d9261c', borderRadius: '16px', color: '#000000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#000000' }}>
                    Real-time Live Weather for {trip.destination}
                  </h3>
                  <span style={{ fontSize: '0.88rem', color: '#000000', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                    Live forecast for travel dates ({trip.start_date} to {trip.end_date})
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>


                  <button
                    onClick={() => fetchLiveWeather(trip.destination)}
                    disabled={weatherLoading}
                    style={{
                      backgroundColor: '#d9261c',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(217, 38, 28, 0.3)'
                    }}
                  >
                    <RefreshCw size={16} className={weatherLoading ? 'animate-spin' : ''} />
                    {weatherLoading ? 'Updating Weather...' : '🌤️ Check Live Weather'}
                  </button>
                </div>
              </div>

              {/* Current Weather Highlights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                
                <div style={{ padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Thermometer size={32} style={{ color: '#d9261c' }} />
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 900, display: 'block' }}>TEMPERATURE</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d9261c' }}>{currentTemp}</span>
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <CloudSun size={32} style={{ color: '#d9261c' }} />
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 900, display: 'block' }}>CONDITION</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d9261c' }}>{currentCondition}</span>
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Droplets size={32} style={{ color: '#d9261c' }} />
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 900, display: 'block' }}>HUMIDITY</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d9261c' }}>{currentHumidity}</span>
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Wind size={32} style={{ color: '#d9261c' }} />
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 900, display: 'block' }}>WIND SPEED</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d9261c' }}>{currentWind}</span>
                  </div>
                </div>

              </div>

              {/* Daily Forecast List for Actual Travel Dates */}
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 12px 0', color: '#000000' }}>

                Forecast for Travel Dates ({trip.destination})
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                {forecastList.map((w: any, idx: number) => (
                  <div key={idx} style={{ padding: '16px', textAlign: 'center', backgroundColor: '#ffffff', border: '2.5px solid #d9261c', borderRadius: '12px' }}>
                    <CloudSun size={28} style={{ color: '#d9261c', marginBottom: '6px' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, display: 'block', color: '#000000' }}>
                      {w.date_formatted || w.date || `Day ${idx + 1}`}
                    </span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#d9261c', margin: '4px 0', display: 'block' }}>
                      {w.temp}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#000000', fontWeight: 800, display: 'block' }}>
                      {w.condition}
                    </span>
                    {w.rain_chance !== undefined && (
                      <span style={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                        Rain Risk: {w.rain_chance}%
                      </span>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}


        {/* TAB 5: TRANSPORT OPTIONS */}
        {activeTab === 'transport' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '24px', backgroundColor: '#ffffff', border: '2.5px solid #d9261c', borderRadius: '16px', color: '#000000' }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '1.25rem', fontWeight: 900, color: '#000000' }}>Primary Recommended Transport</h3>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#fee2e2', padding: '20px', borderRadius: '14px', border: '1px solid #fca5a5' }}>
                <div style={{ color: '#d9261c' }}>
                  {getTransportIcon(selectedTransport.mode)}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 900, color: '#000000' }}>
                    {selectedTransport.mode} — {selectedTransport.name}
                  </h4>
                  <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 800, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span>Fare: <strong style={{ color: '#d9261c' }}>₹{selectedTransport.cost_per_person || 0} / person</strong></span>
                    <span>Total Transit ({trip.travelers} Travelers): <strong style={{ color: '#d9261c' }}>₹{formatCurrency((Number(selectedTransport.cost_per_person) || 0) * (Number(trip.travelers) || 1))}</strong></span>
                    <span>Duration: <strong>{selectedTransport.duration_hours} hrs</strong></span>
                    <span>Timing: <strong>{selectedTransport.departure} → {selectedTransport.arrival}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '10px 0 0 0', color: '#000000' }}>
              All Transport Options for {trip.start_location} → {trip.destination}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {trip.transport_options?.map((t: any, idx: number) => {
                const isSelected = selectedTransport.name === t.name;
                return (
                  <div 
                    key={idx}
                    style={{ 
                      padding: '20px', 
                      borderRadius: '16px',
                      border: '2.5px solid #d9261c',
                      backgroundColor: isSelected ? '#fee2e2' : '#ffffff',
                      color: '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#d9261c' }}>{getTransportIcon(t.mode)}</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 900, backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                            {t.mode}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                          {t.comfort_tier || 'Standard'} Tier
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 6px 0', fontWeight: 900, fontSize: '1.08rem', color: '#0f172a' }}>
                        {t.name}
                      </h4>

                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#d9261c', marginBottom: '8px' }}>
                        ₹{formatCurrency(t.cost_per_person || 0)} / person
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginLeft: '6px' }}>
                          (₹{formatCurrency((Number(t.cost_per_person) || 0) * (Number(trip.travelers) || 1))} total)
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', marginBottom: '10px' }}>
                        <div>⏱️ Duration: <strong>{t.duration_hours} hrs</strong></div>
                        {t.departure && t.arrival && (
                          <div style={{ marginTop: '3px' }}>🕒 Schedule: <strong>{t.departure} → {t.arrival}</strong></div>
                        )}
                      </div>

                      {t.suitability && (
                        <p style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600, margin: '0 0 12px 0', lineHeight: 1.45 }}>
                          💡 {t.suitability}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTrip({ ...trip, selected_transport: t });
                        setSaved(false);
                        showToast(`Selected ${t.name} as primary transport.`, 'info');
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: isSelected ? '#d9261c' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#d9261c',
                        border: '2px solid #d9261c',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        marginTop: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isSelected ? '✓ Currently Selected Transport' : 'Select Transport Option'}
                    </button>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: ESTIMATED BUDGET BREAKDOWN */}
        {activeTab === 'budget' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ padding: '24px', backgroundColor: '#ffffff', border: '2.5px solid #d9261c', borderRadius: '16px', color: '#000000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#000000' }}>
                    Estimated Budget Breakdown
                  </h3>
                  <span style={{ fontSize: '0.88rem', color: '#000000', fontWeight: 700 }}>
                    Estimated costs based on {trip.travelers} travelers for {numDays} days / {numNights} nights
                  </span>
                </div>

                <div style={{ background: '#fee2e2', border: '2px solid #d9261c', padding: '8px 16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#000000', display: 'block' }}>TOTAL ESTIMATED COST</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#d9261c' }}>
                    ₹{formatCurrency(budgetBreakdown.total)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
                
                {/* Pie Chart */}
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => `₹${formatCurrency(v)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Transportation', amount: budgetBreakdown.transportation || 0, desc: `${selectedTransport.mode} fare for ${trip.travelers} travelers` },
                    { label: 'Hotel & Stay', amount: budgetBreakdown.hotel || 0, desc: `${selectedHotel.name} for ${numNights} nights` },
                    { label: 'Food & Dining', amount: budgetBreakdown.food || 0, desc: `Estimated meals & regional snacks` },
                    { label: 'Local Transit', amount: budgetBreakdown.local_transport || 0, desc: `Local cabs/autos/metro` },
                    { label: 'Attraction Entry Fees', amount: budgetBreakdown.activities || 0, desc: `Entry tickets for sightseeing` },
                    { label: 'Miscellaneous', amount: budgetBreakdown.miscellaneous || 0, desc: `Emergency & souvenir cushion` }
                  ].map((cat, cIdx) => (
                    <div key={cIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#fee2e2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
                      <div>
                        <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#000000', display: 'block' }}>{cat.label}</span>
                        <span style={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700 }}>{cat.desc}</span>
                      </div>
                      <span style={{ fontWeight: 900, fontSize: '1rem', color: '#d9261c' }}>
                        ₹{formatCurrency(cat.amount)}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TripResult;
