import React, { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Input, Select, Text, Modal, Checkbox, 
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter } from "@chakra-ui/react";
import GreenButton from "../components/shared/GreenButton";
import YellowButton from "../components/shared/YellowButton";
import podaci from "../pomoc.jsx";
import trackersData from "../trackersData.jsx";


import { useNavigate } from "react-router-dom";

export default function CreateAction() {
  const [session, setSession] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState(podaci); // kasnije []
  const [isModalOpen, setModalOpen] = useState(false);
  const [trackers, setTrackers] = useState(trackersData);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedTrackers, setSelectedTrackers] = useState([]);



  useEffect(() => {
    fetchCurrentUser();
    //fetchIncomingRequests();

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
  const fetchTrackers = () => {
    fetch("http://localhost:8000/api/trackers", {
        method: "GET",
        credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setTrackers(data);
        })
        .catch((error) => {
            console.error("Error fetching trackers:", error);
        });
    };
  const hasAccess = session && session.role === "manager" && session.approved === true;

  const navigate = useNavigate();


  const submit = () => {
    navigate("/home");
  }

  const handleResponseButtonClick = () => {
      setModalOpen(true); 
      setSelectedRequestId(request.id);
      fetchTrackers();
    };
  
  const handleTrackerCheckboxChange = (trackerId) => {
    const updatedTrackers = selectedTrackers.includes(trackerId)
      ? selectedTrackers.filter((selectedId) => selectedId !== trackerId)
      : [...selectedTrackers, trackerId];
    setSelectedTrackers(updatedTrackers);
  };

  const handleDoneButtonClick = () => {
    console.log(selectedTrackers);
    const requestedTrackersCount =
      incomingRequests.find((request) => request.id === selectedRequestId)
        ?.numberOfTrackers || 0;
  
    if (selectedTrackers.length < requestedTrackersCount) {
      // Ako je odabrano manje tragača od traženog broja
      alert("Please select more trackers!");
    } else if (selectedTrackers.length > requestedTrackersCount) {
      // Ako je odabrano više tragača od traženog broja
      alert(`Please select exactly ${requestedTrackersCount} trackers!`);
    } else {
      // Ako je odabrano točno traženi broj tragača
      // Šaljemo na backend listu tragača s njihovim id-ijem i imenom
      const selectedTrackersData = selectedTrackers.map((trackerId) => {
        const selectedTracker = trackers.find((tracker) => tracker.id === trackerId);
        return {
          id: selectedTracker.id,
          name: selectedTracker.name,
        };
      });
  
      // slanje na back
      fetch("http://localhost:8000/api/submit-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId: selectedRequestId,
        selectedTrackers: selectedTrackersData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from the backend:", data);
      })
      .catch((error) => {
        console.error("Error submitting action:", error);
      });

    // Uklanjamo zahtjev iz stanja incomingRequests
    setIncomingRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== selectedRequestId)
    );
    
  
      // Uklanjamo zahtjev iz stanja incomingRequests
      setIncomingRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== selectedRequestId)
      );
      setSelectedTrackers([]);
      setModalOpen(false);
    }
  };

  return (
    <>
    {session && hasAccess && (
        <Flex flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
        <Card background="#F9F7ED" w="800px" padding="32px" align="center" borderRadius="12px 12px 0 0" style={{ height: "360px", overflow: "auto" }}>

          <h1 style={{ paddingBottom: "24px", paddingTop: "8px"}}>Incoming Requests...</h1>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ padding: "8px" }}>TITLE</th>
                <th style={{ padding: "8px" }}>RESEARCHER</th>
                <th style={{ padding: "8px" }}>NUMBER OF TRACKERS</th>
                <th style={{ padding: "8px" }}>ABILITY</th>
                <th style={{ padding: "8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {incomingRequests.map((request) => (
                <tr key={request.id}>
                  <td style={{ width: "150px", padding: "8px" }}>{request.title}</td>
                  <td style={{ padding: "8px" }}>{request.researcher}</td>
                  <td style={{ padding: "8px" }}>{request.numberOfTrackers}</td>
                  <td style={{ padding: "8px" }}>{request.ability}</td>
                  <td style={{ padding: "8px" }}>
                    <YellowButton onClick={() => handleResponseButtonClick()}>
                      Respond
                    </YellowButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card background="#F9F7ED" w="800px" padding="16px" align="center"  borderRadius="0 0 12px 12px" >
          <GreenButton onClick={submit}>
            Home
          </GreenButton>
        </Card>
    </Flex>

    )}
    
      {!session && <Text>You don't have access to this page.</Text>}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: "#306844", boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)", height: "80vh" }}>
        <ModalHeader style={{ color: "#F1EDD4", fontSize: "24px", }}>
          {incomingRequests
            .find((request) => request.id === selectedRequestId)
            ?.title + " - " + incomingRequests.find((request) => request.id === selectedRequestId)?.researcher}
        </ModalHeader>
          <ModalBody>
            <Text style={{paddingBottom: "8px", fontStyle: "italic", color: "#F1EDD4", fontSize: "18px"}}>
              Number of trackers:{" "}
              <Text as="span" style={{ float: "right", color: "#F1EDD4", fontStyle:"normal", fontWeight: "bold", paddingBottom: "8px", paddingRight: "24px"}}>
                {incomingRequests
                  .find((request) => request.id === selectedRequestId)
                  ?.numberOfTrackers}
              </Text>
            </Text>
            <Text style={{color: "#F1EDD4", paddingTop: "40px", paddingBottom: "24px", textAlign: "center", fontSize: "22px", textTransform: "uppercase"}}>
              Select trackers for action
            </Text>
            <Box overflowY="auto" maxHeight="240px" paddingY="24px">
              {trackers.map((tracker) => (
                <Text key={tracker.id} style={{ whiteSpace: "pre-wrap", color: "#F1EDD4", paddingLeft:"32px", paddingBottom:"10px" }}>
                  <Checkbox
                    isChecked={selectedTrackers.includes(tracker.id)}
                    onChange={() => handleTrackerCheckboxChange(tracker.id)}
                    colorScheme=""
                  >
                    {tracker.name}
                  </Checkbox>
                </Text>
              ))}
            </Box>
            <hr style={{ borderColor: "#F1EDD4", margin: "24px 0 0 0", width: "100%",  borderWidth: "1px", boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)"}} />
          </ModalBody>
          <ModalFooter style={{ display: "flex", justifyContent: "center", margin: "16px" }}>
          <Button variant="outline" marginRight="8px"style={{ borderColor: "#F1EDD4", color: "#F1EDD4"}} onClick={() => {setModalOpen(false); setSelectedTrackers([])}}>
            Close
          </Button>
          <YellowButton marginLeft="8px" onClick={() => handleDoneButtonClick()}>
            Done
          </YellowButton>
        </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}