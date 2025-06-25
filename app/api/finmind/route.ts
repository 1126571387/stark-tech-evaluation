// app/api/finmind/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // 禁用静态处理

export async function GET(request: NextRequest) {
  console.log('ssssss')
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    
    // 构建FinMind API的URL
    const apiUrl = new URL('https://api.finmindtrade.com/api/v4/data');
    
    // 将所有查询参数传递过去
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    // 请求数据
    const res = await fetch(apiUrl.toString());
    
    // 处理错误响应
    if (!res.ok) {
      const error = await res.text();
      console.error('FinMind API error:', error);
      return NextResponse.json(
        { error: `FinMind API error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // 返回数据并设置CORS
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}