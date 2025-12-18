import { useState } from 'react';
import Dashboard from './pages/Dashboard'; // <--- MUDOU AQUI (Adicionamos /pages/)
// Importa o arquivo que acabaste de criar na pasta pages
import Funcionarios from './pages/Funcionarios';
import './styles/App.css'; // <--- MUDOU AQUI (Adicionamos /styles/)

// ... resto das importações (ícones, etc) mantêm-se iguais
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// ... o resto do código continua igual ...

// Componente para as telas em construção
const TelaPlaceholder = ({ titulo, onVoltar }) => (
  <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <h1 style={{ marginBottom: '20px' }}>{titulo}</h1>
    <p style={{ color: '#aaa', marginBottom: '40px' }}>Módulo em desenvolvimento...</p>
    <button onClick={onVoltar} style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #d500f9', background: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <ArrowBackIcon fontSize="small"/> Voltar para Dashboard
    </button>
  </div>
);

function App() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [logado, setLogado] = useState(false);
  
  // Controle de navegação
  const [paginaAtual, setPaginaAtual] = useState('dashboard');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // 1. REATIVAMOS A CONEXÃO REAL COM O BANCO DE DADOS
      // Certifique-se que o endereço está igual ao do seu backend (ex: /auth/login)
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha })
      });

      if (response.ok) {
        const data = await response.json();
        
        // 2. Guardamos o token VERDADEIRO
        localStorage.setItem('token', data.token);
        
        setLogado(true);
        setPaginaAtual('dashboard');
      } else {
        setErro('Usuário ou senha inválidos.');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogado(false);
    setLogin('');
    setSenha('');
    setPaginaAtual('dashboard');
  };

  if (logado) {
    switch (paginaAtual) {
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} onNavigate={setPaginaAtual} />;
      case 'funcionarios':
        return <Funcionarios onVoltar={() => setPaginaAtual('dashboard')} />;
      case 'setores':
        return <TelaPlaceholder titulo="Gestão de Setores" onVoltar={() => setPaginaAtual('dashboard')} />;
      case 'cargos':
        return <TelaPlaceholder titulo="Gestão de Cargos" onVoltar={() => setPaginaAtual('dashboard')} />;
      default:
        return <Dashboard onLogout={handleLogout} onNavigate={setPaginaAtual} />;
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h1 className="login-logo">
            <AutoAwesomeIcon sx={{ color: '#d500f9', fontSize: 40 }} /> 
            StarPeople<span style={{ color: '#d500f9' }}>.</span>
          </h1>
          <p className="login-subtitle">Acesso Administrativo</p>
        </header>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="login">Usuário</label>
            <input id="login" type="text" placeholder="Digite seu usuário..." value={login} onChange={(e) => setLogin(e.target.value)} disabled={loading} autoComplete="off" />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" placeholder="Digite sua senha..." value={senha} onChange={(e) => setSenha(e.target.value)} disabled={loading} />
          </div>

          {erro && <div className="error-message">⚠️ {erro}</div>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <footer className="login-footer">© 2025 Grupo Starbank · Tecnologia</footer>
      </div>
    </div>
  );
}

export default App;