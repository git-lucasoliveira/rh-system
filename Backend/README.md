# 💼 LORHS - Backend

**Lucas Oliveira RH System** - API REST para Sistema de Gestão de RH desenvolvida com **Spring Boot 3** e **SQL Server**.

---

## 🚀 Tecnologias Utilizadas

- **Java 17+** - Linguagem de programação
- **Spring Boot 3.x** - Framework principal
- **Spring Security 6** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **Hibernate** - ORM (Object-Relational Mapping)
- **SQL Server** - Banco de dados relacional
- **JWT (JSON Web Token)** - Autenticação stateless
- **Lombok** - Redução de código boilerplate
- **Bean Validation** - Validação de dados
- **BCrypt** - Criptografia de senhas

---

## 📂 Estrutura do Projeto

```
Backend/
├── src/main/java/com/lorhs/system/
│   ├── config/
│   │   ├── SecurityConfigurations.java  # Configuração de segurança
│   │   └── SecurityFilter.java          # Filtro JWT personalizado
│   ├── controller/
│   │   └── api/
│   │       ├── ApiAuthController.java        # Autenticação (login)
│   │       ├── ApiFuncionarioController.java # CRUD Funcionários
│   │       ├── ApiSetorController.java       # CRUD Setores
│   │       ├── ApiCargoController.java       # CRUD Cargos
│   │       ├── ApiLogController.java         # Logs de auditoria
│   │       └── ApiUsuarioController.java     # CRUD Usuários
│   ├── model/
│   │   ├── Funcionario.java   # Entidade Colaborador
│   │   ├── Setor.java         # Entidade Setor
│   │   ├── Cargo.java         # Entidade Cargo
│   │   ├── Usuario.java       # Entidade Usuário do Sistema
│   │   └── LogSistema.java    # Entidade Log de Auditoria
│   ├── dto/
│   │   └── FuncionarioDTO.java # Data Transfer Object
│   ├── repository/
│   │   ├── FuncionarioRepository.java
│   │   ├── SetorRepository.java
│   │   ├── CargoRepository.java
│   │   ├── UsuarioRepository.java
│   │   └── LogRepository.java
│   ├── service/
│   │   ├── FuncionarioService.java  # Lógica de negócio
│   │   ├── LogService.java          # Serviço de auditoria
│   │   ├── TokenService.java        # Geração/validação JWT
│   │   └── AuthService.java         # Autenticação
│   └── LorhsApplication.java        # Classe principal
├── src/main/resources/
│   ├── application.properties        # Configuração geral
│   ├── application-local.properties  # Credenciais locais (gitignored)
│   └── application-prod.properties   # Configuração de produção
└── pom.xml                           # Dependências Maven
```

---

## ⚙️ Configuração

### 1. Banco de Dados (SQL Server)

#### Criar o Database

```sql
CREATE DATABASE GestaoUsuarios_Clone;
GO

USE GestaoUsuarios_Clone;
GO
```

#### Tabelas Necessárias

```sql
-- Tabela de Setores
CREATE TABLE setores (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    nome_setor NVARCHAR(100) NOT NULL
);

-- Tabela de Cargos
CREATE TABLE cargos (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    nome_cargo NVARCHAR(100) NOT NULL
);

-- Tabela de Funcionários
CREATE TABLE funcionarios (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    nome_completo NVARCHAR(255) NOT NULL,
    email_principal NVARCHAR(255),
    cpf NVARCHAR(14),
    data_admissao DATE,
    ativo BIT DEFAULT 1,
    data_criacao DATETIME2 DEFAULT GETDATE(),
    id_setor BIGINT,
    id_cargo BIGINT,
    FOREIGN KEY (id_setor) REFERENCES setores(id),
    FOREIGN KEY (id_cargo) REFERENCES cargos(id)
);

-- Tabela de Usuários do Sistema
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    login NVARCHAR(50) NOT NULL UNIQUE,
    senha NVARCHAR(255) NOT NULL,
    perfil NVARCHAR(20) NOT NULL,
    ativo BIT DEFAULT 1
);

-- Tabela de Logs de Auditoria
CREATE TABLE log_sistema (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    usuario NVARCHAR(100),
    acao NVARCHAR(MAX),
    data_hora DATETIME2 DEFAULT GETDATE()
);
```

#### Dados Iniciais (Seeds)

