# 🌟 StarPeople - Frontend

Sistema de Gestão de Pessoas desenvolvido com **HTML5, CSS3 e JavaScript (Vanilla)**.

---

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização com CSS Variables
- **JavaScript (Vanilla)** - Lógica de negócio e requisições HTTP
- **Bootstrap 5.3.0** - Framework CSS responsivo
- **Bootstrap Icons 1.11.3** - Ícones
- **Google Fonts (Inter)** - Tipografia moderna

---

## 📂 Estrutura do Projeto

```
FrontEnd/
├── index.html              # Página de login
├── home.html              # Dashboard com indicadores
├── funcionarios.html      # Listagem de colaboradores
├── funcionario-form.html  # Formulário de cadastro/edição
├── setores.html           # Gestão de setores
├── setor-form.html        # Formulário de setores
├── cargos.html            # Gestão de cargos
├── cargo-form.html        # Formulário de cargos
├── usuarios.html          # Gestão de usuários do sistema
├── usuarios-form.html     # Formulário de usuários
├── logs.html              # Logs de auditoria
├── perfil.html            # Perfil do usuário logado
├── navbar.html            # Componente de navegação
└── assets/
    ├── css/
    │   ├── styles.css           # Estilos principais
    │   ├── components-extra.css # Componentes adicionais
    │   └── notifications.css    # Sistema de notificações
    └── js/
        ├── app.js               # Configuração global e autenticação
        ├── login.js             # Lógica de login
        ├── home.js              # Dashboard
        ├── funcionarios.js      # Listagem de colaboradores
        ├── funcionario-form.js  # CRUD de colaboradores
        ├── setores.js           # Listagem de setores
        ├── setor-form.js        # CRUD de setores
        ├── cargos.js            # Listagem de cargos
        ├── cargo-form.js        # CRUD de cargos
        ├── usuarios.js          # Gestão de usuários
        ├── logs.js              # Visualização de logs
        ├── perfil.js            # Perfil do usuário
        └── notifications.js     # Sistema de toasts, modais e validações
```

---

## ⚙️ Configuração

### 1. URL da API

O frontend está configurado para se comunicar com o backend em:

```javascript
const API_URL = "http://localhost:8080/api";
```

Se o backend estiver em outra porta ou servidor, altere a constante `API_URL` nos arquivos JavaScript.

### 2. CORS

O backend deve permitir requisições da origem do frontend:
- `http://127.0.0.1:5500` (Live Server padrão)
- `http://localhost:5500`

---

## 🖥️ Como Executar

### Opção 1: Live Server (VS Code)

1. Instale a extensão **Live Server** no VS Code
2. Clique com o botão direito em `index.html`
3. Selecione **"Open with Live Server"**
4. O navegador abrirá automaticamente em `http://127.0.0.1:5500`

### Opção 2: Servidor HTTP Simples (Python)

```bash
# Python 3
python -m http.server 5500

# Acesse: http://localhost:5500
```

### Opção 3: Node.js (http-server)

```bash
# Instalar globalmente
npm install -g http-server

# Executar
http-server -p 5500

# Acesse: http://localhost:5500
```

---

## 👤 Credenciais Padrão (Desenvolvimento)

**⚠️ ATENÇÃO:** Credenciais apenas para ambiente de desenvolvimento/testes local.

**SuperAdmin:**
- Login: `admin`
- Senha: `admin123`

**TI:**
- Login: `ti`
- Senha: `ti123`

**RH:**
- Login: `rh`
- Senha: `rh123`

**🔒 SEGURANÇA EM PRODUÇÃO:**
- Trocar TODAS as senhas padrão
- Usar senhas fortes (12+ caracteres, letras, números, símbolos)
- Implementar política de rotação de senhas
- Considerar autenticação via Active Directory/LDAP

---

## 🎨 Sistema de Design

### Cores Principais

```css
--bg-primary: #0a0e27;        /* Fundo escuro principal */
--bg-secondary: #1a1f3a;      /* Cards e containers */
--accent-primary: #3b82f6;    /* Azul primário */
--accent-secondary: #8b5cf6;  /* Roxo secundário */
--text-primary: #ffffff;      /* Texto principal */
--text-secondary: #a0a0b0;    /* Texto secundário */
```

### Componentes

- **Botões:** `.btn-star-primary`, `.btn-star-outline`
- **Cards:** `.card-dashboard`, `.colaborador-card`
- **Notificações:** `.toast-notification`, `.modal-overlay`
- **Badges:** Status ativo/inativo, perfis de usuário

---

## 🔔 Sistema de Notificações

### Toasts

```javascript
showSuccess('Operação realizada com sucesso!');
showError('Erro ao processar requisição');
showWarning('Atenção: campos inválidos');
showInfo('Informação importante');
```

### Modais de Confirmação

```javascript
showConfirmModal(
    'Deseja excluir este registro?',
    () => {
        // Ação após confirmação
        console.log('Confirmado!');
    },
    'Confirmar Exclusão'
);
```

### Validações

```javascript
validarCPF(cpf);                    // true/false
validarEmail(email);                // true/false
validarCampoObrigatorio(valor);     // true/false
```

### Loading States

```javascript
const btn = document.getElementById('btn-salvar');
setButtonLoading(btn, true);  // Ativa loading
setButtonLoading(btn, false); // Desativa loading
```

---

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Token)** armazenado no `localStorage`:

```javascript
// Salvar token após login
localStorage.setItem('token', response.token);

// Usar token nas requisições
headers: {
    'Authorization': `Bearer ${token}`
}

// Logout
localStorage.clear();
window.location.href = 'index.html';
```

---

## 📊 Funcionalidades

### ✅ Gestão de Colaboradores
- Listagem com filtros (nome, setor, status)
- Cadastro e edição de funcionários
- Inativar/Ativar colaboradores
- Exclusão definitiva (apenas SUPERADMIN)
- Validação de CPF e email

### ✅ Gestão de Setores
- CRUD completo
- Apenas TI e SUPERADMIN podem criar/editar
- Apenas SUPERADMIN pode excluir

### ✅ Gestão de Cargos
- CRUD completo
- Apenas TI e SUPERADMIN podem criar/editar
- Apenas SUPERADMIN pode excluir

### ✅ Gestão de Usuários
- CRUD de usuários do sistema
- Definição de perfis (SUPERADMIN, TI, RH)
- Apenas SUPERADMIN tem acesso

### ✅ Logs de Auditoria
- Registro de todas as ações importantes
- Apenas SUPERADMIN visualiza
- Exibição de data/hora, usuário e ação

### ✅ Dashboard
- Total de colaboradores
- Total de setores
- Total de cargos
- Acesso rápido aos módulos

---

## 🎯 Performance

### Otimizações Aplicadas

- **Debounce:** Filtros de busca com 300ms de delay
- **DocumentFragment:** Renderização em lote de listas
- **CSS Otimizado:** Transições simplificadas (0.2s ease)
- **Sem backdrop-filter:** Removido blur pesado de modais
- **requestAnimationFrame:** Animações otimizadas

---

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o token JWT está válido
- Faça login novamente

### Erro 403 (Forbidden)
- Usuário não tem permissão para esta ação
- Verifique o perfil do usuário (SUPERADMIN, TI, RH)

### Erro 500 (Internal Server Error)
- Verifique se o backend está rodando
- Consulte os logs do backend

### CORS Error
- Certifique-se de que o backend permite a origem do frontend
- Verifique `SecurityConfigurations.java` no backend

---

## 📝 Licença

© 2025 Grupo Starbank - Sistema Interno

---

## 👥 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de TI.
