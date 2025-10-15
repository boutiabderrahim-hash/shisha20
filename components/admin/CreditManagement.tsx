
import React from 'react';
// Fix: Corrected import path for types.
import { Order } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { TicketIcon } from '../icons';

interface CreditManagementProps {
  creditOrders: Order[];
  onSettle: (order: Order) => void;
  t: (key: string) => string;
}

const CreditManagement: React.FC<CreditManagementProps> = ({ creditOrders, onSettle, t }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('creditManagement')}</h2>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">{t('dateTime')}</th>
                <th className="p-3 text-left">{t('customerName')}</th>
                <th className="p-3 text-left">{t('order')} #</th>
                <th className="p-3 text-left">{t('amount')}</th>
                <th className="w-32"></th>
              </tr>
            </thead>
            <tbody>
              {creditOrders.length > 0 ? (
                creditOrders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3 text-sm text-gray-600">{new Date(order.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-semibold">{order.customerName}</td>
                    <td className="p-3">{order.id}</td>
                    <td className="p-3 font-mono">{formatCurrency(order.total)}</td>
                    <td className="p-3">
                      <button 
                        onClick={() => onSettle(order)} 
                        className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm hover:bg-green-700 transition-colors"
                      >
                        <TicketIcon className="w-4 h-4" />
                        {t('settle')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">{t('noDataAvailable')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreditManagement;