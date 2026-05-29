# Nexus Tech 🚀

**Nexus Tech** é um marketplace de TI de alta performance, projetado para conectar talentos e serviços tecnológicos de elite a oportunidades globais. Construído com uma arquitetura full-stack moderna, a plataforma prioriza uma estética profissional e moderna (dark mode, glassmorfismo), animações fluidas e uma API estruturada.

---

## 👥 Integrantes do Grupo

- **Brendon Russell**
- **Carlos Eduardo**

---

## 🛠 Stack Tecnológica

O projeto foi desenvolvido utilizando uma arquitetura unificada de repositório (monorepo simples), contendo tanto o Frontend quanto o Backend sob a mesma estrutura TypeScript:

### Frontend
- **Framework:** [React](https://reactjs.org/) (com [TypeScript](https://www.typescriptlang.org/)) - Interfaces tipadas e seguras.
- **Build Tool:** [Vite](https://vitejs.dev/) - Hot Module Replacement (HMR) rápido.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) - Design responsivo e moderno.
- **Animações:** [Framer Motion](https://www.framer.com/motion/) - Transições e interações dinâmicas fluidas.
- **Ícones:** [Lucide React](https://lucide.dev/) - Biblioteca de ícones moderna.

### Backend
- **Ambiente/Framework:** [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/) (e [TypeScript](https://www.typescriptlang.org/)).
- **Execução:** `tsx` - Para rodar e assistir mudanças no código TypeScript do servidor em tempo real.
- **Validação de Dados:** [Zod](https://zod.dev/) - Esquemas robustos de validação de dados para as requisições (DTOs).
- **Banco de Dados:** PostgreSQL via Neon - Persistência real preparada para deploy futuro na Vercel.

---

## 📁 Estrutura de Pastas Principal

```text
Nexus-tech-V1/
├── src/
│   ├── api/          # Integração do frontend com a API
│   ├── controllers/  # Controladores da API Express (Lógica de negócios)
│   ├── dtos/         # Data Transfer Objects com esquemas de validação Zod
│   ├── routes/       # Definições de rotas da API Express
│   ├── components/   # Componentes React reutilizáveis
│   ├── pages/        # Telas/Páginas da aplicação React
│   ├── App.tsx       # Configuração de rotas React Router
│   ├── main.tsx      # Ponto de entrada do Frontend
│   └── index.ts      # Servidor Backend (Express)
├── index.html        # Página base HTML do Vite
├── package.json      # Scripts e dependências do projeto
└── tsconfig.json     # Configurações do TypeScript
```

---

## 🚀 Como Executar o Projeto

Para rodar o projeto localmente, siga os passos abaixo. Certifique-se de possuir o **Node.js** instalado em sua máquina.

### 1. Clonar o Repositório e Instalar Dependências

Abra o terminal no diretório do projeto e execute:

```bash
# Instala todas as dependências necessárias para o frontend e backend
npm install
```

### 2. Configurar o Banco Neon

Crie um arquivo `.env` a partir do exemplo e preencha `DATABASE_URL` com a string de conexão do Neon:

```bash
cp .env.example .env
npm run db:migrate
```

### 3. Iniciar o Servidor Backend (API)

O backend é responsável por fornecer as rotas dos produtos, talentos e serviços. Execute o seguinte comando em um terminal:

```bash
npm run dev:api
```

O servidor da API estará ativo em: **`http://localhost:3000`**

Usuário inicial criado pela migração:

- **E-mail:** `brendon@gmail.com`
- **Senha:** `brendon12`
- **Perfil:** Prestador

### 4. Iniciar o Servidor Frontend (Vite)

Em **outro** terminal, inicie o servidor de desenvolvimento do React:

```bash
npm run dev
```

O Vite disponibilizará um link local no terminal (geralmente **`http://localhost:5173`** ou similar). Abra o link no seu navegador para interagir com o Nexus Tech.

---

## 📡 Endpoints Principais da API

A API expõe as seguintes rotas base (porta `3000`):

- **Autenticação:** `/auth/register`, `/auth/login`, `/auth/usuarios`
- **Produtos:** `/produtos` (GET, GET /:id, POST, PUT, PATCH, DELETE)
- **Talentos:** `/talentos` (GET, GET /:id, POST, PUT, PATCH, DELETE)
- **Serviços:** `/servicos` (GET, GET /:id, POST, PUT, PATCH, DELETE)
