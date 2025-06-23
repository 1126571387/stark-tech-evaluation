import React from 'react';
import { Box } from '@mui/material';

interface CardContainerProps {
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return (
    <Box 
      display="flex" 
      gap={2} 
      flexWrap="wrap" 
      mb={4}
      sx={{
        '& > *': {
          flex: '1 1 200px',
        }
      }}
    >
      {children}
    </Box>
  );
};

export default CardContainer;