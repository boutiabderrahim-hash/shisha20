
import React from 'react';
import { Waiter } from '../types';
import { UserCircleIcon } from './icons';

interface WaiterSelectionScreenProps {
  waiters: Waiter[];
  onSelectWaiter: (waiter: Waiter) => void;
  t: (key: string) => string;
}

const WaiterSelectionScreen: React.FC<WaiterSelectionScreenProps> = ({ waiters, onSelectWaiter, t }) => {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2">Restro POS</h1>
      <h2 className="text-2xl font-light text-gray-300 mb-10">{t('selectYourProfile')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {waiters.map((waiter) => (
          <button
            key={waiter.id}
            onClick={() => onSelectWaiter(waiter)}
            className="flex flex-col items-center p-6 bg-gray-700 rounded-lg shadow-lg hover:bg-orange-600 hover:scale-105 transition-all duration-200 ease-in-out text-white"
          >
            <UserCircleIcon className="w-24 h-24 text-gray-400 mb-4" />
            <span className="text-lg font-semibold">{waiter.name}</span>
            <span className="text-sm text-gray-300">{t(waiter.role.toLowerCase())}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WaiterSelectionScreen;
