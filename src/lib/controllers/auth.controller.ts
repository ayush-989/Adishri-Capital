import { serverTimestamp } from "firebase/firestore";
import { registerWithEmail } from "../services/auth.service";
import { createUser } from "../services/user.service";

export const initializeAdminAccount = async (email: string, password: string): Promise<void> => {
  const { user } = await registerWithEmail(email, password);
  await createUser(user.uid, {
    email: user.email,
    phoneNumber: null,
    role: "admin",
    // @ts-ignore — serverTimestamp is valid in Firestore writes
    createdAt: serverTimestamp(),
  });
};
