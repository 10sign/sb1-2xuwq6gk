export interface Supplier {
  id: string;
  name: string;
  code: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  code: string;
  unit: string;
}

export interface Batch {
  id: string;
  number: string;
  supplierId: string;
  rawMaterialId: string;
  quantity: number;
  receptionDate: Date;
  expiryDate: Date;
  documentUrl?: string;
  createdBy: string;
  createdAt: Date;
  status: 'pending' | 'validated' | 'rejected';
}