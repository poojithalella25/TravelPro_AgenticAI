import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Save, ShieldCheck, RefreshCw } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const { showToast } = useToast();
  const [budget, setBudget] = useState(20000);
  const [style, setStyle] = useState('Balanced');
  const [transport, setTransport] = useState('No preference');
  const [food, setFood] = useState('No preference');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      const prefs = user.preferences;
      setBudget(prefs.default_budget || 20000);
      setStyle(prefs.preferred_style || 'Balanced');
      setTransport(prefs.preferred_transport || 'No preference');
      setFood(prefs.food_preference || 'No preference');
      setSelectedInterests(prefs.interests || ['Historical', 'Food']);
    }
  }, [user]);

  const interestOptions = [
    'Historical', 'Nature', 'Food', 'Shopping', 
    'Adventure', 'Family', 'Religious', 'Entertainment', 'Museums'
  ];

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updatePreferences({
        default_budget: budget,
        preferred_style: style,
        preferred_transport: transport,
        food_preference: food,
        interests: selectedInterests
      });
      setSuccess(true);
      showToast('Travel preferences saved successfully to database!', 'success');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      showToast('Failed to update preferences.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 4px 0' }}>Profile & Preferences</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Configure default settings that shape your AI Travel planner memory.</p>
      </div>

      {success && (
        <div style={{
          background: '#fee2e2',
          border: '2px solid #d9261c',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#d9261c',
          fontSize: '0.9rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <ShieldCheck size={18} />
          Preferences saved successfully! These changes will be pre-filled on new trip creation.
        </div>
      )}

      <form className="glass-panel" onSubmit={handleSave} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', border: '3px solid #d9261c', backgroundColor: '#ffffff', color: '#000000' }}>
        
        {/* Default Budget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 900, fontSize: '0.95rem', color: '#000000' }}>Default Budget (₹)</label>
          <input
            type="number"
            className="glass-input"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #d9261c', color: '#000000', backgroundColor: '#ffffff', fontWeight: 800 }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          {/* Default Travel Style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 900, fontSize: '0.95rem', color: '#000000' }}>Preferred Travel Style</label>
            <select 
              className="glass-input"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: '#ffffff', color: '#000000', border: '2px solid #d9261c', fontWeight: 800 }}
            >
              <option value="Balanced">Balanced</option>
              <option value="Cheapest">Cheapest</option>
              <option value="Fastest">Fastest</option>
              <option value="Comfortable">Comfortable</option>
            </select>
          </div>

          {/* Preferred Transportation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 900, fontSize: '0.95rem', color: '#000000' }}>Preferred Transportation</label>
            <select 
              className="glass-input"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: '#ffffff', color: '#000000', border: '2px solid #d9261c', fontWeight: 800 }}
            >
              <option value="No preference">No preference</option>
              <option value="Train">Train</option>
              <option value="Bus">Bus</option>
              <option value="Flight">Flight</option>
              <option value="Car">Car / Cab</option>
            </select>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 900, fontSize: '0.95rem', color: '#000000' }}>Dietary Preference</label>
          <select 
            className="glass-input"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: '#ffffff', color: '#000000', border: '2px solid #d9261c', fontWeight: 800 }}
          >
            <option value="No preference">No preference</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>
        </div>

        {/* Default Attraction Interests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontWeight: 900, fontSize: '0.95rem', color: '#000000' }}>Default Interests</label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {interestOptions.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '50px',
                    background: isSelected ? '#d9261c' : '#ffffff',
                    border: '2px solid #d9261c',
                    color: isSelected ? '#ffffff' : '#000000',
                    fontWeight: 900,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

        {/* Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className="glass-button"
          style={{ alignSelf: 'flex-start' }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Preferences
            </>
          )}
        </button>

      </form>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileSettings;
