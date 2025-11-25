"use client";

export type HostProfile = {
  id: string;
  name: string;
  rating: number; // 1-5
  verified: boolean;
  hourlyRateCoins: number;
  reviews: number;
};

const HOSTS_KEY = "hosts:data";

function readHosts(): HostProfile[] {
  const raw = localStorage.getItem(HOSTS_KEY);
  if (!raw) {
    const defaults: HostProfile[] = [
      { id: "H1001", name: "Layla", rating: 4.8, verified: true, hourlyRateCoins: 120, reviews: 240 },
      { id: "H1002", name: "Omar", rating: 4.6, verified: true, hourlyRateCoins: 95, reviews: 180 },
      { id: "H1003", name: "Sara", rating: 4.9, verified: true, hourlyRateCoins: 140, reviews: 310 },
      { id: "H1004", name: "Nadia", rating: 4.7, verified: true, hourlyRateCoins: 110, reviews: 205 },
    ];
    localStorage.setItem(HOSTS_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(raw) as HostProfile[];
  } catch {
    return [];
  }
}

export const HostService = {
  list(): HostProfile[] {
    return readHosts();
  },
};