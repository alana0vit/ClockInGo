# ⏰ ClockInGo

Sistema simples de batida de ponto online desenvolvido como estudo prático de DevOps utilizando Git Flow e Integração Contínua com GitHub Actions.

---

# Objetivo do Projeto

O projeto foi desenvolvido para demonstrar práticas de:

* Versionamento de código;
* Git Flow;
* Integração Contínua (CI);
* Automação com GitHub Actions;
* Pull Requests;
* Build automatizado;
* Feedback rápido.

O sistema possui funcionalidades simples para permitir foco nas práticas DevOps.

---

# Funcionalidades

* Login
* Home do usuário
* Registro de ponto
* Ajuste de ponto
* Escala

---

# Tecnologias Utilizadas

## Frontend

* Vite
* JavaScript
* CSS

## Backend

* Node.js
* Docker
* PostegreSQL

## DevOps

* Git Flow
* GitHub Actions
* CI Pipeline

---

# Estrutura do Projeto

```text
clockingo/
├── frontend/
├── backend/
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

---

# Pipeline de Integração Contínua

O projeto utiliza GitHub Actions para automação do pipeline.

O workflow é executado automaticamente em:

* push
* pull_request

---

# Como Executar o Projeto

## Clone o repositório

```bash
git clone https://github.com/seu-usuario/clockingo.git
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
npm install
npm start
```

---

# Executando o Pipeline Localmente

## Frontend

```bash
cd frontend
npm run lint
npm run build
npm test
```

## Backend

```bash
cd backend
npm run lint
npm test
```

---

# 👥 Integrantes

* Alana Silva
* João Pedro Carvalho
* Pedro Heleno
