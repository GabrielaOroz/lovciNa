import MainBase from "../components/shared/MainBase";
import Tracker from "../components/features/Tracker";
import Researcher from "../components/features/Researcher";
import Manager from "../components/features/Manager";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Card, Text } from "@chakra-ui/react";
import GreenButton from "../components/shared/GreenButton";
import { Link } from "react-router-dom";

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    /* TODO - pogledati u koji name back stavlja cookie */
    const session = Cookies.get("name");
    if (session) {
      setSession(JSON.parse(session));
    }
  }, []);

  return (
    <>
      {(!session || session.role == "") && (
        <Card bg="#F9F7ED" align="center" w="300px" p="16px" mt="calc(25% - 100px)" ml="calc(50% - 150px)">
          <Text as="b" color="#306844" align="center" fontSize="xl">
            You don't have access to this page.
          </Text>
          <Link to="/">
            <GreenButton m="16px">Wild Track</GreenButton>
          </Link>
        </Card>
      )}
      {session && (
        <MainBase>
          {session.role == "researcher" && <Researcher />}
          {session.role == "manager" && <Manager />}
          {session.role == "tracker" && <Tracker />}
        </MainBase>
      )}
    </>
  );
}
