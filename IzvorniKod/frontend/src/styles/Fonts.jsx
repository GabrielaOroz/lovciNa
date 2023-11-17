import { Global } from "@emotion/react";

const Fonts = () => (
	<Global
		styles={`
      @font-face {
        font-family: 'Nature';
        font-style: normal;
        src: url('/Nature.ttf');
      }
    `}
	/>
);

export default Fonts;
