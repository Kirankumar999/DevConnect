// Script to seed dummy users into the database
// Run: node seed-users.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./src/config/database');
const User = require('./src/models/user');
const dummyUsers = require('./dummy-users.json');

async function seedUsers() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        
        // Clear existing users (optional - comment out if you want to keep existing data)
        // await User.deleteMany({});
        // console.log('Cleared existing users');
        
        let created = 0;
        let skipped = 0;
        
        for (const userData of dummyUsers) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ emailId: userData.emailId.toLowerCase() });
                if (existingUser) {
                    console.log(`User ${userData.emailId} already exists, skipping...`);
                    skipped++;
                    continue;
                }
                
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);
                
                // Create user
                const user = new User({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    emailId: userData.emailId.toLowerCase(),
                    password: hashedPassword
                });
                
                await user.save();
                console.log(`✓ Created user: ${userData.firstName} ${userData.lastName} (${userData.emailId})`);
                created++;
            } catch (error) {
                console.error(`✗ Error creating user ${userData.emailId}:`, error.message);
            }
        }
        
        console.log('\n=== Seeding Complete ===');
        console.log(`Created: ${created} users`);
        console.log(`Skipped: ${skipped} users (already exist)`);
        console.log(`Total: ${dummyUsers.length} users processed`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();

