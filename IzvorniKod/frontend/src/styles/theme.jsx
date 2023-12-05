import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `Nature`,
    body: `Century Gothic`,
  },
  styles: {
    global: {
      body: {
        bgImage: "url('./forest.jpg')",
        bgRepeat: "no-repeat",
        bgAttachment: "fixed",
        bgSize: "cover",
        bgPosition: "center",
      },
    },
  },
});

export default theme;
