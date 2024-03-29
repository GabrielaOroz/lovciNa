import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  Input,
  Text,
  Select,
  Stack,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Link } from "react-router-dom";
import GreenButton from "../shared/GreenButton";
import YellowButton from "../shared/YellowButton.jsx";


export default function Manager() {
  const [selectedStation, setSelectedStation] = useState(null); //je li ili nije selectana -- nema mijenjanja
  const [selectedTracker, setSelectedTracker] = useState(null); //trenutni selectan
  const [isAbilitiesModalOpen, setIsAbilitiesModalOpen] = useState(false);
  const [currentSelectedTracker, setCurrentSelectedTracker] = useState(null); // u prozoru
  const [selectedAll, setSelectedAll] = useState(false);
  const [selected, setSelected] = useState(false);

  //slobodni trackeri
  const [availableTrackers, setAvailableTrackers] = useState([]);

  //selectana postaja
  const [markerPosition, setMarkerPosition] = useState(null);
  const [markerName, setMarkerName] = useState("");
  const [isNamingModalOpen, setIsNamingModalOpen] = useState(false);

  //selectani trackeri
  const [selectedTrackers, setSelectedTrackers] = useState([])
  const [selectedAbilities, setSelectedAbilities] = useState({}); //rjecnik - tracker i abilities

  const mapRef = useRef(null);

  
  const sendEmptyMediaList = () => {
    fetch("https://wildback.onrender.com/manager/saveMedia", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mediaList: [], // Sending an empty list
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from /saveMedia:", data);
      })
      .catch((error) => {
        console.error("Error sending empty media list:", error);
      });
  };
  const validateSelectedTrackers = () => {
    const trackersWithoutAbilities = selectedTrackers.filter(
      (tracker) => !selectedAbilities[tracker.id] || selectedAbilities[tracker.id].length === 0
    );
  
    if (trackersWithoutAbilities.length > 0) {
      const trackerNamesWithoutAbilities = trackersWithoutAbilities.map(
        (tracker) => `${tracker.name} ${tracker.surname}`
      );
      
      alert(`Please select abilities for the following tracker(s): ${trackerNamesWithoutAbilities.join(", ")}`);
      
      return false;
    }
    
    return true;
  };
  
  
  
  const fetchExistingStationData = () => {
    fetch("https://wildback.onrender.com/manager/station", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 404) {
          //nije pronasao
          console.log("Station not found.");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        // postavi
        if (data) {
          const existingStation = data;
          setSelectedStation(true);
          setMarkerName(existingStation.name);
          const lat = existingStation.latitude;
          const lng = existingStation.longitude;
          setMarkerPosition({ lat, lng });
          mapRef.current.setView([lat, lng], 16);

        }
      })
      .catch((error) => {
        console.error("Error fetching existing station data:", error);
      });
  };

  const fetchMyTrackers = () => {
    fetch("https://wildback.onrender.com/manager/available-trackers", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSelected(true); //za gumb requirements, ne moze ic na zahtjeve ako nema koga poslat na akciju
      })
      .catch((error) => {
        console.error("Error fetching trackers:", error);
      });
  };

  const fetchTrackers = () => {
    return fetch("https://wildback.onrender.com/manager/trackers", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((trackers) => {
        setAvailableTrackers(trackers);
      });
  };


  useEffect(() => {
    //sendEmptyMediaList()
    fetchExistingStationData();
    fetchMyTrackers();
    fetchTrackers();
  }, []);

  const handleMapClick = (e) => {
    if (!selectedStation) {
      const { lat, lng } = e.latlng;
      setMarkerPosition({ lat, lng });
      setIsNamingModalOpen(true);
      setMarkerName("");

    }
  };

  const handleConfirmName = () => {
    setSelectedStation(true); //odabrano
    setIsNamingModalOpen(false);
    setSelectedAll(false);

    // šaljemo na back naziv postaje, lat i lon

    fetch("https://wildback.onrender.com/manager/selected-station", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: markerName,
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsNamingModalOpen(false);
      })
      .catch((error) => {
      - console.error("Error saving station:", error);
      });
  };

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
    // return null;
  };

  const handleCheckboxChangeTracker = (tracker) => {
    setSelectedTrackers((prevTrackers) => {
      const isTrackerSelected = prevTrackers.includes(tracker);

      if (isTrackerSelected) {
        // Deselect tracker
        return prevTrackers.filter((selected) => selected !== tracker);
      } else {
        // Select tracker
        return [...prevTrackers, tracker];
      }
    });

    setSelectedAbilities((prevAbilities) => {
      const updatedAbilities = { ...prevAbilities };

      if (!updatedAbilities[tracker.id]) {
        updatedAbilities[tracker.id] = [];
      }

      return updatedAbilities;
    });
  };

  const handleAbilitiesCheckboxChange = (ability) => {
    setSelectedAbilities((prevAbilities) => {
      const currentAbilities = prevAbilities[currentSelectedTracker.id] || [];

      if (currentAbilities.includes(ability)) {
        //Ako je sposobnost već odabrana, ukloni je
        return {
          ...prevAbilities, //kopira sve prije
          //ureduje selectanog i njegove abilitiese taji da mice taj ability
          [selectedTracker.id]: currentAbilities.filter((a) => a !== ability),
        };
      } else {
        //dodaj sposobnost
        return {
          ...prevAbilities,
          [selectedTracker.id]: [...currentAbilities, ability],
        };
      }
    });
  };

  const handleSaveAbilities = () => {

      if (validateSelectedTrackers()) {
        fetch("https://wildback.onrender.com/manager/saveAbilities", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedAbilities),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Response from server:", data);
          })
          .catch((error) => {
            console.error("Error saving abilities:", error);
          });
       
        setIsAbilitiesModalOpen(false);
        setSelectedAll(true);
        setSelected(true);
        

      }
    };
    

  return (
    <>
      <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
        Manager
      </Text>
      {!selectedStation && (
        <Text
          color="#f9f7e8"
          fontSize={{ base: "2xl" }}
          style={{ padding: "20px", margin: "16px", backgroundColor: "#306844" }}
        >
          Click on the map and select the location of your station.
        </Text>
      )}

      <Box h="600px" p="16px" id="mapSection">
        <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }} center={[45.8634, 15.9772]} zoom={16}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents />
          {markerPosition && (
            <Marker position={[markerPosition.lat, markerPosition.lng]}>
              <Popup>
                Station: {markerName} <br />
                Latitude: {markerPosition.lat} <br />
                Longitude: {markerPosition.lng}
              </Popup>
            </Marker>
          )}
        </MapContainer>

        <Modal isOpen={isNamingModalOpen} onClose={() => setIsNamingModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter station name</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Station Name"
                value={markerName}
                onChange={(e) => setMarkerName(e.target.value)} //postavimo ime postaje
              />
            </ModalBody>
            <ModalFooter>
              <GreenButton mr={3} onClick={handleConfirmName}>
                Confirm
              </GreenButton>
              <Button variant="ghost" onClick={() => setIsNamingModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Card
        w={{ base: "300px", md: "600px", lg: "800px" }}
        background="#f9f7e8"
        alignSelf="center"
        padding="24px"
        alignItems="center"
      >
        {selectedStation && !selectedAll && (
          <Box maxHeight="240px" overflowY="auto" padding="16px">
            {availableTrackers.length > 0 && (
               <Text style={{paddingBottom: "30px", color: "#306844", textTransform:"uppercase", fontWeight:"bold", fontSize:"24px"}}>Choose trackers for your station</Text>
            )
            }
           
            <Stack spacing={4} direction="column">
              {availableTrackers.map((tracker) => (
                <Checkbox
                  key={tracker.id}
                  value={tracker.name}
                  colorScheme="green"
                  isChecked={selectedTrackers.includes(tracker)}
                  onChange={() => handleCheckboxChangeTracker(tracker)}
                >
                  {tracker.name} {tracker.surname}
                </Checkbox>
              ))}
            </Stack>
          </Box>
        )}

        {selectedStation && selectedTrackers.length > 0 && !selectedAll && (
          <YellowButton
            margin="16px"
            onClick={() => {
              setIsAbilitiesModalOpen(true);
              setCurrentSelectedTracker(null);
            }}
          >
            Edit Trackers Abilities
          </YellowButton>
        )}

        <Modal isOpen={isAbilitiesModalOpen} onClose={() => setIsAbilitiesModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit trackers abilities</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Select
             padding="6px"
             placeholder="Select Tracker"
             onChange={(e) => {
              const selectedTrackerObject = availableTrackers.find((tracker) => {
                return tracker.id === parseInt(e.target.value, 10);
              });
             setSelectedTracker(selectedTrackerObject);
             setCurrentSelectedTracker(selectedTrackerObject);
             
            }}
          >
            {selectedTrackers.map((tracker) => (
             <option key={tracker.id} value={tracker.id}>
              {`${tracker.name} ${tracker.surname}`}
             </option>
           ))}
           </Select>
              {selectedTracker && currentSelectedTracker === selectedTracker && (
                <Stack margin="8px" spacing={4} direction="column">
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedTracker && selectedAbilities[selectedTracker.id]?.includes("ON_FOOT")}
                    onChange={() => handleAbilitiesCheckboxChange("ON_FOOT")}
                  >
                    On foot
                  </Checkbox>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedTracker && selectedAbilities[selectedTracker.id]?.includes("BICYCLE")}
                    onChange={() => handleAbilitiesCheckboxChange("BICYCLE")}
                  >
                    Bicycle
                  </Checkbox>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedTracker && selectedAbilities[selectedTracker.id]?.includes("MOTORCYCLE")}
                    onChange={() => handleAbilitiesCheckboxChange("MOTORCYCLE")}
                  >
                    Motorcycle
                  </Checkbox>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedTracker && selectedAbilities[selectedTracker.id]?.includes("CAR")}
                    onChange={() => handleAbilitiesCheckboxChange("CAR")}
                  >
                    Car
                  </Checkbox>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedTracker && selectedAbilities[selectedTracker.id]?.includes("BOAT")}
                    onChange={() => handleAbilitiesCheckboxChange("BOAT")}
                  >
                    Boat
                  </Checkbox>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedTracker && selectedAbilities[selectedTracker.id]?.includes("DRON")}
                    onChange={() => handleAbilitiesCheckboxChange("DRON")}
                  >
                    Dron
                  </Checkbox>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedTracker && selectedAbilities[selectedTracker.id]?.includes("HELICOPTER")}
                    onChange={() => handleAbilitiesCheckboxChange("HELICOPTER")}
                  >
                    Helicopter
                  </Checkbox>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedTracker && selectedAbilities[selectedTracker.id]?.includes("AIRPLANE")}
                    onChange={() => handleAbilitiesCheckboxChange("AIRPLANE")}
                  >
                    Airplane
                  </Checkbox>
                </Stack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={() => {
                  setIsAbilitiesModalOpen(false);
                  setCurrentSelectedTracker(null);
                }}
              >
                Close
              </Button>
              <GreenButton onClick={handleSaveAbilities}>Confirm</GreenButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {selected && (
          <Link to="/requirements">
            <GreenButton margin="14px">
              Requirements
            </GreenButton>
          </Link>
        )}
      </Card>
    </>
  );
}
