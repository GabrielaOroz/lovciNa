import MainBase from "../components/shared/MainBase";
import Tracker from "../components/features/Tracker";
import Researcher from "../components/features/Researcher";
import Manager from "../components/features/Manager";
import { useEffect, useState } from "react";
import { Card, Text } from "@chakra-ui/react";

export default function Home() {
  const [session, setSession] = useState();

  useEffect(() => {
    fetch("http://localhost:8000/auth/current-user", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setSession(data);
      });
  }, []);

  const hasAccess = session && (session.role === "tracker" || session.approved === true);

  return (
    <>
      {!session && <Text>You don't have access to this page.</Text>}
      {session && !hasAccess && (
        <MainBase>
          <Text as="b" color="#306844" align="center" fontSize="xl">
            You do not yet have access to this page.
          </Text>
        </MainBase>
      )}
      {session && hasAccess && (
        <MainBase>
          {session.role == "researcher" && <Researcher />}
          {session.role == "manager" && <Manager />}
          {session.role == "tracker" && <Tracker />}
        </MainBase>
      )}
    </>
  );
}
