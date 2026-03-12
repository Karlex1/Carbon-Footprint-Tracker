import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "./AuthContext";
import { useLanguage } from './LangContext';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  Bar, YAxis, XAxis, CartesianGrid, BarChart
} from "recharts";
import IntroPopup from "./IntroPopup";

const THEME = {
  bg: '#f7f9f7',
  forest: '#12882b',
  danger: '#dc2626',
  leaf: '#10b981',
  mist: '#e2e8f0',
  white: '#ffffff',
  text: '#1a2e1a',
  subtext: '#64748b',
  chart: ['#1b5e20', '#2e7d32', '#4caf50', '#8bc34a', '#aed581']
};

const CustomTooltip = ({ active, payload, label, isBar, lang }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '10px 14px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontSize: '0.85rem',
        border: '1px solid #c8e6c9'
      }}>
        <p style={{ margin: 0, fontWeight: 700, color: THEME.text }}>
          {isBar
            ? new Date(label).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', day: 'numeric' })
            : payload[0].name}
        </p>
        <p style={{ margin: '2px 0 0', color: THEME.subtext, fontSize: '0.75rem' }}>
          {isBar ? (lang === 'hi' ? 'मासिक एमिशन' : 'Monthly Emission') : ''}
        </p>
        <p style={{ margin: '2px 0 0', color: THEME.forest, fontWeight: 800 }}>
          {payload[0].value.toFixed(1)} kg CO₂
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { lang } = useLanguage();
  const { token, isTokenValid, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const t = {
    en: {
      title: "Nature Impact",
      sub: "Monthly overview",
      monthly: "Current Cycle",
      offset: "Nature Balance",
      breakdown: "Emission Breakdown",
      history: "Emission History",
      action: "Eco Tips ✨",
      commit: "Try",
      trees: (n) => `${n} trees needed.`,
      higher: "higher",
      lower: "lower",
      loading: "Analyzing your impact..."
    },
    hi: {
      title: "प्रकृति प्रभाव",
      sub: "मासिक विवरण",
      monthly: "वर्तमान चक्र",
      offset: "प्रकृति संतुलन",
      breakdown: "एमिशन विवरण",
      history: "एमिशन इतिहास",
      action: "इको टिप्स ✨",
      commit: "कोशिश",
      trees: (n) => `${n} पेड़ चाहिए।`,
      higher: "अधिक",
      lower: "कम",
      loading: "प्रभाव का विश्लेषण..."
    }
  }[lang || 'en'];

  const handleCommit = async (tip) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/commitment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          category: tip.category,
          replacement: tip.replacement,
          potential_saving: tip.potential_saving
        })
      });
      if (res.ok) {
        alert(lang === 'hi' ? `लक्ष्य निर्धारित: ${tip.replacement}!` : `Goal Set: ${tip.replacement}!`);
      }
    } catch (e) {
      console.error("Commit error:", e);
    }
  };

  useEffect(() => {
    if (!token || !isTokenValid(token)) { logout(); navigate('/login'); return; }

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + token };
        const [histRes, sugRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/gethistory`, { method: "POST", headers }),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/suggestionengine`, { method: "POST", headers })
        ]);

        const history = await histRes.json();
        const suggestions = await sugRes.json();
        const historyArray = Array.isArray(history) ? history : [];
        setData(historyArray);
        setSuggestion(Array.isArray(suggestions) ? suggestions : []);

        // Logic to show IntroPopup if it's a first-time user (no history) and hasn't seen it this session
        const hasSeenIntro = sessionStorage.getItem('introSeen');
        if (historyArray.length === 0 && !hasSeenIntro) {
          setShowIntro(true);
        }

        if (historyArray.length > 0 && historyArray[0].value) {
          const v = historyArray[0].value;
          // Weights for specific categories
          const fuelWeights = { diesel: 0.25, petrol: 0.22, cng: 0.15, electric: 0.05 };
          const flightWeights = { 'very frequently': 250, frequently: 150, rarely: 50, never: 0 };
          const modeWeights = { private: 1.5, public: 0.7, 'walk/bicycle': 0 };
          const dietWeights = { omnivore: 50, pescatarian: 30, vegetarian: 20, vegan: 10 };
          const bodyWeights = { obese: 20, overweight: 15, normal: 10, underweight: 5 };
          const bagSizeWeights = { 'extra large': 15, large: 10, medium: 7, small: 4 };
          const efficiencyWeights = { No: 1.5, Sometimes: 1.0, Yes: 0.6 };
          const socialWeights = { often: 20, sometimes: 10, never: 0 };

          const transportScore = (Number(v.vehicle_distance_km) * (fuelWeights[v.vehicle_fuel_type] || 0.2) * (modeWeights[v.transport_mode] || 1)) + (flightWeights[v.air_travel_frequency] || 0);
          const nutritionScore = (Number(v.monthly_grocery_bill) * 0.01) + (dietWeights[v.diet_type] || 25) + (bodyWeights[v.body_type] || 10) + (Number(v.cooking_count) * 2);
          const wasteScore = (Number(v.waste_bag_count) * (bagSizeWeights[v.waste_bag_size] || 5)) - (Number(v.recycling_count) * 3);
          const digitalScore = (Number(v.tv_pc_hours_daily) + Number(v.internet_hours_daily)) * (efficiencyWeights[v.energy_efficiency_level] || 1.0) * 0.8;
          const lifestyleScore = (Number(v.new_clothes_monthly) * 12) + (socialWeights[v.social_activity_level] || 5);

          const finalBreakdown = [
            { name: 'Transport', value: Math.max(0, transportScore) },
            { name: 'Nutrition', value: Math.max(0, nutritionScore) },
            { name: 'Waste', value: Math.max(0, wasteScore) },
            { name: 'Digital', value: Math.max(0, digitalScore) },
            { name: 'Lifestyle', value: Math.max(0, lifestyleScore) }
          ].map(item => ({ ...item, value: parseFloat(item.value.toFixed(1)) }));
          setChartData(finalBreakdown);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchAllData();
  }, [token, isTokenValid, logout, navigate]);

  const handleCloseIntro = () => {
    setShowIntro(false);
    sessionStorage.setItem('introSeen', 'true');
  };

  if (loading) return (
    <div style={{ ...pageWrapper, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: THEME.forest, fontWeight: 700 }}>
      {t.loading}
    </div>
  );

  const currentEm = data.length > 0 ? (data[0].monthly_totalemission || 0) : 0;
  const prevEm = data.length > 1 ? (data[1].monthly_totalemission || 0) : null;
  let isHigher = prevEm !== null && currentEm > prevEm;
  let diffPercent = prevEm ? Math.abs(((currentEm - prevEm) / prevEm) * 100).toFixed(0) : 0;

  return (
    <div style={{ ...pageWrapper, padding: isMobile ? '15px 12px' : '40px 6%' }}>

      <IntroPopup open={showIntro} onClose={handleCloseIntro} />

      <header style={{ textAlign: 'center', marginBottom: isMobile ? '15px' : '30px' }}>
        <h1 style={{ ...logoStyle, fontSize: isMobile ? '1.5rem' : '2.2rem' }}>{t.title}</h1>
      </header>

      <div style={{ ...grid, display: isMobile ? 'flex' : 'grid', flexDirection: 'column', gap: isMobile ? '12px' : '20px' }}>

        {/* Metric Cards Row */}
        <div style={{ display: 'flex', gap: '12px', gridColumn: 'span 12' }}>
          <div style={{ ...card, flex: 1, padding: isMobile ? '16px' : '24px' }}>
            <label style={labelStyle}>{t.monthly}</label>
            <div style={{ ...bigNumber, fontSize: isMobile ? '1.8rem' : '3rem' }}>{currentEm.toFixed(0)} <small style={{ fontSize: '0.8rem' }}>kg</small></div>
            {prevEm && (
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isHigher ? THEME.danger : THEME.leaf }}>
                {isHigher ? '↑' : '↓'} {diffPercent}% {isHigher ? t.higher : t.lower}
              </div>
            )}
          </div>
          <div style={{ ...card, flex: 1.2, background: THEME.forest, color: 'white', border: 'none', padding: isMobile ? '16px' : '24px' }}>
            <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.7)' }}>{t.offset}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
              <span style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>🌳</span>
              <div style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 600 }}>{t.trees((currentEm / 1.75).toFixed(1))}</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ ...card, gridColumn: 'span 6', height: isMobile ? '320px' : '480px', padding: isMobile ? '16px' : '24px' }}>
          <h4 style={cardTitleStyle}>{t.breakdown}</h4>
          <div style={{ height: isMobile ? '220px' : '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={isMobile ? 55 : 85} outerRadius={isMobile ? 75 : 115} dataKey="value" stroke="none" paddingAngle={2}>
                  {chartData.map((_, i) => <Cell key={i} fill={THEME.chart[i % THEME.chart.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip isBar={false} lang={lang} />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...card, gridColumn: 'span 6', height: isMobile ? '280px' : '480px', padding: isMobile ? '16px' : '24px' }}>
          <h4 style={cardTitleStyle}>{t.history}</h4>
          <div style={{ height: isMobile ? '180px' : '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...data].reverse().slice(-5)}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke={THEME.mist} />
                <XAxis
                  dataKey="createdAt"
                  hide={isMobile}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => new Date(v).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', day: 'numeric' })}
                />
                <YAxis axisLine={false} tickLine={false} width={25} fontSize={10} />
                <Tooltip cursor={{ fill: '#f1f8e9' }} content={<CustomTooltip isBar={true} lang={lang} />} />
                <Bar dataKey="monthly_totalemission" fill={THEME.forest} radius={[4, 4, 0, 0]} barSize={isMobile ? 20 : 40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suggestion Cards */}
        <div style={{ gridColumn: 'span 12' }}>
          <h2 style={{ color: THEME.forest, fontSize: '1.2rem', marginBottom: '15px' }}>{t.action}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
            {suggestion.slice(0, 3).map((item, i) => (
              <div key={i} style={{ ...card, padding: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.2 }}>{item.tip}</h5>
                  <p style={{ margin: '4px 0', fontSize: '0.75rem', color: THEME.subtext }}>-{item.potential_saving}kg CO₂</p>
                </div>
                <button
                  onClick={() => handleCommit(item)}
                  style={{ ...commitBtn, marginTop: 0, padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  {t.commit}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const pageWrapper = { background: THEME.bg, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', maxWidth: '1400px', margin: '0 auto' };
const logoStyle = { color: THEME.forest, margin: 0, fontWeight: 800 };
const card = { background: THEME.white, borderRadius: '20px', border: `1px solid #eef2ee`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const labelStyle = { textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 800, color: THEME.subtext, letterSpacing: '0.5px' };
const bigNumber = { fontWeight: 900, color: THEME.forest };
const cardTitleStyle = { textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: THEME.text, marginBottom: '10px' };
const commitBtn = { background: THEME.forest, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s', ':active': { opacity: 0.8 } };

export default Dashboard;