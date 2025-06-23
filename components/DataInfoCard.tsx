"use client";
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DataInfoCardProps {
  title: string;
  value: string | number;
  subValue?: string | number;
  color?: string;
}

const DataInfoCard: React.FC<DataInfoCardProps> = ({ 
  title, 
  value, 
  subValue,
  color = '#1976d2' 
}) => {
  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography 
          variant="h5" 
          component="div"
          sx={{ color, fontWeight: 'bold' }}
        >
          {value}
        </Typography>
        {subValue && (
          <Typography variant="body2" color="textSecondary">
            {subValue}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DataInfoCard;