import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Confirm from "./components/pages/Confirm";
import Admin from "./components/pages/Admin";
import ListOfUsers from "./components/pages/ListOfUsers";
import Start from "./components/pages/Start";
import Fonts from "./styles/Fonts";
import theme from "./styles/theme";
import MissingPage from "./components/pages/MissingPage";
import "./styles/Base.css";

export default function App() {
	return (
		<ChakraProvider theme={theme}>
			<Fonts />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/confirm" element={<Confirm />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="/admin-listOfUsers" element={<ListOfUsers />} />
					<Route path="/start" element={<Start />} />
					<Route path="*" element={<MissingPage />} />
				</Routes>
			</BrowserRouter>
		</ChakraProvider>
	);
}
