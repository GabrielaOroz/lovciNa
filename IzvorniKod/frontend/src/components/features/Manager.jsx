import React, { useEffect, useState, useRef } from 'react';
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
} from '@chakra-ui/react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import podaci from "../../pomoc2.jsx";
import { Link } from "react-router-dom";
import GreenButton from "../shared/GreenButton";
import YellowButton from '../shared/YellowButton.jsx';

export default function Manager() {
  const [selectedStation, setSelectedStation] = useState(null); //je li ili nije selectana -- nema mijenjanja
  const [selectedTracker, setSelectedTracker] = useState(null); //trenutni selectan
  const [isAbilitiesModalOpen, setIsAbilitiesModalOpen] = useState(false);
  const [currentSelectedTracker, setCurrentSelectedTracker] = useState(null); // u prozoru
  const [selectedAll, setSelectedAll] = useState(false);

  //slobodni trackeri
  const [availableTrackers, setAvailableTrackers] = useState(podaci);

  //selectana postaja 
  const [markerPosition, setMarkerPosition] = useState(null);
  const[markerName, setMarkerName] = useState('');
  const[isNamingModalOpen, setIsNamingModalOpen] = useState(false);

  //selectani trackeri
  const [selectedTrackers, setSelectedTrackers] = useState([])
  const [selectedAbilities, setSelectedAbilities] = useState({}); //rijecnik - tracker i abilities

  const mapRef = useRef(null);
  const [showRequests, setShowRequests] = useState(false)

  const fetchExistingStationData = () => {
    fetch("http://localhost:8000/manager/station", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //ako postoji
        if (data) {
          const existingStation = data; 
          setSelectedStation(true)
          setMarkerName(existingStation.name);
          setMarkerPosition([existingStation.lat, existingStation.lng]);
        }
      })
      .catch((error) => {
        console.error("Error fetching existing station data:", error);
      });
  };


  const fetchTrackers = () => {
    return fetch("http://localhost:8000/manager/trackers", {
      headers : {
        "Content-Type": "application/json",
      }
      })
      .then((res) => res.json())
      .then((trackers) => setAvailableTrackers(trackers))
  }

  const fetchAbilities = () => {
    return fetch("http://localhost:8000/abilities", {
      headers : {
        "Content-Type": "application/json",
      }
      })
      .then((res) => res.json())
      .then((abilities) => setAbilityOptions(abilities))
  }

  useEffect(() => {
    
    //fetchExistingStationData();
    //fetchTrackers();
    //fetchAbilities(); //pitnanje hoce li trebat
    
  }, [])

  const handleMapClick = (e) => {
    if(!selectedStation) {
      const { lat, lng } = e.latlng;
      setMarkerPosition({ lat, lng });
      setIsNamingModalOpen(true);
      setMarkerName("")
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  
      //sve na novo - NEPOTREBNO AKO SAMO JEDNOM SMIJE BIRAT LOKACIJU
      /*
      setSelectedTracker(null);
      setSelectedAbilities([]);
      setSelectedTrackers([]);
      */

    }
  };

  const handleConfirmName = () => {
    //poziva se kad confirmam ime postaje
    setSelectedStation(true); //odabrano
    setIsNamingModalOpen(false);
    setSelectedAll(false);
    

    // šaljemo na back naziv postaje, lat i lon

    fetch("http://localhost:8000/manager/selected-station", {
    method: "POST",
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
    console.log("Saved station data:", data);
    setIsNamingModalOpen(false);
  })
  .catch((error) => {
    console.error("Error saving station:", error);
    
  });
    
  
  }

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
   // return null;
  };

  const handleToggleRequests = () => {
    if (!selectedStation || selectedTrackers.length === 0 || 
      Object.values(selectedAbilities).some((abilities) => abilities.length === 0)) {
      alert("Please select a station, trackers, and abilities.");
    } else {
      if (!showRequests) {
        setShowRequests(true);
      } else {
        setShowRequests(false);
      }
      
    }
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
  
    // Ensure selectedAbilities includes all selected trackers with empty abilities
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
        // Ako je sposobnost već odabrana, uklonite je
        return {
          ...prevAbilities, //kopira sve prije
          //ureduje selectanog i njegove abilitiese taji da mice taj ability
          [selectedTracker.id]: currentAbilities.filter((a) => a !== ability),
        };
      } else {
       
        // Inače, dodaj sposobnost
        return {
          ...prevAbilities,
          [selectedTracker.id]: [...currentAbilities, ability],
        }
      }
    });  
   // console.log(selectedAbilities)
   console.log(selectedAbilities);
      

  };

  const handleSaveAbilities = () => {
    const trackersWithoutAbilities = selectedTrackers.filter(
  (tracker) => !selectedAbilities[tracker.id] || selectedAbilities[tracker.id].length === 0
);

if (trackersWithoutAbilities.length > 0) {
  const trackerNamesWithoutAbilities = trackersWithoutAbilities.map((tracker) => tracker.name);
  alert(`Please select abilities for tracker(s): ${trackerNamesWithoutAbilities.join(', ')}`);
  return;
}


   fetch("http://localhost:8000/manager/saveAbilities", {
      method: "POST",
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

    console.log('Selected Abilities:', selectedAbilities);
    setIsAbilitiesModalOpen(false);
    setSelectedAll(true);
  };


  return (
    <>
     <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
        Mananger
      </Text>
      {!selectedStation && (
        <Text color="#f9f7e8" fontSize={{ base: "2xl"}} style={{padding: "20px", margin: "16px", backgroundColor: "#306844"}}>
         Click on the map and select the location of your station.
        </Text>
      )}

      <Box h="600px" p="16px" id="mapSection">
        <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }} 
        center={[45.8634, 15.9772]} zoom={16}>
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
 

      <Card w={{ base: '300px', md: '600px', lg: '800px' }} background="#f9f7e8" alignSelf="center" padding="24px" alignItems="center">
      {selectedStation && !selectedAll && (
        <Box maxHeight="240px" overflowY="auto" padding="16px">
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
          <YellowButton  margin="16px" onClick= {() => {setIsAbilitiesModalOpen(true) 
                                                              setCurrentSelectedTracker(null)}}>
            Edit Trackers Abilities</YellowButton>
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
                  const selectedTrackerObject = availableTrackers.find(
                    (tracker) => tracker.name === e.target.value
                  );
                  setSelectedTracker(selectedTrackerObject);
                  setCurrentSelectedTracker(selectedTrackerObject);
                }}
              >
                {selectedTrackers.map((tracker) => (
                  <option key={tracker.id} value={tracker.name}>
                    {tracker.name}
                  </option>
                ))}
</Select>

              {selectedTracker && currentSelectedTracker === selectedTracker && (
                <Stack margin="8px" spacing={4} direction="column">
                {/*
                {abilityOptions.map((ability) => (
                  <Checkbox colorScheme="green" key={ability.name} 
                  isChecked={selectedAbilities[selectedTracker]?.includes(???)
                  onChange={() => handleAbilitiesCheckboxChange({ability})}>
                    {ability.name}
                  </Checkbox>
                ))} */}
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker.id]?.includes('on_foot')}
                  onChange={() => handleAbilitiesCheckboxChange('on_foot')}>On foot</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker.id]?.includes('bicycle')}
                  onChange={() => handleAbilitiesCheckboxChange('bicycle')}>Bicycle</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker.id]?.includes('motorcycle')}
                  onChange={() => handleAbilitiesCheckboxChange('motorcycle')}>Motorcycle</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker.id]?.includes('car')}
                  onChange={() => handleAbilitiesCheckboxChange('car')}>Car</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker.id]?.includes('boat')}
                  onChange={() => handleAbilitiesCheckboxChange('boat')}>Boat</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker.id]?.includes('drone')}
                  onChange={() => handleAbilitiesCheckboxChange('drone')}>Drone</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker.id]?.includes('helicopter')} 
                  onChange={() => handleAbilitiesCheckboxChange('helicopter')}>Helicopter</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker.id]?.includes('airplane')} 
                  onChange={() => handleAbilitiesCheckboxChange('airplane')}>Airplane</Checkbox>
                  
                </Stack>
              )}
            </ModalBody>
            <ModalFooter>
              {/* UREDI - NE SMIJE SE ZATVARAT AKO NIJE ZA SVAKOG ODABRAO*/}
              <Button mr={3} onClick={() => {setIsAbilitiesModalOpen(false)
                            setCurrentSelectedTracker(null) }}>
                Close
              </Button>
              <GreenButton onClick={handleSaveAbilities}>
                Confirm
              </GreenButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {selectedAll && (
          <Link to="/requirments">
            <GreenButton margin="14px" onClick={handleToggleRequests}>
              Requirments
            </GreenButton> 
          </Link>

        )}
      </Card>
  </>

  );
}
