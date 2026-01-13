import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/form.routes';
import categoryRoutes from './routes/category.routes';
import communityTypeRoutes from './routes/communityType.routes';

// Carregar variáveis de ambiente
dotenv.config();

const app: Express = express();

// Middlewares globais
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parser de JSON no body
app.use(express.urlencoded({ extended: true })); // Parser de URL-encoded

// Rota de health check
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Form API - Backend está rodando! ✅',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// Rotas da API
app.use('/api/forms', formRoutes);
app.use('/api', categoryRoutes);
app.use('/api/community-types', communityTypeRoutes);

// Rota 404 - não encontrada
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada',
        path: req.path,
    });
});

export default app;