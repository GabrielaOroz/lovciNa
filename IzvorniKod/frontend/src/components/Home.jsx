import { Link } from 'react-router-dom';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text } from "@chakra-ui/react";
import Rain from './Rain';

export default function Home() {
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
    >
      <Flex textAlign="center" flexDirection="column" gap="10px">
        <Text fontSize="5xl">Welcome to</Text>
        <Heading fontSize="6xl" color="green" fontFamily="Nature">WILD TRACKER</Heading>
      </Flex>
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>{createDroplets()}</div>
      <Flex alignSelf="center" gap="50px">
          <Link to="/login">
            <Button size="lg" colorScheme="green">LogIn</Button>
          </Link>
          <Link to="/register">
            <Button size="lg">Register</Button>
          </Link>
      </Flex>
    </Box>
  )
}