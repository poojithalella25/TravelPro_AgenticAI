import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripService, agentService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Plus, MapPin, Compass, ArrowRight, BookOpen, UserCheck, Trash2, 
  Sparkles, RefreshCw, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const newPlanRequest = location.state?.newPlanRequest;

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Agent planning state directly within Dashboard
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [planningLog, setPlanningLog] = useState<string>('Initializing LangGraph travel orchestrator...');
  const [planningError, setPlanningError] = useState<string>('');
  const [plannedDestination, setPlannedDestination] = useState<string>('');
  const hasPlannedRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.list();
        setTrips(data);
      } catch (err) {
        console.error('Failed to load trips:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Handle background trip planning if passed from CreateTrip
  useEffect(() => {
    if (newPlanRequest && !hasPlannedRef.current) {
      hasPlannedRef.current = true;
      setIsPlanning(true);
      setPlanningError('');
      setPlannedDestination(newPlanRequest.destination || 'Destination');
      setPlanningLog('Executing Transport, Hotel, Places & Weather agents in parallel...');

      // Clean browser history state so refresh won't duplicate plan trigger
      window.history.replaceState({}, document.title);

      const runAgentPlan = async () => {
        try {
          const finalState = await agentService.plan(newPlanRequest);
          setPlanningLog('Saving itinerary to your account database...');

          let savedTrip = finalState;
          try {
            const savedRes = await tripService.save(finalState);
            if (savedRes && savedRes.trip) {
              savedTrip = savedRes.trip;
            }
          } catch (saveErr) {
            console.error('Failed auto-saving trip on creation:', saveErr);
          }

          // Asynchronous background trigger for SVG route map
          if (!savedTrip.svg_map) {
            agentService.getSvgVisual({
              start_location: savedTrip.start_location,
              destination: savedTrip.destination,
              num_days: savedTrip.num_days || 3
            }).then(svgRes => {
              if (svgRes?.svg_map) {
                const tripId = savedTrip.id || savedTrip._id;
                if (tripId) {
                  tripService.update(tripId, { svg_map: svgRes.svg_map }).catch(() => {});
                }
              }
            }).catch(() => {});
          }

          // Update local trips list instantly
          const tripId = savedTrip.id || savedTrip._id;
          setTrips(prev => [savedTrip, ...prev.filter(t => (t.id || t._id) !== tripId)]);
          setIsPlanning(false);

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d9261c', '#ffffff', '#b91c1c']
          });

          showToast(`Trip to ${newPlanRequest.destination} planned & saved successfully!`, 'success');
        } catch (err: any) {
          setIsPlanning(false);
          const errMsg = err.response?.data?.detail || 'Agent planning failed. Please try again.';
          setPlanningError(errMsg);
          showToast(errMsg, 'error');
        }
      };

      runAgentPlan();
    }
  }, [newPlanRequest]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await tripService.delete(id);
        setTrips(trips.filter(t => t.id !== id));
        showToast('Trip itinerary deleted successfully.', 'info');
      } catch (err) {
        console.error('Failed to delete trip:', err);
        showToast('Failed to delete trip itinerary.', 'error');
      }
    }
  };

  const getDayCount = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return `${diff} Days`;
    } catch {
      return 'Multi-day';
    }
  };

  return (
    <div className="animate-slide-up" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0 0 4px 0', color: '#000000' }}>
            Welcome Back, <span style={{ color: '#d9261c' }}>{user?.name}</span>!
          </h1>
          <p style={{ color: '#000000', margin: 0, fontWeight: 700 }}>Configure and monitor your agentic travel itineraries here.</p>
        </div>

        <button 
          onClick={() => navigate('/create-trip')} 
          className="glass-button"
          style={{ padding: '12px 24px', borderRadius: '10px' }}
        >
          <Plus size={18} />
          Plan New Trip
        </button>
      </header>

      {/* Active AI Agent Planning Banner inside Dashboard */}
      {isPlanning && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '3px solid #d9261c',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '36px',
          boxShadow: '0 8px 24px rgba(217, 38, 28, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              border: '2px solid #d9261c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <RefreshCw size={22} style={{ color: '#d9261c', animation: 'spin 1s linear infinite' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, background: '#d9261c', color: '#ffffff', padding: '2px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>
                  AGENTIC AI IN PROGRESS
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#000000' }}>
                  Planning Trip to {plannedDestination}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#000000', fontWeight: 800 }}>
                {planningLog}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', padding: '8px 16px', borderRadius: '12px', border: '1px solid #fca5a5' }}>
            <Sparkles size={18} style={{ color: '#d9261c' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#d9261c' }}>Autonomous Orchestration</span>
          </div>
        </div>
      )}

      {planningError && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '2px solid #d9261c',
          borderRadius: '16px',
          padding: '16px 24px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={24} style={{ color: '#d9261c' }} />
            <div>
              <h4 style={{ margin: 0, fontWeight: 900, color: '#d9261c', fontSize: '1rem' }}>Planning Issue</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem', color: '#000000', fontWeight: 700 }}>{planningError}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/create-trip')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d9261c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Summary Panel */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '10px', border: '1px solid #d9261c' }}>
            <Compass size={24} style={{ color: '#d9261c' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#000000', display: 'block', fontWeight: 900 }}>TOTAL PLANS</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#000000' }}>{trips.length}</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '10px', border: '1px solid #d9261c' }}>
            <BookOpen size={24} style={{ color: '#d9261c' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#000000', display: 'block', fontWeight: 900 }}>SAVED TRIPS</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#000000' }}>{trips.filter(t => t.status === 'saved').length}</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '10px', border: '1px solid #d9261c' }}>
            <UserCheck size={24} style={{ color: '#d9261c' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#000000', display: 'block', fontWeight: 900 }}>TRAVEL STYLE</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#000000' }}>{user?.preferences?.preferred_style || 'Balanced'}</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '10px', border: '1px solid #d9261c' }}>
            <MapPin size={24} style={{ color: '#d9261c' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#000000', display: 'block', fontWeight: 900 }}>PREFER TRANSIT</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#000000' }}>{user?.preferences?.preferred_transport || 'No preference'}</span>
          </div>
        </div>
      </section>

      {/* Saved / Recent Trips List */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', color: '#000000' }}>Saved Itineraries</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #fee2e2',
              borderTopColor: '#d9261c',
              borderRadius: '50%',
              margin: '0 auto 20px auto',
              animation: 'spin 1s linear infinite'
            }} />
            <span style={{ color: '#000000', fontWeight: 800 }}>Loading itineraries...</span>
          </div>
        ) : trips.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            border: '3px solid #d9261c'
          }}>
            <Compass size={48} style={{ color: '#d9261c' }} />
            <h3 style={{ margin: '0', fontSize: '1.25rem', fontWeight: 900, color: '#000000' }}>No Itineraries Saved Yet</h3>
            <p style={{ color: '#000000', maxWidth: '400px', margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 700 }}>
              Your Travel Agent is ready. Specify destination goals and constraints to generate optimized plans.
            </p>
            <button 
              onClick={() => navigate('/create-trip')} 
              className="glass-button glass-button-secondary"
            >
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {trips.map((trip) => {
              const tripId = trip.id || trip._id;
              return (
                <div 
                  key={tripId} 
                  onClick={() => navigate(`/itinerary/${tripId}`, { state: { trip } })}
                  className="glass-card" 
                  style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    border: '3px solid #d9261c'
                  }}
                >
                  {/* Visual Header */}
                  <div style={{
                    padding: '24px 24px 16px 24px',
                    background: '#fee2e2',
                    borderBottom: '2px solid #d9261c',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        background: '#d9261c',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '50px'
                      }}>
                        {getDayCount(trip.start_date, trip.end_date)}
                      </span>
                      <button 
                        onClick={(e) => handleDelete(tripId, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#d9261c',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(217, 38, 28, 0.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#000000' }}>{trip.destination}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#000000', fontWeight: 800 }}>From {trip.start_location}</span>
                  </div>
                  
                  {/* Trip Specs */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#000000', fontWeight: 800 }}>Budget Limit:</span>
                        <span style={{ fontWeight: 900, color: '#000000' }}>₹{Number(trip.budget || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#000000', fontWeight: 800 }}>Estimated Spend:</span>
                        <span style={{ 
                          fontWeight: 900, 
                          color: '#d9261c' 
                        }}>
                          ₹{trip.budget_breakdown?.total?.toLocaleString('en-IN') || 'Pending'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#000000', fontWeight: 800 }}>Travelers:</span>
                        <span style={{ fontWeight: 900, color: '#000000' }}>{trip.travelers} {trip.travelers === 1 ? 'Person' : 'People'}</span>
                      </div>
                    </div>
                    
                    {/* Action Link */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'flex-end', 
                      gap: '6px',
                      fontSize: '0.85rem',
                      color: '#d9261c',
                      fontWeight: 900
                    }}>
                      View Itinerary <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};

export default Dashboard;
