"use client"; // 客户端组件

import React, { useMemo } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
  Label
} from 'recharts';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Skeleton,
  ButtonGroup,
  Button,
  useTheme
} from '@mui/material';
import { useStockContext } from '@/context/StockContext';
import { 
  formatCurrency, 
  prepareChartDataWithGrowth, 
  formatGrowth 
} from '@/lib/utils';

// 自定义工具提示组件
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // 提取柱状图和折线图的数据
    const barData = payload.find((p: { dataKey: string; }) => p.dataKey === 'revenue');
    const lineData = payload.find((p: { dataKey: string; }) => p.dataKey === 'yearly_growth');
    
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        minWidth: '220px'
      }}>
        <div style={{ 
          marginBottom: '8px',
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: '6px'
        }}>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>
            {label}
          </div>
        </div>
        
        {barData && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#FFD700',
              borderRadius: '2px',
              marginRight: '8px'
            }}></div>
            <div style={{ fontSize: '13px' }}>
              每月营收: <span style={{ fontWeight: 600 }}>{formatCurrency(barData.value)}</span>
            </div>
          </div>
        )}
        
        {lineData && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#FF4500',
              borderRadius: '50%',
              marginRight: '8px'
            }}></div>
            <div style={{ fontSize: '13px' }}>
              年增率: <span style={{ fontWeight: 600 }}>{formatGrowth(lineData.value)}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const RevenueChart: React.FC = () => {
  const theme = useTheme();
  const { revenueData, loading, error, setTimeRange, timeRange } = useStockContext();
  
  // 使用prepareChartDataWithGrowth处理数据并计算年增率
  const chartData = useMemo(() => {
    const dataWithGrowth = prepareChartDataWithGrowth(revenueData,timeRange);
    
    return dataWithGrowth.map(item => {
      // 将日期从YYYY-MM转换为XX.XX格式(例如:2020-11->20.11)
      const dateParts = item.date.split('-');
      const formattedDate = dateParts.length === 2 
        ? `${dateParts[0].slice(2)}.${dateParts[1]}`
        : item.date;
      
      return {
        ...item,
        revenue: item.revenue,
        yearly_growth: item.yearly_growth,
        formattedDate // 用于X轴显示
      };
    });
  }, [revenueData]);

  // 反转数据以确保最新数据在右侧
  const displayData = useMemo(() => {
    return [...chartData]
  }, [chartData]);

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            每月营收
          </Typography>
          
          <ButtonGroup size="small" variant="outlined">
            <Button 
              onClick={() => setTimeRange(6)} 
              variant={timeRange === 6 ? 'contained' : 'outlined'}
            >
              近6月
            </Button>
            <Button 
              onClick={() => setTimeRange(12)} 
              variant={timeRange === 12 ? 'contained' : 'outlined'}
            >
              近1年
            </Button>
            <Button 
              onClick={() => setTimeRange(36)} 
              variant={timeRange === 36 ? 'contained' : 'outlined'}
            >
              近3年
            </Button>
            <Button 
              onClick={() => setTimeRange(60)} 
              variant={timeRange === 60 ? 'contained' : 'outlined'}
            >
              近5年
            </Button>
          </ButtonGroup>
        </Box>
        
        {error ? (
          <Box 
            height={300} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            bgcolor="background.default"
            borderRadius={2}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : loading ? (
          <Skeleton variant="rectangular" height={300} animation="wave" />
        ) : revenueData.length === 0 ? (
          <Box 
            height={300} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            border="1px dashed"
            borderColor="divider"
            borderRadius={2}
            bgcolor="background.default"
          >
            <Typography color="textSecondary">
              无可用数据
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={displayData}
              margin={{
                top: 20,
                right: 30,
                left: 30,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
              
              {/* X轴：显示格式为 XX.XX 的月份 */}
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              
              {/* 左侧Y轴：每月营收（单位：千元） */}
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              >
                <Label 
                  value="千元" 
                  angle={-90} 
                  position="insideLeft" 
                  offset={-15}
                  style={{ 
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary 
                  }}
                />
              </YAxis>
              
              {/* 右侧Y轴：年增率（百分比） */}
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
                tickFormatter={(value) => `${value}%`}
              >
                <Label 
                  value="年增率(%)" 
                  angle={90} 
                  position="insideRight" 
                  offset={-15}
                  style={{ 
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary 
                  }}
                />
              </YAxis>
              
              {/* 工具提示：根据图片要求自定义 */}
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: theme.palette.action.hover }}
              />
              
              {/* 图例：位置在图表顶部 */}
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => (
                  <span style={{ fontSize: '12px' }}>{value}</span>
                )}
              />
              
              {/* 柱状图：每月营收 */}
              <Bar 
                yAxisId="left" 
                dataKey="revenue" 
                name="每月营收" 
                fill="#FFD700" // 黄色，与图片要求一致
                barSize={20}
              />
              
              {/* 折线图：每月营收年增率 */}
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="yearly_growth" 
                name="单月营收年增率(%)" 
                stroke="#FF4500" // 红色，与图片要求一致
                strokeWidth={2}
                dot={{
                  r: 4,
                  strokeWidth: 0,
                  stroke: "#FF4500",
                  fill: "#fff"
                }}
                activeDot={{
                  r: 6,
                  stroke: "#FF4500",
                  strokeWidth: 2,
                  fill: "#fff"
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;