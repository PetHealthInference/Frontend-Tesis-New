export type Patient = {
  id: number;
  name: string;
  species: Species;
  breed?: Breed | null;
  owner: {
    id: number;
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  sex: string;
  birth_date?: string | null;
  weight?: number | null;
  created_at: string;
};

export type Species = {
  id: number;
  name: string;
};

export type Breed = {
  id: number;
  name: string;
  species_id: number;
  species?: Species | null;
};

export type PatientFormValues = {
  owner_id: string;
  name: string;
  species_id: string;
  breed_id: string;
  sex: string;
  birth_date: string;
  weight: string;
};

export type PatientPayload = {
  owner_id: number;
  name: string;
  species_id: number;
  breed_id?: number | null;
  sex: string;
  birth_date?: string | null;
  weight?: number | null;
};
