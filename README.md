# 🎯 LORHS - Lucas Oliveira RH System

> **Gestão Inteligente de Pessoas**

Sistema completo de **Gestão de Recursos Humanos** desenvolvido com **Spring Boot** (Backend) e **JavaScript Vanilla** (Frontend). Solução moderna e robusta para gerenciamento de colaboradores, setores, cargos e auditoria.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Java 17** com Spring Boot 3.x
- **Spring Security** + JWT para autenticação
- **JPA/Hibernate** para ORM
- **SQL Server** como banco de dados
- **Swagger/OpenAPI** para documentação da API
- **Lombok** para redução de boilerplate
- **Bean Validation** para validações

### Frontend
- **HTML5**, **CSS3**, **JavaScript (ES6+)**
- **Bootstrap 5.3** para UI responsiva
- **Bootstrap Icons** para iconografia
- **Fetch API** para requisições HTTP
- **LocalStorage** para gerenciamento de sessão

---

## ✨ Funcionalidades

### 👥 Gestão de Colaboradores
- ✅ Cadastro completo (dados pessoais, contato, cargo, setor)
- ✅ Listagem com filtros avançados (nome, setor, status)
- ✅ Edição e exclusão
- ✅ Controle de status (Ativo/Inativo)
- ✅ Validações de CPF e e-mail

### 🏢 Gestão de Setores
- ✅ Criação de departamentos
- ✅ Listagem em cards visuais
- ✅ Edição e exclusão

### 💼 Gestão de Cargos
- ✅ Cadastro de funções
- ✅ Descrição detalhada
- ✅ Vinculação com colaboradores

### 🔐 Autenticação e Segurança
- ✅ Login com JWT Token
- ✅ Controle de sessão
- ✅ Perfis de acesso (ADMIN e USER)
- ✅ Proteção de rotas

### 📊 Dashboard
- ✅ Estatísticas em tempo real
- ✅ Total de colaboradores, setores e cargos
- ✅ Ações rápidas

### 📝 Auditoria
- ✅ Logs de todas as ações (CRUD)
- ✅ Rastreamento de usuário e timestamp
- ✅ Histórico completo do sistema

### 👤 Perfil do Usuário
- ✅ Visualização de dados da conta
- ✅ Alteração de senha
- ✅ Segurança por senha atual

---

## 📦 Instalação e Configuração

### Pré-requisitos
- **Java 17+** instalado
- **Maven 3.8+** instalado
- **SQL Server** (local ou remoto)
- **Node.js** (apenas se usar servidor local para o frontend)

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/lorhs.git
cd lorhs
```

### 2️⃣ Configurar Banco de Dados

**Criar o banco no SQL Server:**
```sql
CREATE DATABASE StarPeopleDB;
GO
```

**Editar `Backend/src/main/resources/application-local.properties`:**
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=StarPeopleDB;encrypt=true;trustServerCertificate=true;
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# JWT Secret (Gerar uma chave segura)
api.security.token.secret=SUA_CHAVE_SECRETA_AQUI_64_CARACTERES_MINIMO
```

### 3️⃣ Executar o Backend
```bash
cd Backend
mvn clean install
mvn spring-boot:run
```

A API estará disponível em: **http://localhost:8080**

Documentação Swagger: **http://localhost:8080/swagger-ui.html**

### 4️⃣ Executar o Frontend

**Opção 1: Live Server (VS Code)**
1. Instale a extensão **Live Server**
2. Abra `FrontEnd/index.html`
3. Clique em **Go Live** (canto inferior direito)

**Opção 2: Servidor Python**
```bash
cd FrontEnd
python -m http.server 5500
```

Acesse: **http://localhost:5500**

---

## 🔑 Credenciais Padrão

Ao iniciar o sistema pela primeira vez, um usuário admin é criado automaticamente:

```
Usuário: admin
Senha: admin123
```

⚠️ **IMPORTANTE**: Altere a senha padrão imediatamente após o primeiro login!

---

## 📁 Estrutura do Projeto