```sql
-- Usuários padrão (senhas criptografadas com BCrypt)
-- ⚠️ ATENÇÃO: Trocar senhas em produção!
INSERT INTO usuarios (login, senha, perfil, ativo) VALUES
('admin', '$2a$10$XpDQZJ8EKV8K3LXYfS0PV.7H6K7kzEJiQXqF4pL0K8YfS0PV.7H6K', 'SUPERADMIN', 1),
('ti', '$2a$10$XpDQZJ8EKV8K3LXYfS0PV.7H6K7kzEJiQXqF4pL0K8YfS0PV.7H6K', 'TI', 1),
('rh', '$2a$10$XpDQZJ8EKV8K3LXYfS0PV.7H6K7kzEJiQXqF4pL0K8YfS0PV.7H6K', 'RH', 1);

-- Setores
INSERT INTO setores (nome_setor) VALUES
('TI'),
('RH'),
('Financeiro'),
('Comercial');

-- Cargos
INSERT INTO cargos (nome_cargo) VALUES
('Desenvolvedor'),
('Analista de RH'),
('Gerente'),
('Assistente');
```

**🔒 Senha padrão (apenas desenvolvimento):** `admin123`

**⚠️ SEGURANÇA:**
- Essas senhas são APENAS para desenvolvimento/testes
- OBRIGATÓRIO trocar senhas em ambiente de produção
- Usar senhas fortes e únicas para cada usuário
- Considerar autenticação via Active Directory em produção

### 2. Variáveis de Ambiente

#### application.properties

```properties
# Profile ativo
spring.profiles.active=local

# Configurações do Servidor
server.port=8080

# Datasource
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=GestaoUsuarios_Clone;encrypt=false;trustServerCertificate=true
spring.datasource.driverClassName=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA/Hibernate
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
spring.jpa.properties.hibernate.format_sql=true
```

#### application-local.properties (⚠️ NUNCA COMMITAR NO GIT!)

```properties
# Credenciais do Banco de Dados
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# JWT Secret Key
# ⚠️ ATENÇÃO: Gerar chave forte e única para produção!
# Exemplo: use um gerador de senhas com 64+ caracteres
api.security.token.secret=SUBSTITUA_POR_CHAVE_SEGURA_UNICA
```

**🔒 IMPORTANTE - SEGURANÇA:**
- Este arquivo contém credenciais REAIS
- NUNCA commitar no Git
- Gerar secret JWT diferente para cada ambiente
- Usar senhas fortes no banco de dados
- Verificar se está no `.gitignore`

### 3. .gitignore (⚠️ CRÍTICO PARA SEGURANÇA)

```gitignore
# ⚠️ CREDENCIAIS SENSÍVEIS - NUNCA COMMITAR!
application-local.properties
application-prod.properties
.env
*.key
*.pem

# Build
target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

# IDE
.idea/
*.iws
*.iml
*.ipr
.vscode/
```

**🔒 VERIFICAR ANTES DE COMMITAR:**
```bash
# Verificar se arquivos sensíveis estão ignorados
git status

# Se aparecer application-local.properties, NÃO COMMITAR!
```

---

## 🔧 Instalação e Execução

### 1. Pré-requisitos

- **Java 17+** instalado
- **Maven 3.6+** instalado
- **SQL Server** rodando (localhost:1433)
- Database `GestaoUsuarios_Clone` criado

### 2. Clonar e Configurar

```bash
# Navegar até o diretório do backend
cd Backend

# Criar arquivo de credenciais locais
cp src/main/resources/application.properties src/main/resources/application-local.properties

# Editar application-local.properties com suas credenciais
```

### 3. Compilar e Executar

```bash
# Limpar e compilar
mvn clean install

# Executar aplicação
mvn spring-boot:run
```

**Ou via IDE (IntelliJ IDEA):**
1. Abrir o projeto Backend
2. Aguardar o Maven baixar as dependências
3. Executar `LorhsApplication.java`

### 4. Verificar

Acesse: `http://localhost:8080`

Se retornar **403 Forbidden**, está funcionando! (Não há rota raiz configurada)

---

## 🔐 Segurança e Autenticação

### JWT (JSON Web Token)

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "login": "admin",
  "senha": "admin123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTdGFyUGVvcGxlIEFQSSIsInN1YiI6ImFkbWluIiwicGVyZmlsIjoiU1VQRVJBRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDA3MjAwfQ.xxxxx"
}
```

*⚠️ Este token é um EXEMPLO ilustrativo. Tokens reais são gerados dinamicamente e expiram em 2 horas.*

#### Usando o Token

Todas as requisições protegidas devem incluir o header:

```
Authorization: Bearer {token}
```

### Perfis de Acesso

| Perfil | Permissões |
|--------|-----------|
| **SUPERADMIN** | Acesso total (CRUD em tudo, logs, usuários) |
| **TI** | CRUD Funcionários, Setores, Cargos (exceto DELETE) |
| **RH** | GET e PUT em Funcionários, GET em Setores/Cargos |

---

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login e geração de token | ❌ Público |

### Funcionários

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/api/funcionarios` | Listar todos | RH, TI, SUPERADMIN |
| GET | `/api/funcionarios/{id}` | Buscar por ID | RH, TI, SUPERADMIN |
| POST | `/api/funcionarios` | Criar novo | TI, SUPERADMIN |
| PUT | `/api/funcionarios/{id}` | Atualizar | RH, TI, SUPERADMIN |
| DELETE | `/api/funcionarios/{id}` | Excluir | SUPERADMIN |

