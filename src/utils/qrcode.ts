import QRCode from 'qrcode';

export interface BatchQRData {
  id: string;
  lotNumber: string;
  supplier: string;
  rawMaterial: string;
  quantity: string;
  unit: string;
  receptionDate: string;
  expiryDate?: string;
  status?: string;
  validated?: boolean;
}

export const generateBatchQRData = (data: BatchQRData): string => {
  return JSON.stringify(data);
};

export const generateQRCodeURL = async (data: string): Promise<string> => {
  try {
    const url = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return url;
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
    throw error;
  }
};

export const createBatchDetailsURL = (batchData: BatchQRData): string => {
  const baseUrl = window.location.origin;
  const encodedData = encodeURIComponent(JSON.stringify(batchData));
  return `${baseUrl}/lot/${encodedData}`;
};