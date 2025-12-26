# 🎯 LORHS - Frontend

Sistema Frontend do **Lucas Oliveira RH System**

## 🚀 Tecnologias

- HTML5
- CSS3 (com variáveis CSS customizadas)
- JavaScript ES6+ (Vanilla)
- Bootstrap 5.3
- Bootstrap Icons 1.11
- Fetch API

## 📁 Estrutura

```
FrontEnd/
├── index.html                 # Login
├── home.html                  # Dashboard
├── navbar.html                # Menu superior
├── funcionarios.html          # Lista colaboradores
├── funcionario-form.html      # Cadastro/Edição
├── setores.html               # Gestão setores
├── setor-form.html            # Form setor
├── cargos.html                # Gestão cargos
├── cargo-form.html            # Form cargo
├── usuarios.html              # Gestão usuários (ADMIN)
├── usuarios-form.html         # Form usuário
├── logs.html                  # Auditoria (ADMIN)
├── perfil.html                # Perfil do usuário
└── assets/
    ├── css/
    │   ├── styles.css         # Estilos principais
    │   ├── components-extra.css
    │   └── notifications.css  # Toasts
    └── js/
        ├── app.js             # Global (navbar, auth)
        ├── login.js           # Autenticação
        ├── home.js            # Dashboard
        ├── funcionarios.js    # CRUD colaboradores
        ├── funcionario-form.js
        ├── setores.js
        ├── setor-form.js
        ├── cargos.js
        ├── cargo-form.js
        ├── usuarios.js
        ├── perfil.js
        ├── logs.js
        └── notifications.js   # Sistema de toasts
```

## ⚙️ Configuração

### 1. Backend URL

Todos os arquivos `.js` usam:

```javascript
const API_URL = "http://localhost:8080/api";
```

Se o backend estiver em outra porta/domínio, altere em cada arquivo.

### 2. Executar Frontend

**Opção 1: Live Server (VS Code)**
1. Instale a extensão **Live Server**
2. Abra `index.html`
3. Clique em **Go Live**

**Opção 2: Python Server**
```bash
cd FrontEnd
python -m http.server 5500
```

**Opção 3: Node.js (http-server)**
```bash
npm install -g http-server
http-server -p 5500
```

Acesse: **http://localhost:5500**

## 🎨 Paleta de Cores

```css
:root {
    /* Backgrounds */
    --star-dark: #050b1a;
    --star-card-bg: #0f1e35;
    
    /* Primárias */
    --star-primary: #0ea5e9;      /* Azul Céu */
    --star-primary-light: #38bdf8;
    --star-hover: #22d3ee;         /* Ciano */
    
    /* Gradientes */
    --star-gradient-primary: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
    --star-gradient-gold: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%);
    
    /* Status */
    --success: #10b981;
    --danger: #ef4444;
    --info: #06b6d4;
    --warning: #f59e0b;
}
```

## 🔐 Autenticação

### Fluxo de Login

1. Usuário envia credenciais (`POST /auth/login`)
2. Backend retorna JWT Token
3. Token salvo no `localStorage`:
   ```javascript
   localStorage.setItem('token', response.token);
   localStorage.setItem('nomeUsuario', response.nome);
   localStorage.setItem('perfil', response.perfil);
   ```
4. Em todas as requisições, adiciona header:
   ```javascript
   headers: {
       'Authorization': `Bearer ${token}`
   }
   ```

### Proteção de Rotas

Arquivo `app.js` verifica autenticação em todas as páginas (exceto `index.html`):

```javascript
function verificarAcessoGlobal() {
    const token = localStorage.getItem('token');
    const paginaAtual = window.location.pathname;
    
    if (!token && !paginaAtual.includes('index.html')) {
        window.location.href = 'index.html';
    }
}
```

## 📡 Comunicação com Backend

### Exemplo de Requisição

```javascript
async function carregarColaboradores() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/funcionarios`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados');
        }
        
        const dados = await response.json();
        renderizarTabela(dados);
        
    } catch (error) {
        showToast('Erro ao carregar colaboradores', 'error');
        console.error(error);
    }
}
```

## 🔔 Sistema de Notificações

Arquivo `notifications.js` provê toasts modernos:

```javascript
// Sucesso
showToast('Colaborador cadastrado!', 'success');

// Erro
showToast('Erro ao salvar dados', 'error');

// Aviso
showToast('Preencha todos os campos', 'warning');

// Info
showToast('Carregando dados...', 'info');
```

### Atalhos disponíveis:
```javascript
showSuccess('Operação concluída!');
showError('Erro ao processar');
showWarning('Atenção!');
showInfo('Informação...');
```

## 📱 Responsividade

O sistema é totalmente responsivo usando Bootstrap 5:

- **Desktop**: Layout completo
- **Tablet**: Menu responsivo (collapse)
- **Mobile**: Cards empilhados, tabelas com scroll horizontal

### Breakpoints

```css
/* Extra small devices (phones, less than 576px) */
@media (max-width: 575.98px) { }

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) { }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { }

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) { }

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) { }
```

## 🎭 Componentes Customizados

### Cards com Glassmorphism

```css
.card-dashboard {
    background: var(--star-gradient-card);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
}
```

### Botões Premium

```html
<button class="btn btn-star-primary">Botão Primário</button>
<button class="btn btn-star-outline">Botão Outline</button>
```

### Badges de Status

```html
<span class="badge bg-success">ATIVO</span>
<span class="badge bg-danger">INATIVO</span>
<span class="badge bg-info">PENDENTE</span>
```

## 🔧 Troubleshooting

### CORS Error

Se aparecer erro de CORS no console:

1. Verifique `CorsConfig.java` no backend
2. Adicione a origem do frontend:
   ```java
   config.addAllowedOrigin("http://localhost:5500");
   ```

### Token Expirado

Quando o token JWT expira (2h), o usuário é redirecionado ao login:

```javascript
if (response.status === 403 || response.status === 401) {
    showError('Sessão expirada. Faça login novamente');
    localStorage.clear();
    window.location.href = 'index.html';
}
```

### Dados não carregam

1. Abrir console (F12)
2. Verificar aba **Network** → ver status da requisição
3. Verificar se backend está rodando (`http://localhost:8080`)
4. Confirmar token no localStorage (`Application → Local Storage`)

## 📊 Melhorias Futuras

- [ ] Paginação nas tabelas
- [ ] Filtros avançados (data, múltiplos campos)
- [ ] Upload de foto do colaborador
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Gráficos no dashboard (Chart.js)
- [ ] Dark mode toggle
- [ ] PWA (Progressive Web App)
- [ ] Notificações push

---

© 2025 Lucas Oliveira | Sistema Interno
