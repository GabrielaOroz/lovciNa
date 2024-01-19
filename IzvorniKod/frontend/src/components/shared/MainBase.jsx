import { Box, Card } from "@chakra-ui/react";
import Header from "./Header";

export default function MainBase({ children }) {
  return (
    <Box
      bgImage="url(/forest.jpg)"
      bgPosition="center"
      minH="100vh"
      display="flex"
      flexDirection="column"
      padding="20px"
    >
      <Header />
      <Card
        background="#F9F7ED"
        w={{ base: "400px", md: "800px", lg: "1200px" }}
        alignSelf="center"
        margin="8px"
        padding="16px"
      >
        {children}
      </Card>
    </Box>
    
  );
}
