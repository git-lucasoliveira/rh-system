# People Manager (StarPeople)

Sistema de Gestão de Pessoas (RH)  
**Stack:** Java 17+, Spring Boot, Spring Security 6, Thymeleaf, SQL Server, JWT, JUnit 5, Mockito

---

## 📌 Contexto do Projeto

O **People Manager (StarPeople)** é um sistema de gestão de pessoas, atualmente em fase avançada de desenvolvimento. Com uma base sólida em Java e Spring Boot, o projeto foi concebido para demonstrar arquitetura robusta, separação clara de responsabilidades, práticas modernas de segurança e capacidade de evolução tecnológica.  
Apesar de plenamente estável e funcional, o sistema ainda não foi publicado em ambiente produtivo.

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para:

- **Evidenciar uma arquitetura backend sólida e escalável**
- Garantir **separação explícita de responsabilidades**
- Aplicar as **melhores práticas de segurança** com tecnologias modernas
- Demonstrar que é possível **evoluir do modelo MVC tradicional para um frontend moderno** rapidamente, sem retrabalho estrutural

---

## 🧠 Decisão Arquitetural Importante

> **Frontend Thymeleaf: uma decisão estratégica**

Atualmente, o sistema utiliza **Thymeleaf** como mecanismo de frontend.  
**Essa escolha não decorre de limitação técnica, mas sim de uma decisão consciente e estratégica:**
- **Estabilidade do backend**: a prioridade foi garantir uma API e modelagem de negócio robustas antes de investir em um frontend mais avançado.
- **Segurança correta e centralizada**: toda a autenticação, autorização e separação de escopos foi validada sob o stack atual.
- **Facilidade de evolução**: o backend foi estruturado desde o início para expor endpoints REST seguros ("/api/**"), facilitando a transição ou coexistência com frontends modernos (ex: React).

> *Uma API confiável e bem arquitetada é pré-requisito para um frontend rico. Priorizamos arquitetura para evitar retrabalho e garantir longevidade ao sistema.*

---

## 🏗️ Estrutura e Arquitetura

O projeto adota **arquitetura em camadas**, com separação explícita de responsabilidades:

- **Controller Layer**
  - Controllers MVC: responsáveis pelo fluxo do Thymeleaf e rotas web tradicionais.
  - Controllers REST: expõem endpoints ("/api/**") para integração futura e consumo externo.
- **Service Layer**
  - Contém a lógica de negócio central, reutilizada por ambos os tipos de controller.
- **Repository Layer**
  - Responsável pelo acesso a dados, abstraindo a persistência.
- **DTOs (Data Transfer Objects)**
  - Utilizados tanto para os controllers REST quanto MVC, favorecendo desacoplamento e segurança dos dados trafegados.

Esse modelo visa **clareza, testabilidade e facilidade de manutenção**, além de preparar a base para evoluções futuras.

---

## 🔐 Segurança

A segurança é um pilar central do projeto, implementada de forma moderna e flexível:

- **Thymeleaf (MVC tradicional)**
  - Autenticação via sessão (form-based), adequada à navegação web clássica.
- **API REST**
  - Autenticação via JWT, possibilitando integrações seguras e escaláveis.
- **Separação de escopos**
  - Rotas públicas e áreas protegidas são claramente segregadas, garantindo o princípio do menor privilégio.

A arquitetura permite expandir os métodos de autenticação conforme a necessidade, mantendo a segurança e governança sobre as informações sensíveis.

---

## 🧪 Testes

O projeto adota uma abordagem consistente de testes desde sua concepção:

- **Testes unitários na camada de serviço**
  - Cobrem as regras de negócio essenciais, utilizando **JUnit 5** e **Mockito**.
- **Testes de integração nos controllers**
  - Verificam fluxos completos, integração e comportamento esperados.
- **Ferramentas**
  - JUnit 5 (testes, assertions e fluxo)
  - Mockito (mocks, stubs e verificação de interações)

Essa preocupação reforça a estabilidade e confiabilidade das entregas.

---

## 🚀 Status do Projeto e Próximos Passos

- **Status atual:**  
  Projeto estável, funcional, cumprindo os requisitos técnicos e de negócio propostos.

- **Próximos passos planejados:**
  - Evolução do frontend, com desenvolvimento de um aplicativo web em React para proporcionar uma experiência de usuário mais rica e desacoplada.
  - Possível deploy em ambiente cloud (em definição).

---

## 📎 Considerações Finais

Este projeto reflete escolhas arquiteturais pensadas visando escalabilidade, segurança e facilidade de manutenção.  
Ao investir numa fundação técnica sólida, garantimos que futuras evoluções (frontend moderno, integrações externas, novos módulos) serão realizadas com agilidade e baixo risco de retrabalho.

---

**Engenharia de software com foco em clareza, evolução e segurança.**

