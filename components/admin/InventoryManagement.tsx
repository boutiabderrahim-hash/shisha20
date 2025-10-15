import React from 'react';
// Fix: Corrected import path for types.
import { InventoryItem, UserRole } from '../../types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '../icons';

interface InventoryManagementProps {
  inventory: InventoryItem[];
  onAdd: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
  currentUserRole: UserRole;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ inventory, onAdd, onEdit, onDelete, t, currentUserRole }) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">{t('inventoryManagement')}</h2>
      {currentUserRole === 'ADMIN' && (
        <button onClick={onAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <PlusCircleIcon className="w-5 h-5" />{t('addNewStock')}
        </button>
      )}
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">{t('name')}</th>
              <th className="p-3 text-left">{t('quantity')}</th>
              <th className="p-3 text-left">{t('threshold')}</th>
              <th className="w-32"></th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map(item => {
                const isLowOnStock = item.quantity <= item.lowStockThreshold;
                return (
                  <tr key={item.id} className={`border-b ${isLowOnStock ? 'bg-red-50' : ''}`}>
                    <td className="p-3">{item.name}</td>
                    <td className={`p-3 ${isLowOnStock ? 'text-red-600 font-bold' : ''}`}>{item.quantity} {item.unit}</td>
                    <td className="p-3">{item.lowStockThreshold} {item.unit}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => onEdit(item)} className="text-blue-600"><PencilIcon className="w-5 h-5" /></button>
                      {currentUserRole === 'ADMIN' && (
                         <button onClick={() => onDelete(item.id)} className="text-red-600"><TrashIcon className="w-5 h-5" /></button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
                <tr>
                    <td colSpan={4} className="text-center p-6 text-gray-500">{t('noDataAvailable')}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default InventoryManagement;