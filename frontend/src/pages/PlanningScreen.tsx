import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PlanningScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const planRequest = location.state?.planRequest;

  useEffect(() => {
    if (!planRequest) {
      navigate('/dashboard');
      return;
    }

    navigate('/dashboard', { state: { newPlanRequest: planRequest } });
  }, [planRequest, navigate]);

  return (
    <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '80vh' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #fee2e2',
        borderTopColor: '#d9261c',
        borderRadius: '50%',
        margin: '0 auto 16px auto',
        animation: 'spin 1s linear infinite'
      }} />
      <h3 style={{ margin: 0, fontWeight: 900, color: '#000000' }}>Opening Dashboard...</h3>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PlanningScreen;
