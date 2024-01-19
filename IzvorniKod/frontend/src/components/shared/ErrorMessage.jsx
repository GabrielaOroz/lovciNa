import { Text } from "@chakra-ui/react";

export default function ErrorMessage({ children }) {
  return (
    <Text alignSelf="center" fontSize="sm" fontWeight="bold" color="#CC0000">
      {children}
    </Text>
    
  );
}
