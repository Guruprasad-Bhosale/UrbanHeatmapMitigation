import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import { DataProvider } from './contexts/DataContext';

function App() {
  return (
    <DataProvider>
      <DashboardLayout />
    </DataProvider>
  );
}

export default App;
