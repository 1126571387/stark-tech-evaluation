"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { fetchStocks, fetchMonthlyRevenue } from '@/lib/api';
import { StockInfo, MonthlyRevenue } from '@/lib/types';

interface StockContextType {
  selectedStock: StockInfo | null;
  revenueData: MonthlyRevenue[];
  loading: boolean;
  error: string | null;
  timeRange: number;
  setSelectedStock: (stockId: string, stockName: string) => void;
  setTimeRange: (months: number) => void;
  searchStocks: (query: string) => Promise<StockInfo[]>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStock, setSelectedStock] = useState<StockInfo | null>(null);
  const [revenueData, setRevenueData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const useTimeRangeRef = useRef(6); // 默认显示6个月 

  // 处理股票选择 - 只加载选中股票的数据
  const handleSelectStock = useCallback(async (stockId: string, stockName: string) => {
    // 设置选中的股票
    setSelectedStock({
      id: stockId,
      stock_id: stockId,
      name: stockName
    });
    
    // 加载该股票的营收数据
    setLoading(true);
    setError(null);
    try {
      const revenue = await fetchMonthlyRevenue(stockId, useTimeRangeRef.current);
      setRevenueData(revenue);
    } catch (err) {
      setError(`加载股票 ${stockId} 的营收数据失败`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [useTimeRangeRef.current]);

  // 处理时间范围变更 - 只重新加载当前股票的数据
  const handleSetTimeRange = useCallback((months: number) => {
    useTimeRangeRef.current = months
    if (selectedStock) {
      handleSelectStock(selectedStock.stock_id, selectedStock.name);
    }
  }, [selectedStock, handleSelectStock]);

  // 股票搜索函数 - 只在搜索时加载相关股票
  const searchStocks = useCallback(async (query: string): Promise<StockInfo[]> => {
    if (!query.trim()) return [];
    try {
      setLoading(true);
      const stocks = await fetchStocks(query);
      return stocks;
    } catch (err) {
      setError('股票搜索失败');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <StockContext.Provider
      value={{
        selectedStock,
        revenueData,
        loading,
        error,
        timeRange:useTimeRangeRef.current,
        setSelectedStock: handleSelectStock,
        setTimeRange: handleSetTimeRange,
        searchStocks
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStockContext 必须在 StockProvider 内使用');
  }
  return context;
};