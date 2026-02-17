import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Box, CircularProgress, Container, Divider, Paper, Stack, Typography } from "@mui/material";


function Dashboard() {
  const [data, setData] = useState(null);
  const [suggestion, setsuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  let { token } = useContext(AuthContext);
  const [chartdata, setChartData] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [histRes, sugRes] = await Promise.all([fetch("http://localhost:5000/gethistory", {
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
        setData(history);
        setsuggestion(suggestions);
        if (history && history.length > 0) {
          const latest = history[0].breakdown;
          const formattedPie = Object.keys(latest).map(key => ({
            name: key,
            value: parseFloat(latest[key].total.toFixed(2))
          }));
          setChartData(formattedPie);
        }
      }
      catch (e) {
        console.log("failed at Dashboard", e.message);
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      fetchAll();
    }
  }, [token]);

  if (loading) return <CircularProgress color="success" sx={{ m: 5 }} />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 ,mb:4}}>
    <Typography variant="h4" sx={{ color: '#2e7d32', mb: 3, fontWeight: 'bold' }}>
    Your Environmental ReportCard
    </Typography>
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#f1f8e9', borderRadius: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">Latest Emission</Typography>
        <Typography variant="h3" sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
          {data && data.length > 0 ? `${data[0].totalemission} kgCO2` : "---"}
        </Typography>
      </Paper>

      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          Personalized Eco-Tips
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {suggestion && suggestion.length > 0 ? (
          <Stack spacing={2}>
            {suggestion.map((item, index) => (
              <Paper key={index} sx={{ p: 2, borderLeft: '5px solid #4caf50' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.tip}
                </Typography>
                <Typography variant="caption" color="textSecondary">Potential Saving: {item.potential_saving} kgCO2 by switching to {item.replacement}</Typography>
              </Paper>
            ))}
          </Stack>
        ) : (<Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No Suggestions - you are living a good life! 🌱
          </Typography>
        </Paper>)}
      </Box>
    </Stack>
  </Container>
  )
}

export default Dashboard