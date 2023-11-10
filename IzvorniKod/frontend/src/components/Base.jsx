import { Link } from 'react-router-dom';
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export default function Base({children}) {
    return (
        <Box 
            //bgImage="url(/forest.jpg)" 
            //bgPosition="center"
            minH="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            padding="50px"
        >
            <Flex textAlign="center" flexDirection="column" gap="10px">
                <Text fontSize={{base: "2xl", md: "4xl", lg: "5xl"}} fontFamily="Century Gothic">Welcome to</Text>
                <Link to="/">
                    <Heading fontSize={{base: "4xl", md: "5xl", lg: "6xl"}} color="green.700" fontFamily="Nature">WILD TRACK</Heading>
                </Link>
            </Flex>
            {children}
        </Box>
    )
}
