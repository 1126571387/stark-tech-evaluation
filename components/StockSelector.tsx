"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStockContext } from '@/context/StockContext';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  InputAdornment,
  CircularProgress,
  debounce
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { StockInfo } from '@/lib/types';

const StockSelector: React.FC = () => {

  const { searchStocks, selectedStock, setSelectedStock } = useStockContext();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<StockInfo[]>([]);
  const [searching, setSearching] = useState(false);

  // 使用 useMemo 创建防抖函数，确保只创建一次
  const debouncedSearch = useMemo(() => 
    debounce(async (value: string) => {
      if (!value.trim()) {
        setOptions([]);
        return;
      }
      
      setSearching(true);
      try {
        const result = await searchStocks(value);
        setOptions(result);
      } finally {
        setSearching(false);
      }
    }, 900), //900ms 防抖延迟
    [searchStocks]
  );
  

  // 输入变化处理
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <Box mb={4}>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => `${option.name} (${option.stock_id})`}
        value={selectedStock}
        onChange={(_, newValue) => {
          if (newValue) {
            setInputValue('');
            setOptions([]);
          }
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          handleInputChange(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="输入台/美股代赋，查看公司價值"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {searching ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option, { index }) => (
          <Box component="li" {...props} key={`${option.stock_id}-${index}`} onClick={() => {
            if (option) {
              setOptions([]);
              setInputValue('');
              setSelectedStock(option.stock_id, option.name);
            }
          }}>
            <Box>
              <Typography fontWeight="bold">{option.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {option.stock_id}
              </Typography>
            </Box>
          </Box>
        )}
        noOptionsText={inputValue ? "未找到匹配的股票" : "输入股票代号或名称进行搜索"}
        loading={searching}
        loadingText="搜索中..."
      />
    </Box>
  );
};

export default StockSelector;