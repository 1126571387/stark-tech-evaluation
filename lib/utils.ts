
import { MonthlyRevenue, ChartDataPoint } from './types';

/**
 * 格式化货币金额
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' 千元';
};

/**
 * 格式化百分比
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

/**
 * 计算年增率
 */
const calculateYearlyGrowth = (current: number, previous: number | null): number | null => {
  if (previous === null) {
    return null;
  }
  
  return ((current - previous) / previous) * 100;
};

/**
 * 准备图表数据
 */
export const prepareChartData = (data: MonthlyRevenue[]): ChartDataPoint[] => {
  return data.map(item => ({
    date: item.date,
    revenue: item.revenue,
    growth: item.revenue_year ?? 0,
  }));
};

/**
 * 获取最新N个月的数据
 */
export const getLatestMonths = (data: MonthlyRevenue[], count: number = 12): MonthlyRevenue[] => {
  return data.slice(0, count);
};

/**
 * 准备图表数据并计算年增率
 */
export const prepareChartDataWithGrowth = (
  revenueData: MonthlyRevenue[],
  months: number
): MonthlyRevenue[] => {
  // 按日期排序（从旧到新）
  const sortedData = [...revenueData].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const recentData = revenueData.slice(-months);
  
  // 创建包含年增率的新数据
  return recentData.map((currentMonth, index) => {
    // 查找去年同月数据
    const [year, month] = currentMonth.date.split('-');
    const previousYear = `${parseInt(year) - 1}-${month}`;

    const previousYearMonth = sortedData.find(
      item => item.date === previousYear
    );

    // 计算年增率
    const yearlyGrowth = calculateYearlyGrowth(
      currentMonth.revenue,
      previousYearMonth?.revenue || null
    );
    
    return {
      ...currentMonth,
      yearly_growth: yearlyGrowth ?? undefined
    };
  })
};

/**
 * 格式化年增率显示
 */
export const formatGrowth = (value: number | null): string => {
  if (value === null) return 'N/A';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};