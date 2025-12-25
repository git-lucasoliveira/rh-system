#  StarPeople - Sistema de Gestão de Pessoas

Sistema completo de gestão de colaboradores desenvolvido para o **Grupo Starbank**, com arquitetura full-stack moderna e segura.

---

##  Sobre o Projeto

**StarPeople** é uma aplicação corporativa para gestão completa de recursos humanos, incluindo:

-  **Gestão de Colaboradores** - Cadastro, edição, inativação e exclusão  
-  **Organização Empresarial** - Setores e cargos  
-  **Controle de Acesso** - Sistema de autenticação com 3 perfis (SUPERADMIN, TI, RH)  
-  **Auditoria** - Logs completos de todas as operações  
-  **Interface Moderna** - Design responsivo e intuitivo  
-  **Performance Otimizada** - Requisições rápidas e UX fluida

---

##  Arquitetura do Sistema

```
StarPeople-Sistema/

 Backend/                    # API REST - Spring Boot
    src/main/java/
       com/starcard/starpeople/
           config/         # Segurança e configurações
           controller/     # Endpoints REST
           model/          # Entidades JPA
           repository/     # Acesso a dados
           service/        # Lógica de negócio
           dto/            # Data Transfer Objects
    README.md              #  Documentação Backend

 Frontend/                   # SPA - Vanilla JavaScript
    *.html                 # Páginas da aplicação
    assets/
       css/               # Estilos (CSS Variables)
       js/                # Lógica JavaScript
    README.md              #  Documentação Frontend

 README.md                  #  Este arquivo (Visão Geral)
```

---

##  Stack Tecnológica

### Backend (API REST)
- Java 17+
- Spring Boot 3.x
- Spring Security 6.x  
- Spring Data JPA
- SQL Server
- JWT Authentication
- Lombok

### Frontend (SPA)
- HTML5 + CSS3
- JavaScript (Vanilla ES6+)
- Bootstrap 5.3.0
- Bootstrap Icons 1.11.3

---

##  Funcionalidades Principais

###  Gestão de Colaboradores
-  Cadastro completo (nome, CPF, email, data admissão)
-  Edição de dados cadastrais
-  Inativação/Ativação de colaboradores  
-  Exclusão definitiva (apenas SUPERADMIN)
-  Filtros avançados (nome, setor, status)
-  Validação de CPF e email

###  Gestão Organizacional
-  CRUD de Setores
-  CRUD de Cargos
-  Permissões por perfil

###  Controle de Acesso

| Perfil | Permissões |
|--------|-----------|
| **SUPERADMIN**  | Acesso total: CRUD em tudo, logs, usuários |
| **TI**  | CRUD Funcionários/Setores/Cargos (exceto DELETE Setor/Cargo) |
| **RH**  | GET e PUT em Funcionários, GET em Setores/Cargos |

###  Logs de Auditoria
- Registro de todas as operações críticas
- Identificação do usuário responsável
- Data e hora precisas
- Visualização apenas para SUPERADMIN

---

##  Instalação Rápida

### Pré-requisitos
- Java 17+
- Maven 3.6+
- SQL Server (localhost:1433)
- Navegador moderno

### 1. Backend

```bash
cd Backend
# Configurar application-local.properties com suas credenciais
mvn clean install
mvn spring-boot:run
```

 Rodando em: http://localhost:8080

### 2. Frontend

```bash
cd Frontend
# Abrir com Live Server ou: python -m http.server 5500
```

 Rodando em: http://localhost:5500

### 3. Login Padrão (desenvolvimento)
- **Login:** admin
- **Senha:** admin123

---

##  Documentação Detalhada

-  [Backend README](./Backend/README.md) - API, endpoints, segurança, banco de dados
-  [Frontend README](./Frontend/README.md) - Componentes, estrutura, notificações

---

##  Segurança

### Medidas Implementadas
-  Autenticação JWT (2h de expiração)
-  Senhas criptografadas com BCrypt
-  CORS configurado
-  Autorização baseada em perfis
-  Validação de dados (frontend + backend)
-  Logs de auditoria
-  Proteção contra SQL Injection
-  XSS Prevention

###  Checklist de Produção
- [ ] Trocar senhas padrão
- [ ] Gerar JWT secret único (64+ caracteres)
- [ ] Configurar HTTPS/SSL
- [ ] Implementar rate limiting
- [ ] Backup automático do banco
- [ ] Política de rotação de senhas

---

##  Design System

### Paleta de Cores
- **Fundo Principal:** #0a0e27
- **Fundo Secundário:** #1a1f3a
- **Azul Primário:** #3b82f6
- **Roxo Secundário:** #8b5cf6
- **Verde Sucesso:** #10b981
- **Vermelho Erro:** #ef4444

### Tipografia
- **Fonte:** Inter (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700, 800

---

##  Performance

### Otimizações
-  Transições CSS simplificadas (0.2s ease)
-  Animações com requestAnimationFrame
-  Debounce em filtros (300ms)
-  Renderização em lote (DocumentFragment)
-  Removido backdrop-filter blur pesado

**Resultado:** ~60 FPS constante, interface fluida

---

##  Estrutura do Banco de Dados

```
funcionarios  setores
             cargos

usuarios (login, senha, perfil)
log_sistema (usuario, acao, data_hora)
```

---

##  Testes

### Funcionalidades Validadas
- [x] Autenticação e autorização
- [x] CRUD completo de colaboradores
- [x] CRUD de setores e cargos
- [x] Filtros e busca
- [x] Validações (CPF, email)
- [x] Sistema de notificações
- [x] Logs de auditoria
- [x] Permissões por perfil

---

##  Troubleshooting

### Backend não inicia
**Erro:** Cannot create PoolableConnectionFactory  
**Solução:** Verificar SQL Server rodando e credenciais em application-local.properties

### Frontend 401/403
**Erro:** Unauthorized/Forbidden  
**Solução:** Fazer login novamente ou verificar permissões do usuário

### CORS Error
**Solução:** Verificar SecurityConfigurations.java  corsConfigurationSource()

---

##  Roadmap Futuro

- [ ] Dashboard com gráficos
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Gestão de férias e licenças
- [ ] Upload de foto de perfil
- [ ] Integração com Active Directory
- [ ] App mobile (React Native)
- [ ] Modo claro (light theme)

---

##  Licença

© 2025 Grupo Starbank - Sistema Interno

**Uso Restrito:** Propriedade do Grupo Starbank, destinado exclusivamente ao uso interno.

---

##  Equipe

**Desenvolvimento:** Equipe de TI - Grupo Starbank  
**Suporte:** ti@starbank.com.br  
**Versão:** 1.0.0  
**Data:** Dezembro 2025

---

**Feito com  pela equipe de TI do Grupo Starbank**
