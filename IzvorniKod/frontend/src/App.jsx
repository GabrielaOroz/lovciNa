import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Confirm from "./pages/Confirm";
import Expired from "./pages/Expired";
import Admin from "./pages/Admin";
import ListOfUsers from "./pages/ListOfUsers";
import Home from "./pages/Home";
import CreateRequirements from "./pages/CreateRequirements";
import MissingPage from "./pages/MissingPage";
import Fonts from "./styles/Fonts";
import theme from "./styles/theme";
import CreateActions from "./pages/CreateActions";
import Requirments from "./pages/Requirments";

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/expired" element={<Expired />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/list-of-users" element={<ListOfUsers />} />
          <Route path="/home" element={<Home />} />
          <Route path="/new-requirements" element={<CreateRequirements />} />
          <Route path="/new-actions" element={<CreateActions />} />
          <Route path="/requirments" element={<Requirments />} />
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
    
  );
}
