import { Box, Button, Card, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Expired() {
  return (
    <Box bgImage="url(/dark-forest.jpg)" bgPosition="center" bgSize="contain" minH="100vh" paddingTop="20rem">
      <Card
        padding="15px"
        w={{ base: "300px", md: "300px", lg: "400px" }}
        alignSelf="center"
        bgColor="gray.200"
        boxShadow="dark-lg"
        margin="0 auto"
        fontWeight="bold"
        textAlign="center"
      >
        <Text fontSize="2xl">Your token has expired!</Text>
        <Text>Please try registering again.</Text>
        <Link to="/register">
          <Button marginTop="10px" colorScheme="green">
            Register
          </Button>
        </Link>
      </Card>
    </Box>
  );
}
