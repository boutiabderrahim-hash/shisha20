import React, { useState, useEffect } from 'react';
import { Waiter, UserRole } from '../../types';

interface WaiterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (waiter: Waiter) => void;
  waiter: Waiter | null;
  t: (key: string) => string;
}

const WaiterFormModal: React.FC<WaiterFormModalProps> = ({ isOpen, onClose, onSave, waiter, t }) => {
  const [formData, setFormData] = useState({ id: '', name: '', pin: '', role: 'WAITER' as UserRole });

  useEffect(() => {
    if (isOpen) {
        setFormData(waiter || { id: '', name: '', pin: '', role: 'WAITER' });
    }
  }, [waiter, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Waiter);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b font-bold">{waiter ? t('editWaiter') : t('addNewWaiter')}</div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">{t('name')}</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded-md" autoFocus />
          </div>
          <div>
            <label className="block text-sm">{t('pin')}</label>
            <input name="pin" type="password" value={formData.pin} onChange={handleChange} required className="w-full border p-2 rounded-md" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm">{t('role')}</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded-md">
              <option value="WAITER">{t('waiter')}</option>
              <option value="MANAGER">{t('manager')}</option>
              <option value="ADMIN">{t('admin')}</option>
            </select>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">{t('cancel')}</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">{t('save')}</button>
        </div>
      </form>
    </div>
  );
};

export default WaiterFormModal;
