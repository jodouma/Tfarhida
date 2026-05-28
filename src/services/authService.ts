import { isFirebaseConfigured } from "./firebase";

const disabled = () => Promise.reject(new Error("Firebase SDK is optional. Install and wire it after configuring env variables."));

export const authService = {
  configured: isFirebaseConfigured,
  register: (_email: string, _password: string) => disabled(),
  login: (_email: string, _password: string) => disabled(),
  guest: () => disabled(),
  logout: () => disabled(),
};
