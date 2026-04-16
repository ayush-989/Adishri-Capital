/**
 * Firestore seed script — uses the client SDK (no service account needed).
 *
 * Run:  npm run seed
 *
 * Requires .env at project root with VITE_FIREBASE_* keys.
 * NOTE: Firestore security rules must allow writes while seeding,
 *       OR run this while logged in as admin (rules allow admin writes).
 *       Easiest: temporarily set rules to allow read, write: if true; then restore.
 */

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env") });

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = process.env;

if (!VITE_FIREBASE_PROJECT_ID || !VITE_FIREBASE_API_KEY) {
  console.error("❌ Missing VITE_FIREBASE_* keys in .env");
  process.exit(1);
}

const app = initializeApp({
  apiKey:            VITE_FIREBASE_API_KEY,
  authDomain:        VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         VITE_FIREBASE_PROJECT_ID,
  storageBucket:     VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

// ─── Constants ────────────────────────────────────────────────────────────────

const LOAN_STATUS = {
  PENDING_PAYMENT:  "Pending Payment Verification",
  PENDING_KYC:      "Pending KYC Verification",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED:         "Approved",
  DISBURSED:        "Disbursed",
  REJECTED:         "Rejected",
} as const;

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ─── Users ────────────────────────────────────────────────────────────────────
// Doc ID = uid  |  matches AppUser model: { uid, email, phoneNumber, role }

const users = [
  { uid: "user001",  email: "rahul.sharma@email.com",    phoneNumber: "+919876543210", role: "user"  },
  { uid: "user002",  email: "priya.patel@email.com",     phoneNumber: "+919876543211", role: "user"  },
  { uid: "user003",  email: "amit.singh@email.com",      phoneNumber: "+919876543212", role: "user"  },
  { uid: "user004",  email: "sneha.gupta@email.com",     phoneNumber: "+919876543213", role: "user"  },
  { uid: "user005",  email: "vikram.reddy@email.com",    phoneNumber: "+919876543214", role: "user"  },
  { uid: "user006",  email: "anjali.nair@email.com",     phoneNumber: "+919876543215", role: "user"  },
  { uid: "user007",  email: "rohit.verma@email.com",     phoneNumber: "+919876543216", role: "user"  },
  { uid: "user008",  email: "meera.joshi@email.com",     phoneNumber: "+919876543217", role: "user"  },
  { uid: "user009",  email: "sanjay.agarwal@email.com",  phoneNumber: "+919876543218", role: "user"  },
  { uid: "user010",  email: "pooja.mishra@email.com",    phoneNumber: "+919876543219", role: "user"  },
  { uid: "user011",  email: "kunal.desai@email.com",     phoneNumber: "+919876543220", role: "user"  },
  { uid: "user012",  email: "divya.chandran@email.com",  phoneNumber: "+919876543221", role: "user"  },
  { uid: "user013",  email: "arjun.menon@email.com",     phoneNumber: "+919876543222", role: "user"  },
  { uid: "user014",  email: "tanya.rao@email.com",       phoneNumber: "+919876543223", role: "user"  },
  { uid: "user015",  email: "harsh.singh@email.com",     phoneNumber: "+919876543224", role: "user"  },
  { uid: "user016",  email: "neha.shah@email.com",       phoneNumber: "+919876543225", role: "user"  },
  { uid: "user017",  email: "raj.malhotra@email.com",    phoneNumber: "+919876543226", role: "user"  },
  { uid: "user018",  email: "kavya.iyer@email.com",      phoneNumber: "+919876543227", role: "user"  },
  { uid: "admin001", email: "admin@adishricapitals.com", phoneNumber: "+919999999999", role: "admin" },
];

// ─── Applications ─────────────────────────────────────────────────────────────
// Doc ID = appXXX  |  matches LoanApplication model
// Dashboard reads THIS collection for all financial stats.

const userNames: Record<string, string> = {
  user001: "Rahul Sharma",    user002: "Priya Patel",
  user003: "Amit Kumar Singh",user004: "Sneha Gupta",
  user005: "Vikram Reddy",    user006: "Anjali Nair",
  user007: "Rohit Verma",     user008: "Meera Joshi",
  user009: "Sanjay Agarwal",  user010: "Pooja Mishra",
  user011: "Kunal Desai",     user012: "Divya Chandran",
  user013: "Arjun Menon",     user014: "Tanya Rao",
  user015: "Harsh Singh",     user016: "Neha Shah",
  user017: "Raj Malhotra",    user018: "Kavya Iyer",
};

const cities = ["Delhi","Mumbai","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Jaipur"];

const appDefs = [
  { userId:"user001", status:LOAN_STATUS.PENDING_PAYMENT,  finalAmount:15000, rate:null, ago:1  },
  { userId:"user002", status:LOAN_STATUS.PENDING_KYC,      finalAmount:25000, rate:null, ago:2  },
  { userId:"user003", status:LOAN_STATUS.PENDING_APPROVAL, finalAmount:35000, rate:null, ago:3  },
  { userId:"user004", status:LOAN_STATUS.APPROVED,         finalAmount:20000, rate:2.5,  ago:5  },
  { userId:"user005", status:LOAN_STATUS.DISBURSED,        finalAmount:40000, rate:3,    ago:7  },
  { userId:"user006", status:LOAN_STATUS.DISBURSED,        finalAmount:50000, rate:4,    ago:10 },
  { userId:"user007", status:LOAN_STATUS.REJECTED,         finalAmount:12000, rate:null, ago:12 },
  { userId:"user008", status:LOAN_STATUS.PENDING_PAYMENT,  finalAmount:18000, rate:null, ago:1  },
  { userId:"user009", status:LOAN_STATUS.PENDING_KYC,      finalAmount:30000, rate:null, ago:2  },
  { userId:"user010", status:LOAN_STATUS.APPROVED,         finalAmount:22000, rate:3,    ago:6  },
  { userId:"user011", status:LOAN_STATUS.DISBURSED,        finalAmount:45000, rate:4,    ago:8  },
  { userId:"user012", status:LOAN_STATUS.PENDING_APPROVAL, finalAmount:28000, rate:null, ago:4  },
  { userId:"user013", status:LOAN_STATUS.REJECTED,         finalAmount:8000,  rate:null, ago:15 },
  { userId:"user014", status:LOAN_STATUS.PENDING_PAYMENT,  finalAmount:16000, rate:null, ago:1  },
  { userId:"user015", status:LOAN_STATUS.PENDING_KYC,      finalAmount:38000, rate:null, ago:2  },
  { userId:"user016", status:LOAN_STATUS.APPROVED,         finalAmount:25000, rate:3.5,  ago:9  },
  { userId:"user017", status:LOAN_STATUS.DISBURSED,        finalAmount:35000, rate:2,    ago:11 },
  { userId:"user018", status:LOAN_STATUS.PENDING_APPROVAL, finalAmount:20000, rate:null, ago:3  },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
// loanId MUST exactly match the application doc ID (app001 … app018)
// Dashboard: totalRecovered = sum of { type:"repayment", verified:true }

const txnDefs = [
  // Processing fees
  { type:"fee",       loanId:"app001", amount:49,    verified:false, utr:"SBIN7829345012", ago:1  },
  { type:"fee",       loanId:"app002", amount:49,    verified:true,  utr:"SBIN7829345013", ago:2  },
  { type:"fee",       loanId:"app003", amount:49,    verified:true,  utr:"SBIN7829345014", ago:3  },
  { type:"fee",       loanId:"app004", amount:49,    verified:true,  utr:"SBIN7829345015", ago:5  },
  { type:"fee",       loanId:"app005", amount:49,    verified:true,  utr:"SBIN7829345016", ago:7  },
  { type:"fee",       loanId:"app006", amount:49,    verified:true,  utr:"SBIN7829345017", ago:10 },
  { type:"fee",       loanId:"app007", amount:49,    verified:false, utr:"SBIN7829345018", ago:12 },
  { type:"fee",       loanId:"app008", amount:49,    verified:false, utr:"SBIN7829345019", ago:1  },
  { type:"fee",       loanId:"app009", amount:49,    verified:true,  utr:"SBIN7829345020", ago:2  },
  { type:"fee",       loanId:"app010", amount:49,    verified:true,  utr:"SBIN7829345021", ago:6  },
  { type:"fee",       loanId:"app011", amount:49,    verified:true,  utr:"SBIN7829345022", ago:8  },
  { type:"fee",       loanId:"app012", amount:49,    verified:false, utr:"SBIN7829345023", ago:4  },
  { type:"fee",       loanId:"app013", amount:49,    verified:false, utr:"SBIN7829345024", ago:15 },
  { type:"fee",       loanId:"app014", amount:49,    verified:false, utr:"SBIN7829345025", ago:1  },
  { type:"fee",       loanId:"app015", amount:49,    verified:true,  utr:"SBIN7829345026", ago:2  },
  { type:"fee",       loanId:"app016", amount:49,    verified:true,  utr:"SBIN7829345027", ago:9  },
  { type:"fee",       loanId:"app017", amount:49,    verified:true,  utr:"SBIN7829345028", ago:11 },
  { type:"fee",       loanId:"app018", amount:49,    verified:false, utr:"SBIN7829345029", ago:3  },
  // Repayments — only for Disbursed apps: app005, app006, app011, app017
  { type:"repayment", loanId:"app005", amount:5000,  verified:false, utr:"HDFC9876543210", ago:1  },
  { type:"repayment", loanId:"app005", amount:3000,  verified:true,  utr:"HDFC9876543211", ago:3  },
  { type:"repayment", loanId:"app006", amount:8000,  verified:false, utr:"HDFC9876543212", ago:2  },
  { type:"repayment", loanId:"app006", amount:5000,  verified:true,  utr:"HDFC9876543213", ago:5  },
  { type:"repayment", loanId:"app010", amount:6000,  verified:true,  utr:"HDFC9876543215", ago:4  },
  { type:"repayment", loanId:"app011", amount:7000,  verified:true,  utr:"HDFC9876543216", ago:6  },
  { type:"repayment", loanId:"app011", amount:4500,  verified:false, utr:"HDFC9876543217", ago:2  },
  { type:"repayment", loanId:"app016", amount:5500,  verified:true,  utr:"HDFC9876543218", ago:5  },
  { type:"repayment", loanId:"app017", amount:8000,  verified:true,  utr:"HDFC9876543219", ago:8  },
  { type:"repayment", loanId:"app017", amount:4000,  verified:false, utr:"HDFC9876543220", ago:1  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed(): Promise<void> {
  console.log(`🔥 Seeding project: ${VITE_FIREBASE_PROJECT_ID}\n`);

  // Users
  console.log("👤 Seeding users...");
  for (const u of users) {
    await setDoc(doc(db, "users", u.uid), u);
    console.log(`   ✓ ${u.uid} — ${u.email} [${u.role}]`);
  }
  console.log(`   → ${users.length} users\n`);

  // Applications
  console.log("📋 Seeding applications...");
  for (let i = 0; i < appDefs.length; i++) {
    const def   = appDefs[i];
    const docId = `app${String(i + 1).padStart(3, "0")}`; // app001 … app018
    const appId = `L-${1001 + i}`;                         // L-1001 … L-1018
    const hasBalance = def.status === LOAN_STATUS.DISBURSED || def.status === LOAN_STATUS.APPROVED;

    await setDoc(doc(db, "applications", docId), {
      id:                docId,
      appId,
      userId:            def.userId,
      status:            def.status,
      finalAmount:       def.finalAmount,
      finalInterestRate: def.rate ?? null,
      remainingBalance:  hasBalance && def.rate
        ? Math.round(def.finalAmount * (1 + def.rate / 100))
        : null,
      createdAt: daysAgo(def.ago),
      basicDetails: {
        fullName: userNames[def.userId],
        phone:    `98765432${String(10 + i).padStart(2, "0")}`,
        email:    users.find(u => u.uid === def.userId)!.email,
        address:  `${i + 1}, Main Road, ${cities[i % cities.length]}`,
      },
      kycDetails: {
        panNumber:       `ABCDE${100000 + i}F`,
        aadhaarNumber:   `${200000000000 + i}`,
        accountNumber:   `${1000000000 + i}`,
        ifsc:            `SBIN${100000 + i}`,
        panUrl:          "https://placehold.co/600x400?text=PAN",
        aadhaarFrontUrl: "https://placehold.co/600x400?text=Aadhaar+Front",
        aadhaarBackUrl:  "https://placehold.co/600x400?text=Aadhaar+Back",
        passbookUrl:     "https://placehold.co/600x400?text=Passbook",
      },
    });
    console.log(`   ✓ ${docId} (${appId}) — ${userNames[def.userId]} [${def.status}]`);
  }
  console.log(`   → ${appDefs.length} applications\n`);

  // Transactions
  console.log("💳 Seeding transactions...");
  for (let i = 0; i < txnDefs.length; i++) {
    const t     = txnDefs[i];
    const docId = `txn${String(i + 1).padStart(4, "0")}`;

    await setDoc(doc(db, "transactions", docId), {
      id:            docId,
      txnId:         `TXN${1719900000 + i}`,
      loanId:        t.loanId,  // ← matches application doc ID exactly
      type:          t.type,
      amount:        t.amount,
      verified:      t.verified,
      utr:           t.utr,
      screenshotUrl: "https://placehold.co/600x800?text=Screenshot",
      createdAt:     daysAgo(t.ago),
    });
    console.log(`   ✓ ${docId} — ${t.type} | loanId:${t.loanId} | ₹${t.amount} | ${t.verified ? "✅ verified" : "⏳ pending"}`);
  }
  console.log(`   → ${txnDefs.length} transactions\n`);

  // Expected dashboard values
  const disbursed      = appDefs.filter(a => a.status === LOAN_STATUS.DISBURSED);
  const totalExposure  = disbursed.reduce((s, a) => s + a.finalAmount, 0);
  const totalRecovered = txnDefs
    .filter(t => t.type === "repayment" && t.verified)
    .reduce((s, t) => s + t.amount, 0);
  const pendingActions = appDefs.filter(a =>
    [LOAN_STATUS.PENDING_PAYMENT, LOAN_STATUS.PENDING_KYC, LOAN_STATUS.PENDING_APPROVAL]
      .includes(a.status as any)
  ).length;

  console.log("✅ Seed complete!\n");
  console.log("📊 Expected dashboard values:");
  console.log(`   Active Users:    ${users.length}`);
  console.log(`   Active Loans:    ${disbursed.length}`);
  console.log(`   Total Exposure:  ₹${totalExposure.toLocaleString("en-IN")}`);
  console.log(`   Total Recovered: ₹${totalRecovered.toLocaleString("en-IN")}`);
  console.log(`   Pending Actions: ${pendingActions}`);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err.message ?? err);
  process.exit(1);
});
