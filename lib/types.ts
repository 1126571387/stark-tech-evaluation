
// 股票基本信息
export interface StockInfo {
  id: string;
  stock_id: string;
  name: string;
}

// 月营收数据
export interface MonthlyRevenue {
  date: string; // YYYY-MM
  revenue: number;
  revenue_month?: number;
  revenue_year?: number;

  monthly_growth?: number; // 月增率
  yearly_growth?: number; // 年增率
}

// 图表数据点
export interface ChartDataPoint {
  date: string;
  revenue: number;
  growth: number; // 年增长率
}

// 新增：计算单月营收年增率所需的数据结构
export interface RevenueComparison {
  currentMonth: MonthlyRevenue;
  previousYearMonth: MonthlyRevenue | null;
}