import { Button } from "@chakra-ui/react";

export default function GreenButton({ children, ...props }) {
  return (
    <Button
      bgColor="#306844"
      _hover={{
        bgColor: "#447756",
        shadow: "0px 2px 3px rgba(48, 104, 68, 0.4), 0px 0px 0px 3px rgba(48, 104, 68, 0.8)",
      }}
      color="#FEFDFA"
      borderRadius="10px"
      {...props}
    >
      {children}
    </Button>
    
  );
}
