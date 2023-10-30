import { Link } from 'react-router-dom';
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Rain from './Rain';

export default function Base({children}) {
    const numberOfDroplets = 30;

    const createDroplets = () => {
      const droplets = [];
  
      for (let i = 0; i < numberOfDroplets; i++) {
        droplets.push(<Rain key={i} />);
      }
      
      return droplets;
    };

    return (
        <Box 
            bgImage="url(/forest.jpg)" 
            bgPosition="center" 
            height="100vh" 
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            padding="50px"
            style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
        >
            {createDroplets()}
            <Flex textAlign="center" flexDirection="column" gap="10px">
                <Text fontSize="5xl">Welcome to</Text>
                <Link to="/">
                    <Heading fontSize="6xl" color="green.700" fontFamily="Nature">WILD TRACKER</Heading>
                </Link>
            </Flex>
            {children}
        </Box>
        
    )
}
