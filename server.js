import 'dotenv/config'; // Ensures env vars are loaded before anything else
import connectDB from "./src/config/db.js"
import { app } from './src/app.js';


const startServer = async () => {
    try {
        await connectDB();

        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        });
    } catch (err) {
        console.error('Server startup failed:', err);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received: shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received: shutting down gracefully');
    process.exit(0);
});

startServer();
