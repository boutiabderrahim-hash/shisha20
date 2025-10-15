
import React from 'react';
// Fix: Corrected import path for types.
import { Category } from '../../types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '../icons';
import { formatCurrency } from '../../utils/helpers';

interface CategoryManagementProps {
  categories: Category[];
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, onAdd, onEdit, onDelete, t }) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">{t('categoryManagement')}</h2>
      <button onClick={onAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <PlusCircleIcon className="w-5 h-5" />{t('addNewCategory')}
      </button>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">{t('name')}</th>
            <th className="w-32"></th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map(cat => (
              <tr key={cat.id} className="border-b">
                <td className="p-3">{cat.name}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => onEdit(cat)} className="text-blue-600"><PencilIcon className="w-5 h-5" /></button>
                  <button onClick={() => onDelete(cat.id)} className="text-red-600"><TrashIcon className="w-5 h-5" /></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center p-6 text-gray-500">{t('noDataAvailable')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default CategoryManagement;