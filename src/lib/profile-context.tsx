"use client";
import * as React from "react";

export interface Profile {
  username: string;
  displayName: string;
  email: string;
  bio: string;
  country: string;
  favoriteOpening: string;
  avatarColor: string;
  rating: number;
  joined: string;
}

interface Ctx {
  profile: Profile | null;
  ready: boolean;
  signIn: (p: Partial<Profile> & { email: string }) => void;
  signOut: () => void;
  update: (p: Partial<Profile>) => void;
}

const KEY = "rookwise.profile.v1";
const ProfileContext = React.createContext<Ctx | null>(null);

/**
 * PROTOTYPE auth: there is no backend. The "account" lives in this browser's
 * localStorage only and no password is ever stored or checked.
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const persist = (p: Profile | null) => {
    setProfile(p);
    try {
      if (p) localStorage.setItem(KEY, JSON.stringify(p));
      else localStorage.removeItem(KEY);
    } catch {}
  };

  const value: Ctx = {
    profile,
    ready,
    signIn: (p) => {
      const username = p.username || p.email.split("@")[0].replace(/[^a-z0-9_]/gi, "").slice(0, 20) || "player";
      persist({
        username,
        displayName: p.displayName || username,
        bio: "Chess enthusiast. Always looking for a good sacrifice.",
        country: "India",
        favoriteOpening: "Sicilian Defense",
        avatarColor: "#ff9f2e",
        rating: 1500,
        joined: new Date().toISOString().slice(0, 10),
        ...p,
      } as Profile);
    },
    signOut: () => persist(null),
    update: (p) => profile && persist({ ...profile, ...p }),
  };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = React.useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
