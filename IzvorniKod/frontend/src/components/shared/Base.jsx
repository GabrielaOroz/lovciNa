import { Link } from "react-router-dom";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export default function Base({ children }) {
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      padding="32px"
      style={{ userSelect: "none" }}
    >
      <Flex textAlign="center" flexDirection="column" gap="8px">
        <Text fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}>Welcome to</Text>
        <Link to="/">
          <Heading fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }} color="#265336" fontFamily="Nature">
            WILD TRACK
          </Heading>
        </Link>
      </Flex>
      {children}
    </Box>

  );
}
