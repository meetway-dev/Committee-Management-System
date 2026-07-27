export type ThemePreference = "light" | "dark" | "system";

export interface ISettings {
  _id: string;
  user: string;
  theme: ThemePreference;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    whatsapp: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
