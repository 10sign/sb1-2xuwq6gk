import React from 'react';
import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Printer } from 'lucide-react';

interface ProductionQRCodeProps {
  data: {
    lotNumber: string;
    productionDate: Date;
    productionLine: string;
    operator: string;
    rawMaterials: {
      lotNumber: string;
      name: string;
      quantity: number;
      unit: string;
    }[];
  };
  onClose: () => void;
}

export default function ProductionQRCode({ data, onClose }: ProductionQRCodeProps) {
  const qrCodeData = JSON.stringify(data);

  const handleDownload = () => {
    const canvas = document.getElementById('production-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-code-${data.lotNumber}.png`;
      link.href = url;
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      const canvas = document.getElementById('production-qr-code') as HTMLCanvasElement;
      const url = canvas.toDataURL('image/png');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${data.lotNumber}</title>
            <style>
              body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; }
              .qr-code { text-align: center; margin-bottom: 20px; }
              .info { margin-top: 20px; }
              .info p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="qr-code">
                <img src="${url}" alt="QR Code" style="width: 300px; height: 300px;"/>
              </div>
              <div class="info">
                <h2>Informations de production</h2>
                <p><strong>Numéro de lot:</strong> ${data.lotNumber}</p>
                <p><strong>Date de production:</strong> ${format(data.productionDate, 'dd MMMM yyyy', { locale: fr })}</p>
                <p><strong>Ligne de production:</strong> ${data.productionLine}</p>
                <p><strong>Opérateur:</strong> ${data.operator}</p>
                <h3>Matières premières utilisées:</h3>
                ${data.rawMaterials.map(material => `
                  <p>- ${material.name} (${material.quantity} ${material.unit}) - Lot ${material.lotNumber}</p>
                `).join('')}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">QR Code de traçabilité</h2>
          <p className="text-gray-600 mt-1">Lot {data.lotNumber}</p>
        </div>

        <div className="flex justify-center mb-6">
          <QRCode
            id="production-qr-code"
            value={qrCodeData}
            size={300}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Informations de production</h3>
            <p className="text-sm text-gray-600">Date: {format(data.productionDate, 'dd MMMM yyyy', { locale: fr })}</p>
            <p className="text-sm text-gray-600">Ligne: {data.productionLine}</p>
            <p className="text-sm text-gray-600">Opérateur: {data.operator}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Matières premières</h3>
            <div className="space-y-1">
              {data.rawMaterials.map((material, index) => (
                <p key={index} className="text-sm text-gray-600">
                  {material.name} - {material.quantity} {material.unit}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="space-x-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-5 w-5 mr-2" />
              Télécharger
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Printer className="h-5 w-5 mr-2" />
              Imprimer
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}