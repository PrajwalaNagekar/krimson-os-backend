import 'dotenv/config'; // Ensures env vars are loaded before anything else
import connectDB from "./src/config/db.js"
import { app } from './src/app.js';
import { seedPermissions } from './src/seeds/seedPermissions.js';
import { seedRoles } from './src/seeds/seedRoles.js';
import { seedAdmin } from './src/seeds/seedAdmin.js';


const startServer = async () => {
    try {
        await connectDB();

        // 🛡️ Automatic Seeding (Idempotent)
        console.log("Starting automatic synchronization...");
        await seedPermissions();
        await seedRoles();
        await seedAdmin();
        console.log("✅ System synchronization complete.");

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
