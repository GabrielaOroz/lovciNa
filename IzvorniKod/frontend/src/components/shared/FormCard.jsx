import { Card, FormControl } from "@chakra-ui/react";

export default function Form({ children }) {
  return (
    <Card
      padding="24px"
      w={{ base: "300px", md: "400px", lg: "500px" }}
      alignSelf="center"
      background="#F9F5E3"
      color="#265336"
      boxShadow="dark-lg"
    >
      <FormControl display="flex" flexDirection="column" gap="22px">
        {children}
      </FormControl>
    </Card>
    
  );
}
