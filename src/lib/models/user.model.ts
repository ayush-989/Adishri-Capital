export interface AppUser {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  role: "user" | "admin";
}
