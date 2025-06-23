const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Configuração CORS mais permissiva
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));
// Configuração CORS mais permissiva para funcionar com Play with Docker
const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem origin (como Postman) e qualquer origin do Play with Docker
    if (!origin || origin.includes('play-with-docker.com') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

// Middleware que aplica os cabeçalhos de permissão CORS
app.use(cors(corsOptions));

// Middleware adicional para garantir headers CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware para parsing JSON
app.use(express.json());

// Rota para verificar se o serviço está online
app.get('/', (req, res) => {
  console.log('Requisição recebida na rota /');
  res.json({ 
    status: 'Backend está online e funcionando!',
    timestamp: new Date().toISOString(),
    port: port,
    hostname: require('os').hostname()
  });
});

// Rota que fornece os dados da aplicação
app.get('/data', (req, res) => {
  const sampleData = [
    { id: 1, nome: 'Pedro Henrique', idade: 23 },
    { id: 2, nome: 'Mauro', idade: 39 },
    { id: 3, nome: 'Ana Silva', idade: 28 },
    { id: 4, nome: 'Carlos Santos', idade: 35 }
  ];
  res.json(sampleData);
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Tratamento de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Backend rodando na porta ${port}`);
  console.log(`Servidor iniciado em: ${new Date().toISOString()}`);
  console.log(`PID: ${process.pid}`);
  console.log(`Hostname: ${require('os').hostname()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado');
    process.exit(0);
  });
});