```
rh-system/
├── Backend/
│   ├── src/main/java/com/starcard/starpeople/
│   │   ├── config/          # Configurações (Security, CORS, Dados iniciais)
│   │   ├── controller/      # Controllers REST
│   │   ├── model/           # Entidades JPA
│   │   ├── repository/      # Repositories Spring Data
│   │   ├── service/         # Lógica de negócio
│   │   └── dto/             # DTOs e Records
│   └── src/main/resources/
│       ├── application.properties
│       └── application-local.properties
│
└── FrontEnd/
    ├── index.html           # Login
    ├── home.html            # Dashboard
    ├── funcionarios.html    # Lista de colaboradores
    ├── setores.html         # Gestão de setores
    ├── cargos.html          # Gestão de cargos
    ├── logs.html            # Auditoria
    ├── perfil.html          # Perfil do usuário
    └── assets/
        ├── css/
        │   ├── styles.css            # Estilos principais
        │   ├── components-extra.css  # Componentes extras
        │   └── notifications.css     # Sistema de toasts
        └── js/
            ├── app.js                # Global (navbar, auth)
            ├── login.js              # Autenticação
            ├── home.js               # Dashboard
            ├── funcionarios.js       # CRUD colaboradores
            ├── setores.js            # CRUD setores
            ├── cargos.js             # CRUD cargos
            └── notifications.js      # Sistema de notificações
```

---

## 🎨 Paleta de Cores (Tema Azul Premium)

```css
Primária:     #0ea5e9 (Azul Céu)
Secundária:   #22d3ee (Ciano)
Sucesso:      #10b981 (Verde)
Perigo:       #ef4444 (Vermelho)
Fundo Dark:   #050b1a (Azul Escuro)
Cards:        #0f1e35 (Azul Médio)
```

---

## 🔐 Endpoints da API

### Autenticação
- `POST /auth/login` - Login (retorna JWT)
- `POST /auth/register` - Registro de novo usuário

### Colaboradores
- `GET /api/funcionarios` - Listar todos
- `GET /api/funcionarios/{id}` - Buscar por ID
- `POST /api/funcionarios` - Criar novo
- `PUT /api/funcionarios/{id}` - Atualizar
- `DELETE /api/funcionarios/{id}` - Deletar

### Setores
- `GET /api/setores` - Listar todos
- `POST /api/setores` - Criar novo
- `PUT /api/setores/{id}` - Atualizar
- `DELETE /api/setores/{id}` - Deletar

### Cargos
- `GET /api/cargos` - Listar todos
- `POST /api/cargos` - Criar novo
- `PUT /api/cargos/{id}` - Atualizar
- `DELETE /api/cargos/{id}` - Deletar

### Logs
- `GET /api/logs` - Histórico de auditoria

---

## 🛠️ Melhorias Futuras

- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Dashboard com gráficos (Chart.js)
- [ ] Sistema de notificações em tempo real (WebSocket)
- [ ] Upload de foto de perfil para colaboradores
- [ ] Gestão de férias e folgas
- [ ] Controle de ponto eletrônico
- [ ] Integração com e-mail (SMTP)
- [ ] Testes unitários (JUnit + Mockito)
- [ ] Deploy em produção (Docker + Kubernetes)

---

## 📄 Licença

Este projeto é de propriedade de **Lucas Oliveira** e destina-se a fins educacionais e comerciais.

---

## 👨‍💻 Desenvolvedor

**Lucas Oliveira**  
Sistema desenvolvido como projeto pessoal de gestão de RH.

---

## 🆘 Suporte

Para dúvidas ou sugestões, entre em contato:
- 📧 E-mail: seu-email@exemplo.com
- 💼 LinkedIn: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)
- 🐙 GitHub: [Seu GitHub](https://github.com/seu-usuario)

---

<div align="center">
  <strong>LORHS v2.0</strong> - Gestão Inteligente de Pessoas 🎯
  <br>
  &copy; 2025 Lucas Oliveira | Todos os direitos reservados
</div>
