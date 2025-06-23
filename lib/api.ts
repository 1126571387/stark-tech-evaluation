import axios from 'axios';
import { StockInfo, MonthlyRevenue } from './types';

// 从环境变量获取Token
const TOKEN = process.env.NEXT_PUBLIC_FINMIND_TOKEN;

if (!TOKEN) {
  throw new Error('FINMIND_TOKEN is not defined in environment variables');
}

// 创建配置了认证头的 API 实例
const api = axios.create({
  baseURL: 'https://api.finmindtrade.com/api/v4/data',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  }
});

/**
 * 获取股票列表
 * dataset 参数为 string
 * 示例：dataset: 'TaiwanStockInfo'
 */
export const fetchStocks = async (query: string): Promise<StockInfo[]> => {
  try {
    const response = await api.get('', {
      params: {
        dataset: 'TaiwanStockInfo',
        data_id: query
      }
    });
    // 添加调试日志
    return response.data.data
      .filter((item: any) => item.stock_id && item.stock_name)
      .map((item: any) => ({
        id: item.stock_id,
        stock_id: item.stock_id,
        name: item.stock_name
      }))
      .slice(0, 50);
  } catch (error) {
    console.error('股票搜索失败:', error);
    return [];
  }
};

export const fetchMonthlyRevenue = async (
  stockId: string,
  selectedMonths: number = 12 // 用户选择的时间范围（6, 12, 36, 60）
): Promise<MonthlyRevenue[]> => {
  try {
    // 计算需要获取的总月份数：用户选择的范围 + 额外获取1年(12个月)用于计算年增率
    const extraMonths = 12; // 多获取12个月用于年增率比较
    const totalMonths = selectedMonths + extraMonths;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - totalMonths);

    const response = await api.get('', {
      params: {
        dataset: 'TaiwanStockMonthRevenue',
        data_id: stockId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    });
    return response.data.data
      .filter((item: any) => item.revenue)
      .map((item: any) => ({
        date: item.date.substring(0, 7), // YYYY-MM
        revenue: Number(item.revenue),
        monthly_growth: item.revenue_month ? Number(item.revenue_month) : undefined,
        yearly_growth: Number(item.revenue_year),

        revenue_month: Number(item.revenue_month),
        revenue_year: Number(item.revenue_year),
      }))
      .sort((a: MonthlyRevenue, b: MonthlyRevenue) =>
        a.date.localeCompare(b.date) // 从旧到新排序
      );
  } catch (error) {
    console.error(`获取股票 ${stockId} 的营收数据失败:`, error);
    throw new Error(`获取股票 ${stockId} 的营收数据失败`);
  }
};