import React, { useState, useEffect } from 'react';
import { propertyService } from '../../services/propertyService';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Database, Users, Home, Activity } from 'lucide-react';

export const FirebaseStatus: React.FC = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    featuredProperties: 0,
    recentActivity: 0
  });

  useEffect(() => {
    // Real-time listener for properties count
    const unsubProperties = onSnapshot(collection(db, 'properties'), (snapshot) => {
      setStats(prev => ({
        ...prev,
        totalProperties: snapshot.size,
        featuredProperties: snapshot.docs.filter(doc => doc.data().isFeatured).length
      }));
    });

    // Real-time listener for users count
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({
        ...prev,
        totalUsers: snapshot.size
      }));
    });

    // Real-time listener for transactions (activity)
    const unsubTransactions = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      setStats(prev => ({
        ...prev,
        recentActivity: snapshot.size
      }));
    });

    return () => {
      unsubProperties();
      unsubUsers();
      unsubTransactions();
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Real-time Status
        </h2>
        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live Data
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Home className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalProperties}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Properties</div>
        </div>

        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Users className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalUsers}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
        </div>

        <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Database className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.featuredProperties}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
        </div>

        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.recentActivity}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Transactions</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        All data updates in real-time via Firebase listeners
      </div>
    </div>
  );
};
