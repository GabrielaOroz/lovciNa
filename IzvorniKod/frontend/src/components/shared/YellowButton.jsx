import { Button } from "@chakra-ui/react";

export default function YellowButton({ children, ...props }) {
  return (
    <Button
      bgColor="#EBE5C1"
      _hover={{
        bgColor: "#F1EDD4",
        shadow: "0px 2px 3px rgba(235, 229, 193, 0.2), 0px 0px 0px 3px rgba(235, 229, 193, 0.5)",
      }}
      color="#0E1F14"
      borderRadius="10px"
      {...props}
    >
      {children}
    </Button>
  );
}
