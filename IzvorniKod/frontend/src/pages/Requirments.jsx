import React, { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Input, Select, Text } from "@chakra-ui/react";
import GreenButton from "../components/shared/GreenButton";
import YellowButton from "../components/shared/YellowButton";
import podaci from "../pomoc.jsx";


import { useNavigate } from "react-router-dom";

export default function CreateAction() {
  const [session, setSession] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState(podaci); // kasnije []


  useEffect(() => {
    fetchCurrentUser();
    fetchIncomingRequests();

  }, []);

  const fetchCurrentUser = () => {
    fetch("http://localhost:8000/auth/current-user", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSession(data);
        });
  }

  const fetchIncomingRequests = () => {
    fetch("http://localhost:8000/api/incoming-requests", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setIncomingRequests(data);
        })
        .catch((error) => {
          console.error("Error fetching incoming requests:", error);
        });
  

  }

  const hasAccess = session && session.role === "manager" && session.approved === true;

  const navigate = useNavigate();


  const submit = () => {
    navigate("/home");
  }

  return (
    <>
    {session && hasAccess && (
        <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <Card background="#F9F7ED" w="500px" padding="32px" align="center">

        <h1 style={{padding: "15px"}}>Incoming Requests</h1>
        <table>
            <thead>
            <tr>
                <th>TITLE</th>
                <th>RESEARCHER</th>
                <th>NUMBER OF TRACKERS</th>
                <th>ABILITY</th>
            </tr>
            </thead>
            <tbody>
            {incomingRequests.map((request) => (
                <tr key={request.id}>
                <td>{request.title}</td>
                <td>{request.researcher}</td>
                <td>{request.numberOfTrackers}</td>
                <td>{request.ability}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <GreenButton onClick={submit}>Home</GreenButton>
    </Card>
    </Flex>
    )}
    
      {!session && <Text>You don't have access to this page.</Text>}
    </>
  );
}
