
"use client"; //将布局转换为客户端组件
import React from 'react';
import { StockProvider } from '@/context/StockContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans TC',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-TW">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <title>股票营收数据展示系统</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StockProvider>
            {children}
          </StockProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}