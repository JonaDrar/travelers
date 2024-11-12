// src/types/index.ts
export interface Expense {
  id?: string;
  type: string;
  amount: number;
  travelerId: string;
  travelerName: string;
  date: string;
}

export interface Traveler {
  id: string;
  name: string;
}