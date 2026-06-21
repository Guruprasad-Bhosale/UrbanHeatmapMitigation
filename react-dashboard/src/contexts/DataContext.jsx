import React, { createContext, useState, useEffect, useContext } from 'react';
import Papa from 'papaparse';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse('http://localhost:8000/api/strategy-data', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error loading CSV:", error);
        setLoading(false);
      }
    });
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, isOptimized, setIsOptimized }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
