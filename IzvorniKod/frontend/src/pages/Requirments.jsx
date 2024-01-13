import React, { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Input, Select, Text, Modal, Checkbox, 
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,  Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import GreenButton from "../components/shared/GreenButton";
import YellowButton from "../components/shared/YellowButton";
import podaci from "../pomoc.jsx";
import trackersData from "../trackersData.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateAction() {
  const [session, setSession] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState(podaci); // kasnije []
  const [isModalOpen, setModalOpen] = useState(false);
  const [trackers, setTrackers] = useState(trackersData); //kasnije prazno
  const [selectedRequestId, setSelectedRequestId] = useState(null); //trenutni odabrani
  const [selectedTrackers, setSelectedTrackers] = useState([]); //šaljem trackera i ability

  const [selectedRequestAbilities, setSelectedRequestAbilities] = useState({}); //car : 5

  const [selectedTab, setSelectedTab] = useState(0)
  const [currentTab, setCurrentTab] = useState(0);



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
    fetch("http://localhost:8000/manager/incoming-requests", {
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
    fetch("http://localhost:8000/manager/available-trackers", {
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

    const getFilteredTrackers = (ability) => {
     return trackers.filter((tracker) => tracker.abilities.includes(ability));
    };

  const hasAccess = session && session.role === "manager" && session.approved === true;

  const navigate = useNavigate();


  const submit = () => {
    navigate("/home");
  }

  const handleResponseButtonClick = (request) => {
      //fetchTrackers();
      setModalOpen(true); 
      setSelectedRequestId(request.id);


      //const filteredTrackers = getFilteredTrackers(requestAbility);
      //setTrackers(filteredTrackers);
      setSelectedRequestAbilities(request.requirments);
      
    };
  
  const handleTrackerCheckboxChange = (trackerId) => {
    const selectedTracker = trackers.find((tracker) => tracker.id === trackerId);

    if (!selectedTracker) {
      console.error("Tracker not found");
      return;
    }
  
    const ability = Object.keys(selectedRequestAbilities)[currentTab]; // Dobavi ability prema trenutnom tabu
    const updatedTrackers = selectedTrackers.some((tracker) => tracker.id === selectedTracker.id)
      ? selectedTrackers.filter((tracker) => tracker.id !== selectedTracker.id)
      : [
          ...selectedTrackers,
          { id: selectedTracker.id, ability: ability },
        ];
  
    setSelectedTrackers(updatedTrackers);
    console.log(selectedTrackers);
    //const updatedTrackers = selectedTrackers.includes(trackerId)
      //? selectedTrackers.filter((selectedId) => selectedId !== trackerId)
      //: [...selectedTrackers, trackerId];
    //setSelectedTrackers(updatedTrackers);
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
                <th style={{ padding: "8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {incomingRequests.map((request) => (
                <tr key={request.id}>
                  <td style={{padding: "8px" }}>{request.title}</td>
                  <td style={{ padding: "8px" }}>{request.researcher}</td>
                  <td style={{ padding: "8px" }}>
                    <YellowButton onClick={() => handleResponseButtonClick(request)}>
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
          <ModalContent style={{
            backgroundColor: "#306844",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
            height: "auto",
            maxHeight: "90vh",
            overflowY: "auto",
            overflowX: "hidden",  // Onemogućava vodoravno pomicanje
            width: "100%",
            mx: "auto",
          }}>
            
        <ModalHeader style={{ color: "#F1EDD4", fontSize: "24px", }}>
          {incomingRequests
            .find((request) => request.id === selectedRequestId)
            ?.title + " - " + incomingRequests.find((request) => request.id === selectedRequestId)?.researcher}
        </ModalHeader>
        <ModalBody>
            <Text
              style={{
                color: "#F1EDD4",
                paddingTop: "8px",
                paddingBottom: "8px",
                fontSize: "18px",
              }}
            >
              Abilities required:
            </Text>
            <Box>
              {Object.entries(selectedRequestAbilities).map(
                ([ability, count]) => (
                  <Text
                    key={ability}
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "#F1EDD4",
                      paddingLeft: "24px",
                      paddingBottom: "10px",
                      paddingRight: "32px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{`•    ${ability}:`}</span>
                    <span>{count}</span>
                  </Text>
                )
              )}
            </Box>
            <Text
              style={{
                color: "#F1EDD4",
                paddingTop: "40px",
                paddingBottom: "24px",
                textAlign: "center",
                fontSize: "22px",
                textTransform: "uppercase",
              }}
            >
              Select trackers for action
            </Text>
            <Tabs>
            <TabList
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                overflowY: "hidden",
              }}
            >
              {Object.keys(selectedRequestAbilities).map((ability, index) => (
                <Tab
                  key={ability}
                  style={{
                    color: selectedTab === index ? "#306844" : "#F1EDD4", 
                    backgroundColor: selectedTab === index ? "#F1EDD4" : "#306844", 
                    fontSize: "16px",
                  }}
                 css={{ _selected: { color: "black", backgroundColor: "green" }}}
                  onClick={() => {
                    setSelectedTab(index);
                    setCurrentTab(index); // Postavi trenutni tab kada se klikne
                  }}
                >
                  {ability}
                </Tab>
              ))}
            </TabList>



              <TabPanels>
                {Object.keys(selectedRequestAbilities).map((ability) => (
                  <TabPanel key={ability}>
                    <Box overflowY="auto" maxHeight="160px" paddingY="24px">
                    {getFilteredTrackers(ability).map((tracker) => (
                      <Text
                        key={tracker.id}
                        style={{
                          whiteSpace: "pre-wrap",
                          color: "#F1EDD4",
                          paddingLeft: "32px",
                          paddingBottom: "10px",
                          display: "flex",
                          alignItems: "center", // Dodano kako bi se checkboxevi poravnavali s tekstu
                        }}
                      >
                        <Checkbox
                          isChecked={selectedTrackers.some((t) => t.id === tracker.id)}
                          onChange={() => handleTrackerCheckboxChange(tracker.id)}
                          colorScheme=""
                        >
                          {tracker.name}
                        </Checkbox>
                      </Text>
                    ))}
                    </Box>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
           
            <div style={{ bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", margin: "16px" }}>
              <Button variant="outline" marginRight="8px" style={{ borderColor: "#F1EDD4", color: "#F1EDD4" }} onClick={() => { setModalOpen(false); setSelectedTrackers([]) }}>
                Close
              </Button>
              <YellowButton marginLeft="8px" onClick={() => handleDoneButtonClick()}>
                Done
              </YellowButton>
            </div>
            <hr
              style={{
                borderColor: "#F1EDD4",
                margin: "32px 0 32px 0",
                width: "100%",
                borderWidth: "1px",
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}