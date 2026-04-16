/**
 * seed.mjs  —  Adishri Capitals Firestore Seeder
 *
 * Usage:
 *   node seed.mjs
 *
 * Requirements:
 *   - Update firebaseConfig below with your project details
 *   - Run: node seed.mjs
 *
 * This script writes all seed documents to Firestore. Safe to re-run.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { readFileSync } from "fs";

// ── Firebase Config ───────────────────────────────────────────────────────────
// UPDATE THESE VALUES with your Firebase project details
// Check src/lib/firebase/config.ts or Firebase Console → Project Settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // e.g. "AIzaSyD..."
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// ── Collections to seed ────────────────────────────────────────────────────
const COLLECTIONS = {
  users:        "users",
  applications: "applications",
  transactions: "transactions",
};

const ID_FIELD = {
  users:        "uid",
  applications: "id",
  transactions: "id",
};

// ── Run ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🔥 Starting Firestore seeding...\n");
  
  try {
    const app = initializeApp(firebaseConfig);
    const db  = getFirestore(app);
    console.log("✅ Connected to Firestore\n");

    const data = JSON.parse(readFileSync("./seed-data.json", "utf-8"));
    console.log("📄 Loaded seed-data.json\n");

    let total = 0;

    for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
      const records = data[key];
      if (!Array.isArray(records)) {
        console.log(`⚠️  Skipping "${key}" - not an array`);
        continue;
      }

      console.log(`📂 Seeding "${collectionName}" (${records.length} docs)...`);

      for (const record of records) {
        const docId = record[ID_FIELD[key]];
        if (!docId) {
          console.warn(`  ⚠️  Skipping - missing ID field "${ID_FIELD[key]}"`);
          continue;
        }

        // Remove the id field (Firestore uses doc ID)
        const { [ID_FIELD[key]]: _id, ...payload } = record;

        await setDoc(doc(db, collectionName, docId), payload);
        console.log(`  ✅ ${docId}`);
        total++;
      }
    }

    console.log(`\n🎉 Done! ${total} documents written to Firestore.\n`);
    console.log("📊 Summary:");
    console.log(`   • Users: ${data.users?.length || 0}`);
    console.log(`   • Applications: ${data.applications?.length || 0}`);
    console.log(`   • Transactions: ${data.transactions?.length || 0}`);
    console.log("\n🔍 Next steps:");
    console.log("   1. Open Firebase Console → Cloud Firestore → Data");
    console.log("   2. Verify collections have documents");
    console.log("   3. Run your app: npm run dev");
    console.log("   4. Open browser DevTools → Console to see data loading logs");
    
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    console.log("\n📝 Troubleshooting:");
    console.log("   1. Check firebaseConfig values are correct");
    console.log("   2. Ensure Firestore is enabled in Firebase Console");
    console.log("   3. Check network connectivity");
    process.exit(1);
  }
  
  process.exit(0);
}

seed();
