import React from 'react';
import { Box } from '@chakra-ui/react';

const Rain = () => {
  return (
    <Box
      as="span"
      position="absolute"
      fontSize="1rem"
      transform="rotate(45deg)"
      animation={`fall ${(Math.random() * 5 + 3)}s linear infinite`}
      style={{
        top: `${Math.random() * -20}vh`,
        left: `${Math.random() * 100}vw`,
        transition: 'top 2s, left 2s',
      }}
    >
      𓄼
    </Box>
  );
};

export default Rain;