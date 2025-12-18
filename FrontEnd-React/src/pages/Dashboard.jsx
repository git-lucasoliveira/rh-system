import { useState, useEffect } from 'react';
// REMOVIDO: import { Link } ... (Era isso que estava a dar erro!)
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Skeleton
} from '@mui/material';

import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import "../styles/App.css";

// Recebemos a função 'onNavigate' para mudar de tela sem Link
function Dashboard({ onLogout, onNavigate }) {
  const [totalFuncionarios, setTotalFuncionarios] = useState(null);
  const [totalSetores, setTotalSetores] = useState(null);
  const [totalCargos, setTotalCargos] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const fetchCount = async (url) => {
        try {
          const response = await fetch(url, { headers });
          if (response.ok) {
            const lista = await response.json();
            return lista.length;
          }
          return 0;
        } catch (error) {
          return 0;
        }
      };

      const [func, set, carg] = await Promise.all([
        fetchCount('http://localhost:8080/api/funcionarios'),
        fetchCount('http://localhost:8080/api/setores'),
        fetchCount('http://localhost:8080/api/cargos')
      ]);

      setTotalFuncionarios(func);
      setTotalSetores(set);
      setTotalCargos(carg);
    };

    carregarDados();
  }, []);

  const DisplayNumber = ({ value }) => {
    if (value === null) return <Skeleton variant="text" width={60} height={60} sx={{ margin: '0 auto', bgcolor: 'rgba(255,255,255,0.05)' }} />;
    return <Typography variant="h2" sx={{ fontWeight: '800', my: 1, color: '#fff' }}>{value}</Typography>;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#050505',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #4a0072 0%, #100020 80%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>

      {/* NAVBAR */}
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', py: 2 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
              <AutoAwesomeIcon sx={{ color: '#d500f9', mr: 1, filter: 'drop-shadow(0 0 5px #d500f9)' }} />
              <Typography variant="h5" sx={{ fontWeight: '800', letterSpacing: 1 }}>
                StarPeople
              </Typography>
              <Chip label="BETA" size="small" sx={{ ml: 2, bgcolor: '#d500f9', color: '#fff', fontWeight: '900', fontSize: '0.65rem', height: 20 }} />
            </Box>

            <Button
              variant="outlined"
              onClick={onLogout}
              startIcon={<LogoutIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '30px',
                px: 3,
                textTransform: 'none',
                '&:hover': { borderColor: '#d500f9', bgcolor: 'rgba(213, 0, 249, 0.1)' }
              }}
            >
              Sair
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* CONTEÚDO CENTRAL */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        
        <Box textAlign="center" mb={5}>
          <Typography variant="h3" sx={{ fontWeight: '800', mb: 1 }}>
            Painel de Gestão
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: '400' }}>
            Visão geral dos indicadores em tempo real
          </Typography>
        </Box>

        {/* GRID DE CARDS */}
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">

          {/* CARD 1: Colaboradores */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card" sx={{ height: '100%', minHeight: '380px' }}> 
              <CardContent sx={{ 
                textAlign: 'center', 
                p: 4,
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}>
                <Box>
                  <Box className="icon-box" sx={{ mb: 2 }}>
                    <GroupIcon sx={{ fontSize: 32, color: '#d500f9' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700">Colaboradores</Typography>
                  <DisplayNumber value={totalFuncionarios} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                    Registrados no sistema
                  </Typography>
                </Box>

                {/* AÇÃO DE NAVEGAÇÃO CORRIGIDA */}
                <Button 
                  onClick={() => onNavigate('funcionarios')}
                  fullWidth 
                  sx={{
                    mt: 2,
                    background: 'var(--primary)',
                    color: 'white',
                    py: 1.5,
                    borderRadius: '30px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(213, 0, 249, 0.3)',
                    '&:hover': { background: 'var(--primary-hover)', boxShadow: '0 6px 20px rgba(213, 0, 249, 0.5)' }
                  }}
                >
                  Acessar Módulo
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* CARD 2: Setores */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card" sx={{ height: '100%', minHeight: '380px' }}>
              <CardContent sx={{ textAlign: 'center', p: 4, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <Box>
                  <Box className="icon-box" sx={{ mb: 2 }}> <BusinessIcon sx={{ fontSize: 32, color: '#fff' }} /> </Box>
                  <Typography variant="h6" fontWeight="700">Setores</Typography>
                  <DisplayNumber value={totalSetores} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>Departamentos ativos</Typography>
                </Box>
                <Button variant="outlined" onClick={() => onNavigate('setores')} fullWidth sx={{ mt: 2, color: '#fff', borderColor: 'rgba(255,255,255,0.3)', py: 1.5, borderRadius: '30px', textTransform: 'none', fontWeight: '600', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  Gerenciar Setores
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* CARD 3: Cargos */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card" sx={{ height: '100%', minHeight: '380px' }}>
              <CardContent sx={{ textAlign: 'center', p: 4, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <Box>
                  <Box className="icon-box" sx={{ mb: 2 }}> <WorkIcon sx={{ fontSize: 32, color: '#fff' }} /> </Box>
                  <Typography variant="h6" fontWeight="700">Cargos</Typography>
                  <DisplayNumber value={totalCargos} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>Funções cadastradas</Typography>
                </Box>
                <Button variant="outlined" onClick={() => onNavigate('cargos')} fullWidth sx={{ mt: 2, color: '#fff', borderColor: 'rgba(255,255,255,0.3)', py: 1.5, borderRadius: '30px', textTransform: 'none', fontWeight: '600', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  Gerenciar Cargos
                </Button>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>

      {/* FOOTER */}
      <Box component="footer" sx={{ textAlign: 'center', py: 3, borderTop: '1px solid rgba(255,255,255,0.1)', mt: 'auto' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2025 <strong>Grupo Starbank</strong> | Tecnologia e Inovação
        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;