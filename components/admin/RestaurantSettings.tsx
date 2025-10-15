import React, { useState, useEffect } from 'react';
import { RestaurantSettings, UserRole } from '../../types';

interface RestaurantSettingsProps {
  settings: RestaurantSettings;
  onSave: (settings: RestaurantSettings) => void;
  pins: { [key in UserRole]?: string };
  onSavePins: (pins: { [key in UserRole]?: string }) => void;
  t: (key: string) => string;
}

const RestaurantSettingsComp: React.FC<RestaurantSettingsProps> = ({ settings, onSave, pins, onSavePins, t }) => {
  const [formData, setFormData] = useState(settings);
  const [pinData, setPinData] = useState(pins);

  useEffect(() => {
    setFormData(settings);
    setPinData(pins);
  }, [settings, pins]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPinData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onSavePins(pinData);
    alert(t('settingsSaved'));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t('restaurantSettings')}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto space-y-8">
        <div>
            <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('restaurantInfo')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t('restaurantName')}</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('address')}</label>
                <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('phone')}</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('receiptFooter')}</label>
                <textarea name="footer" value={formData.footer} onChange={handleChange} rows={3} className="w-full border p-2 rounded-md" />
              </div>
            </div>
        </div>

        <div>
            <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('accessControl')}</h3>
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium">{t('managerPin')}</label>
                <input name="MANAGER" type="password" value={pinData.MANAGER || ''} onChange={handlePinChange} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('adminPin')}</label>
                <input name="ADMIN" type="password" value={pinData.ADMIN || ''} onChange={handlePinChange} className="w-full border p-2 rounded-md" />
              </div>
            </div>
        </div>
        <div className="mt-6 text-right">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">{t('save')}</button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantSettingsComp;
