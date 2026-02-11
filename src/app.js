import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.routes.js';
import errorHandler from './middlewares/errorMiddleware.js';


const app = express();

// -------------------- CORS --------------------
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    })
);

// -------------------- Middleware --------------------
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

// -------------------- Routes --------------------
app.use('/api/v1', routes);

app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is working! 🚀',
        timestamp: new Date().toISOString(),
    });
});

// -------------------- Global Error Handler --------------------
app.use(errorHandler);



export { app };
