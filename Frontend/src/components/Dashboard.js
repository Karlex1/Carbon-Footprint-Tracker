import { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { AuthContext } from "./AuthContext";
import {
  Box, CircularProgress, Container, Grid,
  Paper, Typography, Alert, Divider,
  Collapse,
  Button
} from "@mui/material";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  Bar, YAxis, XAxis, CartesianGrid, BarChart
} from "recharts";


const CustomTooltip = ({ active, payload, label, isBar }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          border: "1px solid #c8e6c9",
          backgroundColor: "rgba(255, 255, 255, 0.96)",
        }}
      >
        <Typography variant="caption" fontWeight="700" color="text.secondary">
          {isBar
            ? new Date(label).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
            : payload[0].name}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" fontWeight="800" color="#1b5e20">
          {payload[0].value.toFixed(2)} <small>kg CO₂</small>
        </Typography>
      </Paper>
    );
  }
  return null;
};

function Dashboard() {
  const [data, setData] = useState([]);
  const [suggestion, setsuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartdata, setChartData] = useState([]);
  const [achievements, setAchievements] = useState(null);
  const COLORS = ['#1b5e20', '#2e7d32', '#4caf50', '#8bc34a', '#aed581'];
  const location = useLocation();

  const { token, isTokenValid, logout } = useContext(AuthContext);
  useEffect(() => {
    if (location.state?.achievements) {
      setAchievements(location.state.achievements);
  }
},[location])
  useEffect(() => {
    if (token && !isTokenValid(token)) {
      logout();
    }
  }, [token, isTokenValid, logout]);
  useEffect(() => {
    if (token && !isTokenValid(token)) {
      logout();
    }
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        };

        const [histRes, sugRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/gethistory`, { method: "POST", headers }),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/suggestionengine`, { method: "POST", headers })
        ]);

        const history = await histRes.json();
        const suggestions = await sugRes.json();
        const historyArray = Array.isArray(history) ? history : [];
        setData(historyArray);
        setsuggestion(Array.isArray(suggestions) ? suggestions : []);

        if (historyArray.length > 0 && historyArray[0].value) {
          const v = historyArray[0].value;

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
          ].map(item => ({ ...item, value: parseFloat(item.value.toFixed(2)) }));

          setChartData(finalBreakdown);
        }
      } catch (e) {
        console.error("Dashboard calculation error:", e);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAllData();
  }, [token,isTokenValid,logout]);

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
      if (res.ok) alert(`Goal set:I'll try ${tip.replacement}!`);
    } catch (e) {
      console.error("Goal doesn't get saved at server", e);
    }
  }
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress color="success" thickness={4} size={50} />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>

      <Collapse in={!!achievements}>
        {achievements && achievements.map((ach, i) => (
          <Alert key={i} severity="success" sx={{ mb: 4, borderRadius: 4, textAlign: 'left' }} onClose={() => setAchievements(null)}>
            <Typography variant="h6" fontWeight="bold">Great Job!</Typography>
            You successfully switched your <b>{ach.category.replace('_', ' ')}</b>. This contributed to a reduction of approximately <b>{ach.saving} kg CO₂</b>
        </Alert>
      ))}
      </Collapse>

      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h4" fontWeight="800" color="#1b5e20">Environmental Impact Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Monthly footprint overview and smart suggestions</Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, backgroundColor: "#e8f5e9", boxShadow: "0 8px 20px rgba(0,0,0,0.05)", height: 420, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>Latest Emission Result Breakdown</Typography>
            <Box sx={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartdata}
                    innerRadius={85}
                    outerRadius={115}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartdata.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip isBar={false} />} />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

<<<<<<< HEAD
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, backgroundColor: "#ffffff", boxShadow: "0 8px 20px rgba(0,0,0,0.05)", height: 420, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>Past Monthly Emission Trend</Typography>
            <Box sx={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...data].reverse().slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="createdAt"
                    tickFormatter={(tick) => new Date(tick).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip isBar={true} />} cursor={{ fill: '#f1f8e9' }} />
                  <Bar dataKey="monthly_totalemission" fill="#2e7d32" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
=======
        {/* FULL WIDTH SUGGESTIONS */}
        <Box>
          <Typography
            variant="h5"
            fontWeight="800"
            color="#1b5e20"
            sx={{ mb: 4 }}
          >
            Personalized Eco Tips 
          </Typography>
>>>>>>> 21c79274676e9de72e08c6f71732e0367bedb445

      <Box>
        <Typography variant="h5" fontWeight="800" color="#1b5e20" sx={{ mb: 4 }}>Personalized Eco Tips ✨</Typography>
        {suggestion.length > 0 ? (
          <Grid container spacing={3}>
            {suggestion.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, backgroundColor: "#ffffff", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", transition: "0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 28px rgba(0,0,0,0.08)" } }}>
                  <Typography fontWeight="700" sx={{ mb: 1 }}>{item.tip}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>Switch to <b>{item.replacement}</b></Typography>
                  <Typography fontWeight="800" color="#2e7d32">−{item.potential_saving} kg CO₂</Typography>
                  <Button variant="outlined" color="success" size="small" onClick={()=>handleCommit(item)} sx={{mt:2,borderRadius:2}}>I'll try this</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="success">You're already carbon efficient 🌱</Alert>
        )}
      </Box>
    </Container>
  );
}

export default Dashboard;