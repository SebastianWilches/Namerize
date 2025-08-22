export type BrandStatus = {
  id: number;
  code: string;
  label: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Holder = {
  id: number;
  name: string;
  legal_identifier?: string | null;
  email?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Brand = {
  id: number;
  name: string;
  description?: string | null;
  holder_id: number;
  status_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
};
