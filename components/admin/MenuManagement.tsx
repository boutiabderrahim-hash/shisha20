
import React from 'react';
// Fix: Corrected import path for types.
import { MenuItem, Category, InventoryItem } from '../../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon } from '../icons';
import { formatCurrency } from '../../utils/helpers';

interface MenuManagementProps {
  menuItems: MenuItem[];
  categories: Category[];
  inventory: InventoryItem[];
  onAdd: () => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ menuItems, categories, inventory, onAdd, onEdit, onDelete, t }) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">{t('menuManagement')}</h2>
      <button onClick={onAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <PlusCircleIcon className="w-5 h-5" />{t('addNewItem')}
      </button>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">{t('name')}</th>
              <th className="p-3 text-left">{t('category')}</th>
              <th className="p-3 text-left">{t('price')}</th>
              <th className="w-32"></th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length > 0 ? (
              menuItems.map(item => {
                const stockItem = inventory.find(i => i.id === item.stockItemId);
                const isLowOnStock = stockItem && stockItem.quantity <= stockItem.lowStockThreshold;
                return (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {item.name}
                        {isLowOnStock && <span title={t('lowStock')}><ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" /></span>}
                      </div>
                    </td>
                    <td className="p-3">{categories.find(c => c.id === item.categoryId)?.name}</td>
                    <td className="p-3">{formatCurrency(item.price)}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => onEdit(item)} className="text-blue-600"><PencilIcon className="w-5 h-5" /></button>
                      <button onClick={() => onDelete(item.id)} className="text-red-600"><TrashIcon className="w-5 h-5" /></button>
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

export default MenuManagement;