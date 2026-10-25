import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, ArrowLeft, ShieldAlert, Compass, ChevronRight, Check
} from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../data/indiaTravelData';

interface MonthDetail {
  month: string;
  seasonTag: string;
  icon: string;
  seasonType: 'Winter' | 'Spring' | 'Summer' | 'Monsoon' | 'Post-Monsoon';
  tempRange: string;
  rainfall: string;
  summary: string;
  suggestedActivities: string[];
  travelTips: string[];
  recommendedStates: string[];
  recommendedUTs: string[];
  sampleDestinations: { name: string; state: string; category: string; image: string; highlight: string }[];
}

const MONTH_DETAILS_MAP: Record<string, MonthDetail> = {
  'January': {
    month: 'January',
    seasonTag: 'Peak Winter & Desert Royalty',
    icon: '❄️',
    seasonType: 'Winter',
    tempRange: '10°C - 24°C (Cool & Crisp)',
    rainfall: 'Low / Dry Season',
    summary: 'Ideal for royal desert safaris in Rajasthan, white salt marsh festival in Kutch Gujarat, and sunny tropical beach retreats in South India.',
    suggestedActivities: ['Jaisalmer Desert Dunes & Campfire', 'Kutch Rann Utsav Cultural Nights', 'Alleppey Backwater Houseboat Cruise', 'Gulmarg Snow Skiing'],
    travelTips: ['Carry heavy woolens for Northern & Himalayan regions.', 'Book hotel stays early due to peak winter festival season.'],
    recommendedStates: ['Rajasthan', 'Gujarat', 'Kerala', 'Tamil Nadu', 'Goa'],
    recommendedUTs: ['Andaman & Nicobar Islands', 'Puducherry', 'Delhi'],
    sampleDestinations: [
      { name: 'Jaisalmer', state: 'Rajasthan', category: 'Desert & Heritage', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600', highlight: 'Sam Sand Dunes camel safari and golden fort walks.' },
      { name: 'Rann of Kutch', state: 'Gujarat', category: 'Cultural Festival', image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=600', highlight: 'Full moon night on white salt desert.' },
      { name: 'Alleppey', state: 'Kerala', category: 'Backwaters', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600', highlight: 'Serene luxury houseboat backwater cruise.' }
    ]
  },
  'February': {
    month: 'February',
    seasonTag: 'Heritage Coast & Temple Fairs',
    icon: '🌴',
    seasonType: 'Winter',
    tempRange: '14°C - 28°C (Pleasant Breeze)',
    rainfall: 'Low',
    summary: 'Clear skies, mild sunshine, and cool evening coastal breezes. Great time for Dravidian temple circuits, Goa beach carnivals, and tiger safaris.',
    suggestedActivities: ['Goa Carnival Celebrations', 'Khajuraho Dance Festival', 'Bandhavgarh & Ranthambore Tiger Safaris', 'Munnar Tea Garden Treks'],
    travelTips: ['Perfect season for outdoor photography and wildlife sightings.'],
    recommendedStates: ['Kerala', 'Tamil Nadu', 'Goa', 'Madhya Pradesh', 'Karnataka'],
    recommendedUTs: ['Puducherry', 'Lakshadweep', 'Chandigarh'],
    sampleDestinations: [
      { name: 'Munnar', state: 'Kerala', category: 'Tea Plantations', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600', highlight: 'Lush green tea estate misty hills.' },
      { name: 'Mahabalipuram', state: 'Tamil Nadu', category: 'Coastal Heritage', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600', highlight: 'UNESCO Shore Temple ancient rock sculptures.' },
      { name: 'Bandhavgarh', state: 'Madhya Pradesh', category: 'Wildlife Safari', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=600', highlight: 'High tiger density jeep safaris.' }
    ]
  },
  'March': {
    month: 'March',
    seasonTag: 'Spring Blooms & Wildlife',
    icon: '🌿',
    seasonType: 'Spring',
    tempRange: '18°C - 30°C (Mild Spring)',
    rainfall: 'Minimal',
    summary: 'Spring arrives across India with colorful Holi celebrations, blooming rhododendrons in Sikkim, living root bridge treks in Meghalaya, and Kaziranga rhino safaris.',
    suggestedActivities: ['Mathura & Vrindavan Holi Celebrations', 'Kaziranga One-Horned Rhino Safari', 'Living Root Bridges Trek in Dawki', 'Gangtok Flower Show'],
    travelTips: ['Plan ahead for festival travel dates around Holi.'],
    recommendedStates: ['Meghalaya', 'Assam', 'Sikkim', 'Arunachal Pradesh', 'Uttarakhand'],
    recommendedUTs: ['Puducherry', 'Chandigarh'],
    sampleDestinations: [
      { name: 'Kaziranga', state: 'Assam', category: 'National Park', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=600', highlight: 'Elephant & Jeep safari to spot one-horned rhinos.' },
      { name: 'Cherrapunji', state: 'Meghalaya', category: 'Nature & Waterfalls', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600', highlight: 'Double Decker Living Root Bridge hiking trails.' }
    ]
  },
  'April': {
    month: 'April',
    seasonTag: 'Valley Blooms & Cool Escapes',
    icon: '🌷',
    seasonType: 'Spring',
    tempRange: '15°C - 32°C (Valley Spring)',
    rainfall: 'Moderate in Hills',
    summary: 'Asia’s largest Tulip festival opens in Srinagar Asia Gardens. Crisp mountain weather in Shimla, Manali, and Darjeeling as plains begin warming up.',
    suggestedActivities: ['Srinagar Indira Gandhi Tulip Garden', 'Shikara Rides on Dal Lake', 'Darjeeling Toy Train Heritage Ride', 'Rishikesh River Rafting'],
    travelTips: ['Himalayan valleys are at their peak floral beauty.'],
    recommendedStates: ['Himachal Pradesh', 'Uttarakhand', 'West Bengal', 'Sikkim'],
    recommendedUTs: ['Jammu & Kashmir', 'Chandigarh'],
    sampleDestinations: [
      { name: 'Srinagar', state: 'Jammu & Kashmir', category: 'Valley & Lakes', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=600', highlight: 'Asia Tulip Festival and wooden houseboats.' },
      { name: 'Shimla', state: 'Himachal Pradesh', category: 'Hill Station', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600', highlight: 'Mall Road strolling and Kufri pine forests.' }
    ]
  },
  'May': {
    month: 'May',
    seasonTag: 'High Passes & Himalayan Escapes',
    icon: '🏔️',
    seasonType: 'Summer',
    tempRange: '10°C - 25°C (High Altitude)',
    rainfall: 'Dry in High Passes',
    summary: 'High Himalayan passes clear of snow. Ideal retreat from summer heat into Mussoorie, Nainital, Ooty, Kodaikanal, and Chardham pilgrimage yatra.',
    suggestedActivities: ['Kedarnath & Badrinath Sacred Yatra', 'Rohtang Pass Snow Experience', 'Ooty Lake Boating & Botanical Gardens', 'Spiti Valley High Altitude Circuits'],
    travelTips: ['Book hill station hotels early as domestic summer school holidays start.'],
    recommendedStates: ['Himachal Pradesh', 'Uttarakhand', 'Sikkim', 'Tamil Nadu', 'Karnataka'],
    recommendedUTs: ['Ladakh', 'Jammu & Kashmir'],
    sampleDestinations: [
      { name: 'Mussoorie', state: 'Uttarakhand', category: 'Hill Retreat', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=600', highlight: 'Kempty Falls and Camel Back Road mountain vistas.' },
      { name: 'Ooty', state: 'Tamil Nadu', category: 'Nilgiri Hills', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600', highlight: 'Nilgiri Mountain Railway steam train ride.' }
    ]
  },
  'June': {
    month: 'June',
    seasonTag: 'High Altitude Treks & Cold Deserts',
    icon: '⛰️',
    seasonType: 'Summer',
    tempRange: '12°C - 28°C (Cold Himalayan)',
    rainfall: 'Low in Rain-shadow Regions',
    summary: 'Manali-Leh Highway opens! Experience the moonscapes of Ladakh, Pangong Tso crystal lake, Nubra Valley sand dunes, and Spiti valley monasteries.',
    suggestedActivities: ['Leh-Ladakh Motorbike Expedition', 'Pangong Tso & Khardung La Pass Visit', 'Spiti Valley Key Monastery Tour', 'Tawang Monastery Exploration'],
    travelTips: ['Acclimatize for 24-48 hours upon reaching Leh altitude (11,500 ft).'],
    recommendedStates: ['Himachal Pradesh', 'Arunachal Pradesh', 'Sikkim'],
    recommendedUTs: ['Ladakh', 'Jammu & Kashmir'],
    sampleDestinations: [
      { name: 'Leh & Pangong Lake', state: 'Ladakh', category: 'High Cold Desert', image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=600', highlight: 'Turquoise alpine lake surrounded by snow-capped peaks.' },
      { name: 'Spiti Valley', state: 'Himachal Pradesh', category: 'Trans-Himalayan', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600', highlight: 'Ancient Key Monastery perched on mountain cliff.' }
    ]
  },
  'July': {
    month: 'July',
    seasonTag: 'Monsoon Ghats & Waterfalls',
    icon: '🌧️',
    seasonType: 'Monsoon',
    tempRange: '22°C - 29°C (Fresh Rain)',
    rainfall: 'High Monsoon Rains',
    summary: 'The monsoon transforms Western Ghats into lush green wonderlands. Waterfalls roar at Dudhsagar, Coorg coffee hills mist up, and Valley of Flowers blooms.',
    suggestedActivities: ['Valley of Flowers Trek in Uttarakhand', 'Dudhsagar Waterfalls Train Safari', 'Lonavala & Khandala Monsoon Drives', 'Chikmagalur Coffee Estate Walks'],
    travelTips: ['Carry waterproof rain gear and sturdy non-slip trekking footwear.'],
    recommendedStates: ['Maharashtra', 'Goa', 'Karnataka', 'Uttarakhand', 'Kerala'],
    recommendedUTs: ['Dadra & Nagar Haveli and Daman & Diu'],
    sampleDestinations: [
      { name: 'Coorg', state: 'Karnataka', category: 'Coffee Hills & Rain', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600', highlight: 'Mist-shrouded coffee estates and Abbey Falls.' },
      { name: 'Valley of Flowers', state: 'Uttarakhand', category: 'Alpine Meadows', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=600', highlight: 'UNESCO endemic alpine flower blooms.' }
    ]
  },
  'August': {
    month: 'August',
    seasonTag: 'Rainforest Mist & Snake Boat Fairs',
    icon: '🚣',
    seasonType: 'Monsoon',
    tempRange: '23°C - 30°C (Lush Greenery)',
    rainfall: 'Heavy Rains',
    summary: 'Witness the iconic Nehru Trophy Snake Boat Race on Punnamada Lake, Meghalaya’s crystal clear rain pools, and Athirappilly waterfall cascades.',
    suggestedActivities: ['Alleppey Snake Boat Race Spectacle', 'Athirappilly "Niagara of India" Waterfalls', 'Shillong & Dawki Clean River Boating', 'Agumbe Rainforest Trek'],
    travelTips: ['Check landslide advisories in hilly monsoon regions.'],
    recommendedStates: ['Kerala', 'Meghalaya', 'Karnataka', 'Assam'],
    recommendedUTs: ['Puducherry', 'Dadra & Nagar Haveli and Daman & Diu'],
    sampleDestinations: [
      { name: 'Dawki & Mawlynnong', state: 'Meghalaya', category: 'Cleanest Village & River', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600', highlight: 'Crystal transparent Umngot River boat rides.' },
      { name: 'Athirappilly', state: 'Kerala', category: 'Waterfalls', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600', highlight: 'Roaring 80-foot waterfall amidst rainforest.' }
    ]
  },
  'September': {
    month: 'September',
    seasonTag: 'Post-Monsoon Verdant Vistas',
    icon: '🌄',
    seasonType: 'Post-Monsoon',
    tempRange: '20°C - 30°C (Clear Emerald Skies)',
    rainfall: 'Receding Monsoon',
    summary: 'The rain recedes leaving landscapes emerald green, rivers full, and air fresh and clear. Peak time for South & Northeast hill exploration before winter rush.',
    suggestedActivities: ['Wayanad & Chembra Peak Heart Lake Trek', 'Ganges River Rafting Season Kickoff in Rishikesh', 'Ziro Valley Music Festival in Arunachal', 'Hampi Boulder Ruins Walking Tour'],
    travelTips: ['Great shoulder season with fewer crowds and discount stay rates.'],
    recommendedStates: ['Kerala', 'Karnataka', 'Meghalaya', 'Sikkim', 'Arunachal Pradesh', 'Uttarakhand'],
    recommendedUTs: ['Puducherry', 'Andaman & Nicobar Islands'],
    sampleDestinations: [
      { name: 'Wayanad', state: 'Kerala', category: 'Verdant Hills', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600', highlight: 'Edakkal Caves and misty Chembra peak.' },
      { name: 'Hampi', state: 'Karnataka', category: 'UNESCO Heritage', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600', highlight: 'Ancient Vijayanagara boulder-strewn temples.' }
    ]
  },
  'October': {
    month: 'October',
    seasonTag: 'Festive Season & Golden Triangle',
    icon: '🪔',
    seasonType: 'Post-Monsoon',
    tempRange: '18°C - 31°C (Warm Sunshine)',
    rainfall: 'Low',
    summary: 'Durga Puja, Mysore Dasara, and Navratri festivities light up India! Golden Triangle tours (Delhi-Agra-Jaipur) open with comfortable autumn weather.',
    suggestedActivities: ['Kolkata Durga Puja Pandal Hopping', 'Mysore Palace Lighting Spectacle', 'Taj Mahal Sunrise View in Agra', 'Udaipur City Palace & Lake Pichola'],
    travelTips: ['Check festival dates to experience grand Indian cultural traditions.'],
    recommendedStates: ['Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Karnataka', 'Gujarat'],
    recommendedUTs: ['Delhi', 'Chandigarh', 'Puducherry'],
    sampleDestinations: [
      { name: 'Jaipur', state: 'Rajasthan', category: 'Golden Triangle', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600', highlight: 'Amber Fort lighting and Hawa Mahal palace.' },
      { name: 'Agra', state: 'Uttar Pradesh', category: 'Mughal Heritage', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600', highlight: 'Iconic marble Taj Mahal sunrise tour.' }
    ]
  },
  'November': {
    month: 'November',
    seasonTag: 'Beach Sunsets & Heritage Fairs',
    icon: '🏰',
    seasonType: 'Winter',
    tempRange: '15°C - 28°C (Pleasant Winter)',
    rainfall: 'Dry',
    summary: 'Pushkar Camel Fair brings desert color. Sunny beach season opens in Goa, Kovalam, and Gokarna. Perfect climate for Central India tiger parks.',
    suggestedActivities: ['Pushkar International Camel Fair', 'Goa Sunset Beach Parties & Water Sports', 'Kanha & Pench National Park Safaris', 'Varanasi Dev Deepawali Festival'],
    travelTips: ['Ideal month for multi-state cultural road trips.'],
    recommendedStates: ['Goa', 'Rajasthan', 'Madhya Pradesh', 'Kerala', 'Uttar Pradesh'],
    recommendedUTs: ['Andaman & Nicobar Islands', 'Puducherry', 'Delhi'],
    sampleDestinations: [
      { name: 'Goa', state: 'Goa', category: 'Beach & Coastal', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600', highlight: 'Baga beach water sports and sunset shacks.' },
      { name: 'Varanasi', state: 'Uttar Pradesh', category: 'Spiritual Heritage', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600', highlight: 'Ganga Aarti ceremony on ghats at sunset.' }
    ]
  },
  'December': {
    month: 'December',
    seasonTag: 'Winter Carnival & Island Sun',
    icon: '🎉',
    seasonType: 'Winter',
    tempRange: '8°C - 25°C (Cool & Festive)',
    rainfall: 'Dry',
    summary: 'Peak holiday season! Scuba dive crystal coral reefs in Havelock Andaman, celebrate New Year on Goa beaches, or experience snow sports in Auli & Manali.',
    suggestedActivities: ['Havelock Radhanagar Beach Scuba Diving', 'Auli & Solang Valley Snowboard Skiing', 'Goa Sunburn & New Year Festivities', 'Kochi Muziris Biennale Art Walk'],
    travelTips: ['Highest travel demand of the year; advance flight & hotel booking mandatory.'],
    recommendedStates: ['Goa', 'Kerala', 'Himachal Pradesh', 'Uttarakhand', 'Rajasthan'],
    recommendedUTs: ['Andaman & Nicobar Islands', 'Lakshadweep', 'Puducherry', 'Ladakh'],
    sampleDestinations: [
      { name: 'Havelock Island', state: 'Andaman & Nicobar Islands', category: 'Tropical Island', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600', highlight: 'Radhanagar white sand beach & coral reefs.' },
      { name: 'Auli', state: 'Uttarakhand', category: 'Snow & Ski Resort', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=600', highlight: 'Himalayan ski slopes and cable car rides.' }
    ]
  }
};

const SmartCalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const realWorldMonth = useMemo(() => new Date().toLocaleString('default', { month: 'long' }), []);
  const [selectedMonth, setSelectedMonth] = useState<string>(realWorldMonth);

  const currentDetail = useMemo(() => {
    return MONTH_DETAILS_MAP[selectedMonth] || MONTH_DETAILS_MAP['January'];
  }, [selectedMonth]);

  // Map state names to RegionData objects
  const matchingStateObjs = useMemo(() => {
    return INDIA_STATES_AND_UTS.filter(r => r.type === 'State' && currentDetail.recommendedStates.includes(r.name));
  }, [currentDetail]);

  // Map UT names to RegionData objects
  const matchingUtObjs = useMemo(() => {
    return INDIA_STATES_AND_UTS.filter(r => r.type === 'Union Territory' && currentDetail.recommendedUTs.includes(r.name));
  }, [currentDetail]);

  const handleNextMonth = () => {
    const idx = monthsList.indexOf(selectedMonth);
    const nextIdx = (idx + 1) % monthsList.length;
    setSelectedMonth(monthsList[nextIdx]);
  };

  const handlePrevMonth = () => {
    const idx = monthsList.indexOf(selectedMonth);
    const prevIdx = (idx - 1 + monthsList.length) % monthsList.length;
    setSelectedMonth(monthsList[prevIdx]);
  };

  const getSeasonBadgeStyle = (type: MonthDetail['seasonType']) => {
    switch (type) {
      case 'Winter': return { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
      case 'Spring': return { bg: '#fce7f3', color: '#be185d', border: '#fbcfe8' };
      case 'Summer': return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'Monsoon': return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
      case 'Post-Monsoon': return { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' };
    }
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
              MONTH-BY-MONTH SEASONAL GUIDE
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>12 Months India Calendar</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            Smart Months <span style={{ color: '#dc2626' }}>Travel Calendar</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '850px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            Select any month from January to December to dynamically explore the best Indian states, Union Territories, weather conditions, top recommended destinations, and ideal travel experiences.
          </p>

          {/* Interactive Month Selection Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '10px',
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            {monthsList.map(m => {
              const active = selectedMonth === m;
              const detail = MONTH_DETAILS_MAP[m];
              const badgeStyle = getSeasonBadgeStyle(detail.seasonType);
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '10px',
                    border: active ? '2px solid #dc2626' : '1px solid #cbd5e1',
                    backgroundColor: active ? '#fee2e2' : '#ffffff',
                    color: active ? '#dc2626' : '#475569',
                    fontWeight: active ? 900 : 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 4px 12px rgba(220, 38, 38, 0.25)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{detail.icon}</span>
                  <span>{m}</span>
                  <span style={{
                    fontSize: '0.62rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    backgroundColor: badgeStyle.bg,
                    color: badgeStyle.color,
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    {detail.seasonType}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Selected Month Dynamic Dashboard Panel */}
      <section style={{ marginTop: '32px' }}>
        <div className="full-width-container">
          
          {/* Month Header Banner with Controls */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #fca5a5',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 8px 30px rgba(220, 38, 38, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  fontSize: '2.5rem',
                  backgroundColor: '#fee2e2',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {currentDetail.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{currentDetail.month} Travel Guide</h2>
                    <span style={{
                      backgroundColor: getSeasonBadgeStyle(currentDetail.seasonType).bg,
                      color: getSeasonBadgeStyle(currentDetail.seasonType).color,
                      border: `1px solid ${getSeasonBadgeStyle(currentDetail.seasonType).border}`,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 800
                    }}>
                      {currentDetail.seasonType} • {currentDetail.seasonTag}
                    </span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.98rem', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                    {currentDetail.summary}
                  </p>
                </div>
              </div>

              {/* Prev / Next Month Nav */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handlePrevMonth}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft size={16} /> Prev Month
                </button>
                <button
                  onClick={handleNextMonth}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Next Month <ArrowRight size={16} />
                </button>
              </div>

            </div>

            {/* Weather & Travel Overview Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '16px',
              borderRadius: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TEMPERATURE EXPECTATION</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{currentDetail.tempRange}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>RAINFALL / MONSOON IMPACT</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{currentDetail.rainfall}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TRAVEL ADVISORY TIP</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#475569', fontSize: '0.88rem' }}>{currentDetail.travelTips[0]}</p>
              </div>
            </div>
          </div>

          {/* Section 1: Best States & Union Territories to visit in this month */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass style={{ color: '#dc2626' }} size={24} /> Best Indian States to Visit in {selectedMonth} ({matchingStateObjs.length})
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {matchingStateObjs.map(state => (
                <div
                  key={state.id}
                  className="glass-card"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <img src={state.coverImage} alt={state.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 4px 0', color: '#0f172a' }}>{state.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>Capital: {state.capital}</span>
                    <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {state.description}
                    </p>
                    <button
                      onClick={() => navigate(`/states?state=${state.id}`)}
                      style={{
                        marginTop: 'auto',
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fca5a5',
                        color: '#991b1b',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      Explore {state.name} <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Best Union Territories in this month */}
          {matchingUtObjs.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass style={{ color: '#dc2626' }} size={24} /> Best Union Territories for {selectedMonth} ({matchingUtObjs.length})
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '20px'
              }}>
                {matchingUtObjs.map(ut => (
                  <div
                    key={ut.id}
                    className="glass-card"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <img src={ut.coverImage} alt={ut.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 4px 0', color: '#0f172a' }}>{ut.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>Capital: {ut.capital}</span>
                      <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ut.description}
                      </p>
                      <button
                        onClick={() => navigate(`/union-territories?ut=${ut.id}`)}
                        style={{
                          marginTop: 'auto',
                          backgroundColor: '#fee2e2',
                          border: '1px solid #fca5a5',
                          color: '#991b1b',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          padding: '8px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        Explore {ut.name} <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Recommended Destinations & Suitable Experiences */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            
            {/* Suitable Activities Checklist */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0' }}>
                Suitable Experiences for {selectedMonth}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentDetail.suggestedActivities.map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px', borderRadius: '50%', display: 'flex', marginTop: '2px' }}>
                      <Check size={14} />
                    </div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Considerations */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0' }}>
                Important Travel Considerations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentDetail.travelTips.map((tip, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '4px', borderRadius: '50%', display: 'flex', marginTop: '2px' }}>
                      <ShieldAlert size={14} />
                    </div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Big CTA Banner linking to Adventure Builder */}
          <div style={{
            backgroundColor: '#dc2626',
            backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: '#ffffff',
            padding: '32px 24px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, backgroundColor: '#ffffff', color: '#991b1b', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                INSTANT TRIP ORCHESTRATION
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '8px 0 4px 0', color: '#ffffff' }}>
                Plan your {selectedMonth} vacation in Adventure Builder
              </h3>
              <p style={{ margin: 0, fontWeight: 700, opacity: 0.9, fontSize: '0.95rem', color: '#fee2e2' }}>
                Pre-configured for {selectedMonth}'s optimal weather, states, and activities.
              </p>
            </div>

            <button
              onClick={() => navigate(`/create-trip?month=${selectedMonth}`)}
              style={{
                backgroundColor: '#ffffff',
                color: '#dc2626',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              <Sparkles size={20} style={{ color: '#dc2626' }} /> Launch {selectedMonth} Trip Planner
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default SmartCalendarPage;
