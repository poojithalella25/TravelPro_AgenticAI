import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, Send, RotateCcw, MapPin, Bot, RefreshCw } from 'lucide-react';

import { agentService } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  links?: { label: string; path: string }[];
  timestamp: string;
  isError?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What places can I visit near here?",
  "What should I carry for this trip?",
  "Is this itinerary suitable for 3 days?",
  "What is the best time to visit this destination?",
  "What food should I try there?",
  "Can you suggest nearby tourist attractions?",
  "What is the weather expected to be like?",
  "How can I modify this itinerary?",
  "How much time should I spend at this location?"
];

export const AIAgentWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTrip, setActiveTrip] = useState<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "👋 Hi! I am your **Groq-powered AI Travel Assistant**.\n\nI have full context of your itinerary and trip details! Ask me anything about sightseeing, packing tips, duration suitability, weather, food, or custom travel questions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Read active trip context from localStorage whenever route or window changes
  useEffect(() => {
    try {
      const savedTripStr = localStorage.getItem('active_trip');
      if (savedTripStr) {
        const parsed = JSON.parse(savedTripStr);
        setActiveTrip(parsed);
      } else {
        setActiveTrip(null);
      }
    } catch (e) {
      setActiveTrip(null);
    }
  }, [location.pathname, isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsgId = 'usr-' + Date.now();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: nowStr
    };

    setMessages((prev) => [...prev, newUserMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      // Prepare chat history payload (last 6 turns)
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      // Call backend AI assistant service
      const res = await agentService.assistant(query, historyPayload);

      const aiMsgId = 'ai-' + Date.now();
      const newAiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'assistant',
        text: res.reply || "I am your Travel Pro AI Assistant. How else can I assist with your itinerary?",
        links: res.links || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, newAiMsg]);
    } catch (err: any) {
      console.error("AI Assistant request failed:", err);
      const aiMsgId = 'err-' + Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'assistant',
          text: "⚠️ Sorry, I could not reach the backend AI service right now. Please check your internet connection or backend server status.",
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: "Conversation reset! I am ready to answer any custom travel questions about your trip itinerary.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Helper to format basic markdown (bold, bullets, line breaks)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // Parse **bold** text
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={lIdx} style={{ marginLeft: '12px', marginBottom: '4px', display: 'flex', gap: '6px' }}>
            <span style={{ color: '#d9261c', fontWeight: 900 }}>•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      return (
        <p key={lIdx} style={{ margin: '0 0 6px 0', lineHeight: 1.45 }}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      
      {/* Floating Action Launch Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: '#d9261c',
            color: '#ffffff',
            border: '3px solid #ffffff',
            borderRadius: '50px',
            padding: '14px 22px',
            fontWeight: 900,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(217, 38, 28, 0.4)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sparkles size={20} />
          <span>AI Travel Assistant</span>
          {activeTrip && (
            <span style={{ backgroundColor: '#ffffff', color: '#d9261c', borderRadius: '50px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 900 }}>
              Active Trip
            </span>
          )}
        </button>
      )}

      {/* Main Chatbot Modal Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '560px',
          maxHeight: 'calc(100vh - 100px)',
          backgroundColor: '#ffffff',
          border: '3px solid #d9261c',
          borderRadius: '24px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          
          {/* Header Bar */}
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#d9261c',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '6px', borderRadius: '10px', color: '#d9261c' }}>
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#ffffff' }}>
                  Travel Pro AI Assistant
                </h4>
                <span style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 700 }}>
                  {activeTrip?.destination ? `📍 Context: ${activeTrip.destination}` : 'Powered by Groq LLM'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Active Trip Banner Pill if present */}
          {activeTrip?.destination && (
            <div style={{
              backgroundColor: '#fee2e2',
              padding: '8px 16px',
              borderBottom: '1px solid #fca5a5',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#d9261c',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <MapPin size={14} />
              <span>Loaded context: <strong>{activeTrip.start_location || 'Origin'} → {activeTrip.destination}</strong> ({activeTrip.num_days || 3} Days, ₹{activeTrip.budget || 20000})</span>
            </div>
          )}

          {/* Message Stream Area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    backgroundColor: isUser ? '#d9261c' : (msg.isError ? '#fee2e2' : '#ffffff'),
                    color: isUser ? '#ffffff' : '#000000',
                    border: isUser ? 'none' : (msg.isError ? '1.5px solid #ef4444' : '1.5px solid #fee2e2'),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}>
                    {renderFormattedText(msg.text)}

                    {/* Interactive Action Links */}
                    {msg.links && msg.links.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {msg.links.map((link, lIdx) => (
                          <button
                            key={lIdx}
                            onClick={() => {
                              navigate(link.path);
                              setIsOpen(false);
                            }}
                            style={{
                              textAlign: 'left',
                              backgroundColor: '#fee2e2',
                              border: '1px solid #fca5a5',
                              color: '#d9261c',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 900,
                              cursor: 'pointer'
                            }}
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <span style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      opacity: 0.7,
                      marginTop: '6px',
                      textAlign: 'right'
                    }}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loading / Typing Animation */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#ffffff', borderRadius: '16px', width: 'fit-content', border: '1.5px solid #fee2e2' }}>
                <RefreshCw size={14} className="animate-spin" style={{ color: '#d9261c' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#000000' }}>Groq AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Question Chips (Optional & Scrollable) */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #fee2e2',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#d9261c',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box & Send Button */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            borderTop: '2px solid #fee2e2',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask anything about your trip..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '2px solid #fee2e2',
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#000000',
                outline: 'none'
              }}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              style={{
                backgroundColor: (!inputValue.trim() || isLoading) ? '#fca5a5' : '#d9261c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 14px',
                cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default AIAgentWidget;
