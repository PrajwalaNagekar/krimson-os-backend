/**
 * File: src/models/ITAdminSchema.js
 * Purpose: System uptime, security & infrastructure management
 * Linked To: User (1:1)
 * BRD Ref: IT Administrator Dashboard
 */

import mongoose from 'mongoose';

const ITAdminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    access_level: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },

    can_manage_servers: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

export default mongoose.model('ITAdmin', ITAdminSchema);
