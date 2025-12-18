import React, { useState, useEffect } from 'react';
import './Funcionarios.css';

// Ícones UI
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Ícone de lixeira mais bonito
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Ícones para Setores (Adicionando personalidade)
import ComputerIcon from '@mui/icons-material/Computer';       // TI
import BadgeIcon from '@mui/icons-material/Badge';             // RH/Adm
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // Backoffice
import GavelIcon from '@mui/icons-material/Gavel';             // Jurídico
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Vendas/Financeiro
import BusinessIcon from '@mui/icons-material/Business';       // Geral

function Funcionarios({ onVoltar }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  // Lógica para escolher ícone baseado no texto do setor
  const getSetorIcon = (nomeSetor) => {
    const nome = nomeSetor ? nomeSetor.toLowerCase() : "";
    
    if (nome.includes('ti') || nome.includes('tecnologia')) return <ComputerIcon sx={{ fontSize: 16 }} />;
    if (nome.includes('rh') || nome.includes('recursos')) return <BadgeIcon sx={{ fontSize: 16 }} />;
    if (nome.includes('vendas') || nome.includes('financeiro')) return <MonetizationOnIcon sx={{ fontSize: 16 }} />;
    if (nome.includes('jurídico') || nome.includes('legal')) return <GavelIcon sx={{ fontSize: 16 }} />;
    if (nome.includes('backoffice') || nome.includes('suporte')) return <SupportAgentIcon sx={{ fontSize: 16 }} />;
    
    return <BusinessIcon sx={{ fontSize: 16 }} />; // Ícone padrão
  };

  useEffect(() => {
    const carregarFuncionarios = async () => {
       const token = localStorage.getItem('token');
       try {
         const response = await fetch('http://localhost:8080/api/funcionarios', {
           headers: { 'Authorization': `Bearer ${token}` }
         });
         
         if (response.ok) {
           const data = await response.json();
           setFuncionarios(data);
         } else {
           // Dados mockados para você ver o visual se a API falhar
           setFuncionarios([
             { id: 1, nome: "Almerinda Maria", cpf: "123.456.789-00", email: "almerinda.vieira@starbank.tec.br", setor: {nome: "Backoffice"}, cargo: {nome: "Auxiliar de Backoffice"}, dataAdmissao: new Date() },
             { id: 2, nome: "Alycia Freitas", cpf: "517.840.108-55", email: "alycia.paula@starbank.tec.br", setor: {nome: "RH"}, cargo: {nome: "Analista de Pessoas"}, dataAdmissao: [2025, 5, 20] },
             { id: 3, nome: "Ana Caroline Rocha", cpf: "460.371.578-12", email: "ana.rocha@starbank.tec.br", setor: {nome: "Vendas"}, cargo: {nome: "Operador de Vendas"}, dataAdmissao: [2025, 3, 18] },
             { id: 4, nome: "Anderson José Silva", cpf: "236.428.088-59", email: "anderson.silva@starbank.tec.br", setor: {nome: "Jurídico"}, cargo: {nome: "Assistente Jurídico"}, dataAdmissao: [2024, 12, 4] },
             { id: 5, nome: "João da Silva Tecnologia", cpf: "000.000.000-00", email: "joao.dev@starbank.tec.br", setor: {nome: "TI"}, cargo: {nome: "Dev Fullstack"}, dataAdmissao: [2024, 1, 10] },
           ]);
         }
       } catch (error) {
         console.error("Erro", error);
       } finally {
         setLoading(false);
       }
    };
    carregarFuncionarios();
  }, []);

  const formatarData = (dataArray) => {
    if (!dataArray) return "-";
    if (Array.isArray(dataArray)) return `${dataArray[2]}/${dataArray[1]}/${dataArray[0]}`;
    return new Date(dataArray).toLocaleDateString('pt-BR');
  };

  const funcionariosFiltrados = funcionarios.filter(f => 
    f.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    f.email?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="page-container">
      
      {/* HEADER */}
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onVoltar} className="star-btn btn-outline" style={{ padding: '0', width: '40px', justifyContent: 'center' }}>
            <ArrowBackIcon fontSize="small" />
          </button>
          <div className="header-title">
            <h1>Colaboradores</h1>
            <span>Gestão de pessoas e acessos</span>
          </div>
        </div>

        <div className="btn-group">
          <button className="star-btn btn-outline">
            <DescriptionIcon fontSize="small" style={{ marginRight: '6px' }} />
            Exportar
          </button>
          <button className="star-btn btn-primary">
            <AddIcon fontSize="small" style={{ marginRight: '4px' }} />
            Novo
          </button>
        </div>
      </header>

      {/* FILTROS */}
      <div className="filter-bar">
        <div className="filter-group" style={{ position: 'relative' }}>
          <label className="filter-label">Pesquisar Colaborador</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text" 
              className="star-input" 
              placeholder="Nome, CPF ou Email..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ paddingLeft: '2.8rem' }} 
            />
            <SearchIcon 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} 
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Departamento</label>
          <select className="star-input">
            <option value="Todos">Todos os Departamentos</option>
            <option value="TI">Tecnologia (TI)</option>
            <option value="RH">Recursos Humanos</option>
            <option value="Backoffice">Backoffice</option>
            <option value="Vendas">Comercial / Vendas</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select className="star-input">
            <option value="Ativos">Apenas Ativos</option>
            <option value="Inativos">Inativos</option>
          </select>
        </div>

        <button className="star-btn btn-primary" style={{ height: '42px', padding: '0 2rem' }}>
          Filtrar
        </button>
      </div>

      {/* TABELA */}
      <div className="table-wrapper">
        <div className="scroll-area">
          <table className="star-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Colaborador</th>
                <th style={{ width: '20%' }}>Email Corporativo</th>
                <th>Admissão</th>
                <th>Setor</th>
                <th>Cargo</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" align="center" style={{ padding: '3rem' }}>Carregando dados...</td></tr>
              ) : funcionariosFiltrados.length === 0 ? (
                <tr><td colSpan="7" align="center" style={{ padding: '3rem', opacity: 0.6 }}>Nenhum colaborador encontrado.</td></tr>
              ) : (
                funcionariosFiltrados.map((func) => (
                  <tr key={func.id}>
                    <td>
                      <div className="col-primary">
                        <span className="text-bold">{func.nome}</span>
                        <span className="text-sub">{func.cpf}</span>
                      </div>
                    </td>
                    <td style={{ color: '#a78bfa' }}>{func.email}</td>
                    <td>{formatarData(func.dataAdmissao)}</td>
                    <td>
                      <span className="badge badge-setor">
                        {getSetorIcon(func.setor?.nome)}
                        {func.setor?.nome || "Geral"}
                      </span>
                    </td>
                    <td>{func.cargo?.nome}</td>
                    <td>
                      <span className="badge badge-ativo">
                        <span className="status-dot"></span>
                        Ativo
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn" title="Editar">
                          <EditIcon fontSize="small" />
                        </button>
                        <button className="action-btn" title="Excluir" style={{ color: '#ef4444' }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Funcionarios;