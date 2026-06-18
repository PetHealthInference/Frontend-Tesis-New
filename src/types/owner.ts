export type Owner = {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string | null;
};

export type OwnerFormValues = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
};

export type OwnerPayload = {
  first_name: string;
  last_name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
};
