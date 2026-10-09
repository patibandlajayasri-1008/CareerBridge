import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';

/**
 * Controlled Bootstrap Script for Initial Placement Administrator Account
 * Usage: node src/utils/seedAdmin.js
 */
const seedAdmin = async () => {
  console.log('Connecting to database for administrator initialization...');
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@careerbridge.edu';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Placement2026';
  const adminName = process.env.ADMIN_NAME || 'Placement Cell Administrator';

  try {
    const existing = await User.findOne({ email: adminEmail.toLowerCase() });

    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`Updated existing user (${adminEmail}) to 'admin' role.`);
      } else {
        console.log(`Administrator account already active: ${adminEmail}`);
      }
    } else {
      await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
        college: 'Central Placement Directorate',
      });
      console.log(`New Administrator account successfully provisioned: ${adminEmail}`);
    }

    console.log('Admin provisioning complete.');
  } catch (error) {
    console.error('Failed to seed administrator account:', error.message);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

seedAdmin();
