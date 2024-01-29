require('dotenv').config();

import express from 'express';
import cors from 'cors';
import viewEngineConfig from './config/viewEngine';
import initWebRoutes from './routes/web';

let app = express();

app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

viewEngineConfig(app);

initWebRoutes(app);

let port = process.env.PORT || 7007;

app.listen(port);
