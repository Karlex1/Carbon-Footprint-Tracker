import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  Box, CircularProgress, Container, Divider, Grid,
  Paper, Stack, Typography, Alert
} from "@mui/material";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  Bar, YAxis, XAxis, CartesianGrid, BarChart
} from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);
  const [suggestion, setsuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartdata, setChartData] = useState([]);
  const { token, user } = useContext(AuthContext);

  // Nature-themed palette
  const COLORS = ['#1b5e20', '#2e7d32', '#4caf50', '#8bc34a', '#c8e6c9'];

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [histRes, sugRes] = await Promise.all([
          fetch("http://localhost:5000/gethistory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }),
          fetch("http://localhost:5000/suggestionengine", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          })
        ]);

        const history = await histRes.json();
        const suggestions = await sugRes.json();

        setData(Array.isArray(history) ? history : []);
        setsuggestion(Array.isArray(suggestions) ? suggestions : []);

        // Process breakdown for the Pie Chart from the latest record
        if (history && history.length > 0 && history[0].value) {
          const latest = history[0].value;
          const formattedPie = [];

          Object.keys(latest).forEach(category => {
            const activities = latest[category];
            Object.keys(activities).forEach(activity => {
              const item = activities[activity];
              if (item.emission > 0) {
                formattedPie.push({
                  name: activity,
                  value: parseFloat(item.emission.toFixed(2))
                });
              }
            });
          });
          setChartData(formattedPie);
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
      <CircularProgress color="success" />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 , textAlign:'center'}}>
      <Typography variant="h4" gutterBottom>Environmental Impact Report</Typography>

      <Grid container spacing={4}>
        <Grid item size={{ xs:12,md: 6}}>
          <Paper elevation={3} sx={{p:4,bgcolor:'#f1f8e9', border:'1px solid #c8e6c9',height:'550px',display:'flex',flexDirection:'column'}}>
            <Typography varient="subtitle2" color="textSecondary">Latest Emission</Typography>
            <Typography varient="h3" sx={{ color: "#1b5e0", my: 1 }}>{data && data.length > 0 ? data[0].totalemission.toFixed(3) : "0.00"}<Typography component="span" variant="h6" sx={{ ml: 1 }}>kgCO2</Typography>
            </Typography>
            <Divider sx={{ my: 3}} />
            <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>Activity Breakdown</Typography>
            <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie data={chartdata} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">{chartdata.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie>
                  <Tooltip/><Legend verticalAlign="bottom"/>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', height: '550px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#2e7d32' }}>Last 10 Records</Typography>
              <Box sx={{flexGrow:1,width:'100%',minHeight:0}}>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={[...data].reverse().slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="createdAt" tickFormatter={(tick)=>new Date(tick).toLocaleDateString('en-In',{day:'numeric',month:'short'})} fontSize={12}/>
                    <YAxis fontSize={12}/>
                  <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                  <Bar dataKey="totalemission" fill="#4caf50" radius={[6,6,0,0]} />
                </BarChart>
                </ResponsiveContainer>
              </Box>
          </Paper>
        </Grid>

        <Grid item size={ {xs:12}} >
          <Typography variant="h5" sx={{ color: '#1b5e20', fontWeight: 700, mb: 3, mt: 2 }}>Personalized Eco-Tips ✨</Typography>
          {suggestion.length > 0 ? (
            <Grid container spacing={3}> {suggestion.map((item, index) => (<Grid item size={{ xs: 12, sm: 6, md: 4, key: index }}>
              <Paper elevation={0} sx={{p:3,borderLeft:'6px solid #4caf50',border:'1px solid #eee'}}>
                <Typography variant="subtitle1" sx={{fontWeight:600}}>{item.tip}</Typography>
                <Typography variant="body1" sx={{mt:1,color:'text.secondary'}}>By switching to <strong>{item.replacement}</strong>, you could save approx.
                  <Typography component="span" sx={{ color: '#2e7d32', fontWeight: 700, ml: 1 }}>{item.potential_saving} kgCO2</Typography>.</Typography>
              </Paper>
            </Grid>))}</Grid>
          ) : (<Alert severity='success' sx={{ borderRadius: 4 }}>No immediate suggestions- Your current footprints are well-optimized! 🌱</Alert>)}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;