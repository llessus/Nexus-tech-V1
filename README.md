# Nexus Tech 🚀

**Nexus Tech** é um marketplace de TI de alta performance, projetado para conectar talentos e serviços tecnológicos de elite a oportunidades globais. Construído com uma arquitetura full-stack moderna, a plataforma prioriza uma estética profissional e moderna (dark mode, glassmorfismo), animações fluidas e uma API estruturada.

---

## 👥 Integrantes do Grupo

- **Brendon Russell**
- **Carlos Eduardo**

---

## 🛠 Stack Tecnológica

O projeto foi desenvolvido utilizando uma arquitetura unificada de repositório (monorepo simples), contendo tanto o Frontend quanto o Backend sob a mesma estrutura:

### Frontend (Cliente)
- **Framework:** [React](https://reactjs.org/) (com [TypeScript](https://www.typescriptlang.org/)) - Interfaces tipadas e seguras.
- **Build Tool:** [Vite](https://vitejs.dev/) - Hot Module Replacement (HMR) rápido.
- **Estilização:** CSS Vanilla com design responsivo, transições modernas e tema Dark Mode.
- **Animações:** [Framer Motion](https://www.framer.com/motion/) - Transições e interações dinâmicas fluidas.
- **Ícones:** [Lucide React](https://lucide.dev/) - Biblioteca de ícones moderna.

### Backend (API)
- **Ambiente/Framework:** [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions) com `@vercel/node` e TypeScript.
- **Validação de Dados:** [Zod](https://zod.dev/) - Esquemas robustos de validação de dados para as requisições (DTOs).
- **Banco de Dados:** PostgreSQL hospedado no [Neon Database](https://neon.tech/) (conexão serverless via `@neondatabase/serverless`).

---

## 📁 Estrutura de Pastas Principal

```text
Nexus-tech-V1/
├── api/                  # Backend: Endpoints das Serverless Functions da Vercel
│   ├── auth.ts           # Login, registro, busca e edição de usuários
│   ├── produtos.ts       # CRUD completo de produtos
│   ├── talentos.ts       # CRUD e filtros de prestadores de serviços (talentos)
│   └── ...               # Outros endpoints de negócio e upload
├── src/                  # Frontend & Lógica compartilhada do banco de dados
│   ├── api/              # Chamadas HTTP do frontend para as rotas do backend
│   ├── components/       # Componentes React reutilizáveis (Navbar, Topbar, etc.)
│   ├── database/         # Cliente PostgreSQL (Neon) e arquivos de migração
│   ├── dtos/             # Schemas de validação de dados com Zod (Zod DTOs)
│   ├── pages/            # Páginas/Telas do app (Login, Cadastro, Dashboards, etc.)
│   ├── repositories/     # Camada de banco de dados (Consultas SQL nativas)
│   ├── utils/            # Utilitários auxiliares (ex: hash e validação de senhas com PBKDF2)
│   ├── App.tsx           # Gerenciamento de rotas com React Router
│   └── main.tsx          # Ponto de entrada do Frontend
├── vercel.json           # Configuração de rewrites de rotas para a Vercel
├── vite.config.ts        # Configuração do Vite e proxy reverso local da API
├── package.json          # Dependências e scripts do projeto
└── README.md             # Instruções do projeto
```

---

## 🚀 Como Executar o Projeto Localmente

Para rodar o projeto localmente, siga os passos abaixo. Certifique-se de possuir o **Node.js** instalado em sua máquina.

### 1. Instalar as Dependências

Abra o terminal no diretório do projeto e execute:

```bash
npm install
```

### 2. Configurar as Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto contendo a string de conexão com o banco Neon Database (você pode se basear no `.env.example`):

```env
DATABASE_URL="postgres://usuario:senha@host-neon/dbname?sslmode=require"
```

### 3. Rodar as Migrações do Banco de Dados

Para criar as tabelas e dados iniciais no banco PostgreSQL do Neon, inicie a aplicação localmente (passo 4) e faça uma requisição do tipo **POST** para a rota `/api/db-migrate` (usando Postman, Insomnia ou similar):

* **URL:** `http://localhost:3000/api/db-migrate`
* **Método:** `POST`

Isso executará o script de migração contido no banco de dados e preparará a estrutura das tabelas.

### 4. Iniciar a Aplicação (Front e Back)

Como o backend utiliza Serverless Functions da Vercel, a melhor forma de rodar o projeto localmente com as rotas do backend integradas é usando o servidor de desenvolvimento da **Vercel CLI**:

```bash
npx vercel dev
```

O servidor da Vercel iniciará e disponibilizará o link no terminal (geralmente **`http://localhost:3000`**).
A Vercel cuidará automaticamente de rodar o frontend React e servir os endpoints de `/api/*`.

---

## 📡 Endpoints Principais da API

A API expõe as seguintes rotas base:

* **Autenticação:**
  * `POST /api/auth/register` - Cadastro de novos usuários
  * `POST /api/auth/login` - Login e criação de sessão (localStorage)
  * `PUT /api/auth/perfil` - Atualização de perfil do usuário logado
* **Produtos:**
  * `GET /api/produtos` - Listagem de produtos
  * `POST /api/produtos` - Cadastro de novos produtos
  * `GET /api/produtos/:id` - Detalhes de um produto
  * `PUT/PATCH /api/produtos/:id` - Atualização de produto
  * `DELETE /api/produtos/:id` - Remoção de produto
* **Talentos / Prestadores:**
  * `GET /api/talentos` - Listar e filtrar talentos/prestadores
* **Contratações:**
  * `POST /api/contratacoes` - Registrar nova contratação
  * `GET /api/contratacoes` - Histórico de serviços contratados



