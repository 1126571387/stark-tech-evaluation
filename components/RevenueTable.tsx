
"use client"; // 客户端组件

import React, { useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Skeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';
import { MonthlyRevenue } from '@/lib/types';
import { formatCurrency, formatPercent, prepareChartDataWithGrowth } from '@/lib/utils';
import { useStockContext } from '@/context/StockContext';

const RevenueTable: React.FC = () => {
  const { revenueData, loading, error, timeRange } = useStockContext();
  const tableRef = useRef<HTMLDivElement>(null);
  
  // 准备表格数据（最新数据在前）
  const tableData  = prepareChartDataWithGrowth(revenueData,timeRange);
  // 当数据更新时，滚动到表格最右侧（最新数据）
  useEffect(() => {
    if (tableRef.current && tableData.length > 0) {
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollLeft = tableRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [tableData]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          详细数据
        </Typography>
        
        {error ? (
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : loading ? (
          <Skeleton variant="rectangular" height={200} animation="wave" />
        ) : revenueData.length === 0 ? (
          <Box 
            height={200} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            border="1px dashed #ccc"
            borderRadius={2}
          >
            <Typography color="textSecondary">
              无可用数据
            </Typography>
          </Box>
        ) : (
          <TableContainer 
            component={Paper} 
            ref={tableRef}
            sx={{ maxWidth: '100%', overflowX: 'auto', position: 'relative' }}
          >
            <Table size="small" aria-label="营收数据表" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    年度月份
                  </TableCell>
                  {tableData.map((item) => (
                    <TableCell 
                      key={item.date} 
                      align="right" 
                      sx={{ 
                        minWidth: 100, 
                        fontWeight: 'bold',
                        backgroundColor: '#f5f5f5' 
                      }}
                    >
                      {item.date.substring(2).replace('-', '')}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    每月营收
                  </TableCell>
                  {tableData.map((item) => (
                    <TableCell key={`rev-${item.date}`} align="right">
                      {formatCurrency(item.revenue).replace(' 千元', '')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    月营收年增率(%)
                  </TableCell>
                  {tableData.map((item) => (
                    <TableCell 
                      key={`growth-${item.date}`} 
                      align="right"
                      sx={{ 
                        color: (item.yearly_growth ?? 0) >= 0 ? '#f44336'  :'#4caf50' ,
                        fontWeight: 'bold'
                      }}
                    >
                      {formatPercent(item.yearly_growth ?? 0).replace('%', '')}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueTable;