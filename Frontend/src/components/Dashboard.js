import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  Box, CircularProgress, Container, Divider, Grid,
  Paper, Typography, Alert, Card, CardContent, Chip
} from "@mui/material";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  Bar, YAxis, XAxis, CartesianGrid, BarChart
} from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartdata, setChartData] = useState([]);
  const { token } = useContext(AuthContext);

  const COLORS = ['#1b5e20', '#2e7d32', '#4caf50', '#8bc34a', '#aed581'];

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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

        // Logic for the New Backend Structure
        if (historyArray.length > 0 && historyArray[0].value) {
          const v = historyArray[0].value;

          // Applying standard emission factors (estimates)
          const breakdown = [
            { name: 'Transport', value: (Number(v.vehicle_distance_km) * 0.17) + (v.air_travel_frequency === 'very frequently' ? 50 : 10) },
            { name: 'Diet & Food', value: (Number(v.monthly_grocery_bill) * 0.05) + (v.diet_type === 'omnivore' ? 15 : 5) },
            { name: 'Waste', value: (Number(v.waste_bag_count) * 2.5) },
            { name: 'Digital', value: (Number(v.tv_pc_hours_daily) + Number(v.internet_hours_daily)) * 0.5 },
            { name: 'Shopping', value: (Number(v.new_clothes_monthly) * 12) }
          ].filter(item => item.value > 0);

          setChartData(breakdown);
        }
      } catch (e) {
        console.error("Dashboard failed to load:", e.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAllData();
  }, [token]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress color="success" thickness={4} size={50} />
    </Box>
  );

  return (
    // <Box
    //   sx={{
    //     minHeight: "100vh",
    //     backgroundColor: "#f4f8f4",
    //     py: 6
    //   }}
    // >
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>

        {/* HEADER */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h4" fontWeight="800" color="#1b5e20">
            Environmental Impact Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monthly footprint overview and smart suggestions
          </Typography>
        </Box>

        {/* 50-50 CHART SECTION */}
        <Grid container spacing={4} sx={{ mb: 8 }}>

          {/* PIE */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: "#e8f5e9",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                height: 420,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                Emission Breakdown
              </Typography>

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
                      {chartdata.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* BAR */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                height: 420,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                Monthly Emission Trend
              </Typography>

              <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...data].reverse().slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric"
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="monthly_totalemission"
                      fill="#2e7d32"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

        </Grid>

        {/* FULL WIDTH SUGGESTIONS */}
        <Box>
          <Typography
            variant="h5"
            fontWeight="800"
            color="#1b5e20"
            sx={{ mb: 4 }}
          >
            Personalized Eco Tips ✨
          </Typography>

          {suggestion.length > 0 ? (
            <Grid container spacing={3}>
              {suggestion.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.08)"
                      }
                    }}
                  >
                    <Typography fontWeight="700" sx={{ mb: 1 }}>
                      {item.tip}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Switch to <b>{item.replacement}</b>
                    </Typography>

                    <Typography fontWeight="800" color="#2e7d32">
                      −{item.potential_saving} kg CO₂
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="success">
              You're already carbon efficient 🌱
            </Alert>
          )}
        </Box>

      </Container>
    // </Box>
  );
}

export default Dashboard;