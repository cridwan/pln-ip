

export interface ManpowerInterface {
  uuid: string;
  name: string;
  price: string;
  created_at: string;
  updated_at: string;
}

export interface ManpowerCreateInterface {
  name: string;
  price: number;
}

export interface ManpowerCreateModelInterface {
  name: string;
  price: string;
}
