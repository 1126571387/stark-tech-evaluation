
"use client"; // 客户端组件

import React from 'react';
import { useStockContext } from '@/context/StockContext';
import StockSelector from '@/components/StockSelector';
import RevenueChart from '@/components/RevenueChart';
import RevenueTable from '@/components/RevenueTable';
import DataInfoCard from '@/components/DataInfoCard';
import CardContainer from '@/components/CardContainer';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Box, Container, Typography } from '@mui/material';

export default function HomePage() {
  const { 
    selectedStock, 
    revenueData, 
    loading, 
    error 
  } = useStockContext();
  
  // 获取最新月份的数据
  const latestRevenue = revenueData.length > 0 ? revenueData[0] : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        股票营收数据分析
      </Typography>
      
      <StockSelector />
      
      {error && (
        <Box mb={3} p={2} bgcolor="error.light" borderRadius={1}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      <CardContainer>
        {selectedStock && (
          <DataInfoCard 
            title="当前选择股票" 
            value={`${selectedStock.name} (${selectedStock.stock_id})`}
          />
        )}
      </CardContainer>
      
      <Box mb={4}>
        <RevenueChart />
      </Box>
      
      <Box mb={4}>
        <RevenueTable />
      </Box>
    </Container>
  );
}