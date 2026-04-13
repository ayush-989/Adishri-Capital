export const generateLoanId = (): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digit random
  return `L-${randomNum}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateInterest = (principal: number, rate: number): number => {
  return (principal * rate) / 100;
};

export const calculateTotalPayable = (principal: number, rate: number): number => {
  const interest = calculateInterest(principal, rate);
  return principal + interest;
};

export const generateTxnId = (): string => {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
};
