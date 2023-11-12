import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	fonts: {
		heading: `Nature`,
		//body: `Comic Sans MS`
		body: `Century Gothic`,
	},
	styles: {
		global: {
			// styles for the `body`
			body: {
				bg: "",
			},
		},
	},
});

export default theme;
