import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LOAN_STATUS = {
  PENDING_PAYMENT: "Pending Payment Verification",
  PENDING_KYC: "Pending KYC Verification",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  DISBURSED: "Disbursed",
  REJECTED: "Rejected",
};

const users = [
  { uid: "user001", name: "Rahul Sharma", phone: "9876543210", email: "rahul@example.com" },
  { uid: "user002", name: "Priya Patel", phone: "9876543211", email: "priya@example.com" },
  { uid: "user003", name: "Amit Kumar", phone: "9876543212", email: "amit@example.com" },
  { uid: "user004", name: "Sneha Gupta", phone: "9876543213", email: "sneha@example.com" },
  { uid: "user005", name: "Vikram Singh", phone: "9876543214", email: "vikram@example.com" },
  { uid: "user006", name: "Anjali Reddy", phone: "9876543215", email: "anjali@example.com" },
  { uid: "user007", name: "Rohit Verma", phone: "9876543216", email: "rohit@example.com" },
  { uid: "user008", name: "Meera Nair", phone: "9876543217", email: "meera@example.com" },
  { uid: "user009", name: "Sanjay Joshi", phone: "9876543218", email: "sanjay@example.com" },
  { uid: "user010", name: "Pooja Agarwal", phone: "9876543219", email: "pooja@example.com" },
];

const applications = [
  { userId: "user001", status: LOAN_STATUS.PENDING_PAYMENT, amount: 50000, createdDaysAgo: 1 },
  { userId: "user002", status: LOAN_STATUS.PENDING_KYC, amount: 75000, createdDaysAgo: 2 },
  { userId: "user003", status: LOAN_STATUS.PENDING_APPROVAL, amount: 100000, createdDaysAgo: 3 },
  { userId: "user004", status: LOAN_STATUS.APPROVED, amount: 60000, createdDaysAgo: 5 },
  { userId: "user005", status: LOAN_STATUS.DISBURSED, amount: 80000, createdDaysAgo: 7 },
  { userId: "user006", status: LOAN_STATUS.DISBURSED, amount: 120000, createdDaysAgo: 10 },
  { userId: "user007", status: LOAN_STATUS.REJECTED, amount: 40000, createdDaysAgo: 12 },
  { userId: "user008", status: LOAN_STATUS.PENDING_PAYMENT, amount: 55000, createdDaysAgo: 1 },
  { userId: "user009", status: LOAN_STATUS.PENDING_KYC, amount: 90000, createdDaysAgo: 2 },
  { userId: "user010", status: LOAN_STATUS.APPROVED, amount: 70000, createdDaysAgo: 6 },
];

const transactions = [
  { type: "fee", loanId: "app001", amount: 49, verified: false, utr: "UTR001", createdDaysAgo: 1 },
  { type: "fee", loanId: "app002", amount: 49, verified: true, utr: "UTR002", createdDaysAgo: 2 },
  { type: "fee", loanId: "app003", amount: 49, verified: true, utr: "UTR003", createdDaysAgo: 3 },
  { type: "fee", loanId: "app004", amount: 49, verified: true, utr: "UTR004", createdDaysAgo: 5 },
  { type: "fee", loanId: "app005", amount: 49, verified: true, utr: "UTR005", createdDaysAgo: 7 },
  { type: "fee", loanId: "app006", amount: 49, verified: true, utr: "UTR006", createdDaysAgo: 10 },
  { type: "fee", loanId: "app008", amount: 49, verified: false, utr: "UTR008", createdDaysAgo: 1 },
  { type: "fee", loanId: "app009", amount: 49, verified: true, utr: "UTR009", createdDaysAgo: 2 },
  { type: "repayment", loanId: "app005", amount: 10000, verified: false, utr: "REP001", createdDaysAgo: 1 },
  { type: "repayment", loanId: "app005", amount: 5000, verified: true, utr: "REP002", createdDaysAgo: 3 },
  { type: "repayment", loanId: "app006", amount: 15000, verified: false, utr: "REP003", createdDaysAgo: 2 },
  { type: "repayment", loanId: "app006", amount: 8000, verified: true, utr: "REP004", createdDaysAgo: 5 },
  { type: "repayment", loanId: "app004", amount: 20000, verified: false, utr: "REP005", createdDaysAgo: 1 },
  { type: "repayment", loanId: "app010", amount: 12000, verified: true, utr: "REP006", createdDaysAgo: 4 },
];

function getTimestamp(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

async function seedDatabase() {
  console.log("Seeding Firestore database...");

  // Seed users
  for (const user of users) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: "user",
      createdAt: serverTimestamp(),
    });
    console.log(`Created user: ${user.uid}`);
  }

  // Seed applications
  for (let i = 0; i < applications.length; i++) {
    const app = applications[i];
    const appId = `app${String(i + 1).padStart(3, "0")}`;
    const user = users.find((u) => u.uid === app.userId)!;

    await setDoc(doc(db, "applications", appId), {
      id: appId,
      appId: appId,
      userId: app.userId,
      status: app.status,
      finalAmount: app.amount,
      finalInterestRate: 10,
      remainingBalance: app.status === LOAN_STATUS.DISBURSED ? app.amount * 1.1 : null,
      createdAt: getTimestamp(app.createdDaysAgo),
      basicDetails: {
        fullName: user.name,
        phone: user.phone,
        email: user.email,
        address: "123 Main Street, City, State - 123456",
      },
      kycDetails: {
        panNumber: "ABCDE1234F",
        aadhaarNumber: "123456789012",
        accountNumber: "1234567890",
        ifsc: "SBIN0001234",
        panUrl: "https://example.com/pan.jpg",
        aadhaarFrontUrl: "https://example.com/aadhaar-front.jpg",
        aadhaarBackUrl: "https://example.com/aadhaar-back.jpg",
        passbookUrl: "https://example.com/passbook.jpg",
      },
    });
    console.log(`Created application: ${appId}`);
  }

  // Seed transactions (10 total for fee + repayments)
  for (let i = 0; i < transactions.length; i++) {
    const txn = transactions[i];
    const txnId = `txn${String(i + 1).padStart(3, "0")}`;

    await setDoc(doc(db, "transactions", txnId), {
      id: txnId,
      loanId: txn.loanId,
      type: txn.type,
      amount: txn.amount,
      verified: txn.verified,
      utr: txn.utr,
      screenshotUrl: "https://example.com/screenshot.jpg",
      createdAt: getTimestamp(txn.createdDaysAgo),
    });
    console.log(`Created transaction: ${txnId}`);
  }

  console.log("Database seeded successfully!");
}

seedDatabase().catch(console.error);