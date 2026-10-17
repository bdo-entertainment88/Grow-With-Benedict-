export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  longDescription: string;
  selarUrl: string | null;
  priceNote: string;
  image: string; // local require or remote URL
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserProgress {
  productId: string;
  status: ProgressStatus;
  progressPercent: number;
  lastUpdated: string;
  notes?: string;
}
