import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "./AuthContext";
import { useLanguage } from './LangContext';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  Bar, YAxis, XAxis, CartesianGrid, BarChart
} from "recharts";
import IntroPopup from "./IntroPopup";
import { Box, Grid, Skeleton } from "@mui/material";

const THEME = {
  bg: '#f7f9f7',
  forest: '#1b5e20',
  danger: '#d32f2f',
  leaf: '#4caf50',
  white: '#ffffff',
  text: '#1a2e1a',
  subtext: '#666666',
  accent: '#fbbf24',
  chart: ['#1b5e20', '#2e7d32', '#4caf50', '#8bc34a', '#aed581']
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
  const [achievements, setAchievements] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showIntro, setShowIntro] = useState(false);

  const t = useMemo(() => ({
    en: {
      title: "Nature Impact Dashboard",
      monthly: "Monthly Footprint",
      offset: "Nature Balance",
      hint:"Uses a trained Multi-Layer Perceptron (MLP) model with high prediction accuracy",
      info:"🌱 Your results are personalized using AI trained on real-world lifestyle data",
      breakdown: "What impacts your footprint",
      bt: "Calculated using your lifestyle patterns",
      history: "Your footprint trend",
      hisML:"Based on your past predictions",
      action: "Smart suggestions ✨",
      actionSub: "Based on your habits, try this one step lower:",
      commit: "I'm In!",
      trees: (n) => `${n} trees needed to offset.`,
      loading: "Analyzing your lifestyle patterns...",
      newAch: "New Achievement",
      higher: "higher",
      lower: "lower",
      congrats: "You're a Nature Hero!",
      congratsSub: "Your current lifestyle is highly sustainable. You've cleared all major suggestions!",
      noData: "Complete a survey to see your data!"
    },
    hi: {
      title: "प्रकृति प्रभाव डैशबोर्ड",
      monthly: "मासिक फुटप्रिंट",
      offset: "प्रकृति संतुलन",
      hint:"उच्च पूर्वानुमान सटीकता वाले एक प्रशिक्षित मल्टी-लेयर परसेप्ट्रॉन (MLP) मॉडल का उपयोग करता है।",
      info:"🌱 आपके परिणाम AI का उपयोग करके पर्सनलाइज़ किए गए हैं, जिसे वास्तविक जीवनशैली डेटा पर प्रशिक्षित किया गया है।",
      breakdown: "आपके फ़ुटप्रिंट पर क्या असर डालता है?",
      bt:"आपकी जीवनशैली के पैटर्न के आधार पर गणना की गई",
      history: "आपके फ़ुटप्रिंट का रुझान",
      hisML:"आपकी पिछली भविष्यवाणियों के आधार पर",
      action: "स्मार्ट सुझाव ✨",
      actionSub: "आपकी आदतों के आधार पर, यह छोटा कदम उठाएं:",
      commit: "स्वीकारें",
      trees: (n) => `ऑफसेट के लिए ${n} पेड़ चाहिए।`,
      loading: "आपकी जीवनशैली के पैटर्न का विश्लेषण किया जा रहा है...",
      newAch: "नई उपलब्धि",
      higher: "अधिक",
      lower: "कम",
      congrats: "आप प्रकृति नायक हैं!",
      congratsSub: "आपकी जीवनशैली बहुत टिकाऊ है। आपने सभी प्रमुख सुझाव पूरे कर लिए हैं!",
      noData: "डेटा देखने के लिए सर्वे पूरा करें!"
    }
  })[lang || 'en'], [lang]);

  // Dynamic Icon Mapping for all 17 Features
  const getIcon = (cat) => {
    const maps = {
      diet_type: '🥗',
      transport_mode: '🚲',
      vehicle_fuel_type: '⛽',
      energy_efficiency_level: '💡',
      air_travel_frequency: '✈️',
      waste_bag_count: '🗑️',
      recycling_count: '♻️',
      cooking_methods: '🍳',
      tv_pc_hours_daily: '💻',
      internet_hours_daily: '🌐',
      new_clothes_monthly: '👕',
      monthly_grocery_bill: '🛒',
      vehicle_distance_km: '📍',
      body_type: '🧘',
      gender: '👤'
    };
    return maps[cat] || '🌱';
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    if (location.state?.achievements) {
      setAchievements(location.state.achievements);
      window.history.replaceState({}, document.title);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [location.state]);

  useEffect(() => {
    if (!token || !isTokenValid(token)) { logout(); navigate('/login'); return; }

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "Accept-Language": lang // Pass language to backend
        };
        const [histRes, sugRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/gethistory`, { method: "POST", headers }),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/suggestionengine`, { method: "POST", headers })
        ]);

        const history = await histRes.json();
        const suggestions = await sugRes.json();
        const historyArray = Array.isArray(history) ? history : [];

        setData(historyArray);
        setSuggestion(Array.isArray(suggestions) ? suggestions : []);

        if (historyArray.length === 0 && !sessionStorage.getItem('introSeen')) {
          setShowIntro(true);
        }

        if (historyArray.length > 0 && historyArray[0].value) {
          const v = historyArray[0].value;
          // Simple visualization weights
          const transport = (Number(v.vehicle_distance_km || 0) * 0.2) + (v.air_travel_frequency === 'frequently' ? 100 : 0);
          const nutrition = (Number(v.monthly_grocery_bill || 0) * 0.01);
          const waste = (Number(v.waste_bag_count || 0) * 5);
          const digital = (Number(v.tv_pc_hours_daily || 0) + Number(v.internet_hours_daily || 0)) * 0.5;

          setChartData([
            { name: 'Transport', value: Math.max(1, transport) },
            { name: 'Nutrition', value: Math.max(1, nutrition) },
            { name: 'Waste', value: Math.max(1, waste) },
            { name: 'Digital', value: Math.max(1, digital) }
          ].map(item => ({ ...item, value: parseFloat(item.value.toFixed(1)) })));
        }
      } catch (e) {
        console.error("Dashboard Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [token, navigate, logout, isTokenValid, lang]);

  const handleCommit = async (tip) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/commitment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(tip)
      });
      if (res.ok) alert(lang === 'hi' ? "लक्ष्य निर्धारित!" : "Goal Committed!");
    } catch (e) { console.error(e); }
  };
  const handleStartSurvey = () => { // ⭐ NEW
    sessionStorage.setItem('introSeen', 'true');
    navigate('/questionnaire'); 
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
  if (loading) return (
    <Box sx={{ padding: isMobile ? '15px 12px' : '40px 6%', minHeight: '100vh' }}>
      <Skeleton variant="text" width="40%" height={60} sx={{ mx: 'auto', mb: 4, bgcolor: 'rgba(138, 237, 52, 0.2)' }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: '24px', bgcolor: 'rgba(222, 255, 184, 0.2)' }} /></Grid>
        <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: '24px', bgcolor: 'rgba(188, 80, 80, 0.2)' }} /></Grid>
        <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={350} sx={{ borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.2)' }} /></Grid>
        <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={350} sx={{ borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.2)' }} /></Grid>
      </Grid>
    </Box>
  );

  const currentEm = data.length > 0 ? (data[0].monthly_totalemission || 0) : 0;
  const prevEm = data.length > 1 ? (data[1].monthly_totalemission || 0) : null;
  const isHigher = prevEm !== null && currentEm > prevEm;
  const diffPercent = prevEm ? Math.abs(((currentEm - prevEm) / prevEm) * 100).toFixed(0) : 0;

  return (
    <div style={{ ...pageWrapper, padding: isMobile ? '15px 12px' : '40px 6%' }}>
      <IntroPopup open={showIntro} onClose={() => { setShowIntro(false); sessionStorage.setItem('introSeen', 'true'); }} onStart = { handleStartSurvey }  />

      {/* ACHIEVEMENT BANNER */}
      {achievements && (
        <div style={achievementBanner}>
          <div style={{ fontSize: '2.5rem' }}>🏅</div>
          <div style={{ flex: 1 }}>
            <h4 style={bannerSub}>{t.newAch}</h4>
            <h2 style={bannerTitle}>{achievements.achievement_name || "Eco Hero"}</h2>
            <p style={bannerText}>{achievements.message}</p>
          </div>
          <button onClick={() => setAchievements(null)} style={closeBtn}>✕</button>
        </div>
      )}

      <header style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '40px' }}>
        <h1 style={logoStyle}>{t.title}</h1>
      </header>

      <div style={gridContainer}>
        {/* KPI SECTION */}
        <div style={kpiRow}>
          <div style={{ ...card, flex: 1, padding: '20px' }}>
            <label style={labelStyle}>{t.monthly}</label>
            <div style={bigNumber}>{currentEm.toFixed(0)} <small style={{ fontSize: '0.9rem' }}>kg</small></div>
            {prevEm && (
              <div style={{ color: isHigher ? THEME.danger : THEME.leaf, fontWeight: 700, fontSize: '0.85rem' }}>
                {isHigher ? '↑' : '↓'} {diffPercent}% {isHigher ? t.higher : t.lower}
              </div>
            )}
          </div>
          <div style={{ ...card, flex: 1.2, background: THEME.forest, color: 'white', border: 'none', padding: '20px' }}>
            <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.7)' }}>{t.offset}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <span style={{ fontSize: '2.2rem' }}>🌳</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t.trees((currentEm / 1.75).toFixed(1))}</div>
            </div>
          </div>
        </div>

        <div style={{
          ...card,
          padding: '16px',
          marginTop: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.9rem', color: THEME.text }}>
            {t.info}
          </div>

          {/* 👇 Recruiter Hint (Tooltip) */}
          <span
            title={t.hint}
            style={{ cursor: 'help', fontSize: '0.9rem', color: THEME.subtext }}
          >
            ⓘ
          </span>
        </div>
        {/* CHARTS SECTION */}
        <div style={chartGrid(isMobile)}>
          <div style={{ ...card, padding: '24px' }}>
            <h4 style={cardTitleStyle}>
              {t.breakdown}
              <span title={t.bt} style={{ marginLeft: 6, cursor: 'help' }}>ⓘ</span>
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={chartData} innerRadius={isMobile ? 60 : 80} outerRadius={isMobile ? 80 : 100} dataKey="value" stroke="none" paddingAngle={5}>
                  {chartData.map((_, i) => <Cell key={i} fill={THEME.chart[i % THEME.chart.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...card, padding: '24px' }}>
            <h4 style={cardTitleStyle}>
              {t.history}
              <span title={t.hisML} style={{ marginLeft: 6, cursor: 'help' }}>ⓘ</span>
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[...data].reverse().slice(-5)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="createdAt" hide />
                <YAxis width={30} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#f1f8e9' }} content={<CustomTooltip isBar={true} lang={lang} />} />
                <Bar dataKey="monthly_totalemission" fill={THEME.forest} radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* HUMANIZED COACHING SECTION */}
        <div style={{ width: '100%', marginTop: '40px' }}>
          <h2 style={{ color: THEME.forest, fontSize: '1.4rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {t.action}
          </h2>

          {suggestion.length > 0 ? (
            <>
              <p style={{ color: THEME.subtext, fontSize: '0.9rem', margin: '0 0 20px' }}>{t.actionSub}</p>
              <div style={suggestionGrid(isMobile)}>
                {suggestion.map((item, i) => (
                  <div key={i} style={suggestionCard}>
                    <div style={{ fontSize: '2rem', background: '#f0fdf4', padding: '10px', borderRadius: '15px' }}>
                      {getIcon(item.category)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: THEME.text, lineHeight: 1.4 }}>
                        {item.tip}
                      </h5>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
                          -{item.potential_saving}kg CO₂
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleCommit(item)} style={commitBtn}>{t.commit}</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={congratsBox}>
              <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🌟</div>
              <h3 style={{ color: THEME.forest, margin: '0 0 10px', fontWeight: 800 }}>{t.congrats}</h3>
              <p style={{ color: THEME.subtext, maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>{t.congratsSub}</p>
            </div>
          )}
        </div>
      </div>

      {isMobile && <div style={{ height: 80 }} />}
    </div>
  );
};

// Styles (mostly preserved, updated suggestion card layout)
const pageWrapper = { minHeight: '100vh', fontFamily: 'system-ui, sans-serif' };
const gridContainer = { display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto' };
const logoStyle = { color: THEME.forest, fontWeight: 900, margin: 0 };
const card = {
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #edf2ed' };
const labelStyle = { textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 800, color: THEME.subtext, letterSpacing: '0.5px' };
const bigNumber = { fontSize: '2.8rem', fontWeight: 900, color: THEME.text, margin: '5px 0' };
const cardTitleStyle = { textAlign: 'center', marginBottom: '15px', fontWeight: 700, color: THEME.text };
const kpiRow = { display: 'flex', gap: '15px', width: '100%', marginBottom: '20px' };
const chartGrid = (isMobile) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', width: '100%' });
const suggestionGrid = (isMobile) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr', gap: '15px' }); // Stacked for better readability of long tips
const suggestionCard = { ...card, padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' };
const commitBtn = { background: THEME.forest, color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', transition: 'transform 0.2s' };
// const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: THEME.forest, fontWeight: 800 };
const congratsBox = { ...card, padding: '50px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: `2px dashed ${THEME.leaf}` };
const achievementBanner = { background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '20px', padding: '16px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' };
const bannerSub = { margin: 0, color: '#92400e', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' };
const bannerTitle = { margin: '2px 0', color: '#78350f', fontSize: '1.2rem' };
const bannerText = { margin: 0, fontSize: '0.9rem', color: '#b45309' };
const closeBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#b45309' };

export default Dashboard;