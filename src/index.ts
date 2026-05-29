import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import produtoRoutes from './routes/produto.routes';
import talentoRoutes from './routes/talento.routes';
import servicoRoutes from './routes/servico.routes';
import authRoutes from './routes/auth.routes';
import contratacaoRoutes from './routes/contratacao.routes';
import mensagemRoutes from './routes/mensagem.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/talentos', talentoRoutes);
app.use('/servicos', servicoRoutes);
app.use('/contratacoes', contratacaoRoutes);
app.use('/mensagens', mensagemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