### Setores

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/api/setores` | Listar todos | RH, TI, SUPERADMIN |
| GET | `/api/setores/{id}` | Buscar por ID | RH, TI, SUPERADMIN |
| POST | `/api/setores` | Criar novo | TI, SUPERADMIN |
| PUT | `/api/setores/{id}` | Atualizar | TI, SUPERADMIN |
| DELETE | `/api/setores/{id}` | Excluir | SUPERADMIN |

### Cargos

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/api/cargos` | Listar todos | RH, TI, SUPERADMIN |
| GET | `/api/cargos/{id}` | Buscar por ID | RH, TI, SUPERADMIN |
| POST | `/api/cargos` | Criar novo | TI, SUPERADMIN |
| PUT | `/api/cargos/{id}` | Atualizar | TI, SUPERADMIN |
| DELETE | `/api/cargos/{id}` | Excluir | SUPERADMIN |

### Usuários do Sistema

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/api/usuarios` | Listar todos | SUPERADMIN |
| GET | `/api/usuarios/{id}` | Buscar por ID | SUPERADMIN |
| POST | `/api/usuarios` | Criar novo | SUPERADMIN |
| PUT | `/api/usuarios/{id}` | Atualizar | SUPERADMIN |
| DELETE | `/api/usuarios/{id}` | Excluir | SUPERADMIN |

### Logs de Auditoria

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/api/logs` | Listar todos os logs | SUPERADMIN |

---

## 🔍 Exemplos de Requisições

### Criar Funcionário

```http
POST /api/funcionarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao.silva@empresa.com",
  "dataAdmissao": "2025-01-15",
  "ativo": true,
  "setor": {
    "id": 1
  },
  "cargo": {
    "id": 2
  }
}
```

### Atualizar Status de Funcionário

```http
PUT /api/funcionarios/10
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao.silva@empresa.com",
  "dataAdmissao": "2025-01-15",
  "ativo": false,
  "setor": {
    "id": 1
  },
  "cargo": {
    "id": 2
  }
}
```

---

## 📊 Logs de Auditoria

O sistema registra automaticamente:

- ✅ Login de usuários
- ✅ Criação de funcionários
- ✅ Edição de funcionários
- ✅ Exclusão definitiva de funcionários
- ✅ Alteração de status (ativo/inativo)

**Formato do log:**
```
[ADMIN] criou novo colaborador: João Silva (ID: 15) em 25/12/2025 15:30
```

---

## 🚨 Tratamento de Erros

| Código | Descrição | Causa |
|--------|-----------|-------|
| **400** | Bad Request | Dados inválidos ou malformados |
| **401** | Unauthorized | Token ausente ou inválido |
| **403** | Forbidden | Usuário sem permissão |
| **404** | Not Found | Recurso não encontrado |
| **500** | Internal Server Error | Erro no servidor |

---

## 🧪 Testes

### Validar Autenticação

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"admin123"}'
```

### Validar CRUD

```bash
# Listar funcionários
curl -X GET http://localhost:8080/api/funcionarios \
  -H "Authorization: Bearer {seu_token}"
```

---

## 🔄 CORS

O backend permite requisições das seguintes origens:

```java
http://127.0.0.1:5500
http://localhost:5500
http://localhost:8080
```

Para adicionar novas origens, edite `SecurityConfigurations.java`:

```java
config.setAllowedOrigins(List.of(
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://seudominio.com"  // Nova origem
));
```

---

## 📦 Dependências Principais (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- SQL Server Driver -->
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>java-jwt</artifactId>
        <version>4.4.0</version>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

---

## 🐛 Troubleshooting

### Erro: "Cannot create PoolableConnectionFactory"

**Causa:** SQL Server não está rodando ou credenciais incorretas

**Solução:**
1. Verificar se SQL Server está ativo
2. Conferir `application-local.properties`
3. Testar conexão via SQL Server Management Studio

### Erro: "Table 'xxx' doesn't exist"

**Causa:** Hibernate não criou as tabelas automaticamente

**Solução:**
1. Executar scripts SQL manualmente
2. Ou configurar `spring.jpa.hibernate.ddl-auto=create` (cuidado, apaga dados!)

### Erro 403 em todas requisições

**Causa:** Token JWT inválido ou expirado

**Solução:**
1. Fazer login novamente
2. Verificar se `api.security.token.secret` está configurado

---

## 📝 Licença

© 2025 Grupo Starbank - Sistema Interno

---

## 👥 Equipe de Desenvolvimento

Para dúvidas ou suporte, entre em contato com a equipe de TI.
