import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  Input,
  InputGroup,
  InputRightElement,
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
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import mockData from "../../mockData.jsx";
import { marker } from 'leaflet';





export default function Manager() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [isAbilitiesModalOpen, setIsAbilitiesModalOpen] = useState(false);
  const [selectedAbilities, setSelectedAbilities] = useState([]);

  const [selectedTrackers, setSelectedTrackers] = useState([])

  //podaci pri ucitavanju stranice
  const [stationOptions, setStationOptions] = useState([]);  
  const [trackerOptions, setTrackerOptions] = useState([]);  
  const [abilityOptions, setAbilityOptions] = useState([]);  

  const mapRef = useRef(null);
  const [formData, setFormData] = useState(mockData.mockActions);

  //lista markera kad manager odabere 
  const [markerPosition, setMarkerPosition] = useState(null);
  const[markerName, setMarkerName] = useState('');
  const[isNamingModalOpen, setIsNamingModalOpen] = useState(false);



  const fetchTrackers = () => {
    return fetch("http://localhost:8000/trackers", {
      headers : {
        "Content-Type": "application/json",
      }
      })
      .then((res) => res.json())
      .then((trackers) => setTrackerOptions(trackers))
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
    /*
    fetchTrackers();
    fetchAbilities();
    */
  }, [])

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition({ lat, lng });
    setMarkerName('');
    //otvaram, ali prije tog brisem staro ime
    setIsNamingModalOpen(true);
    console.log({markerName})
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  const handleConfirmName = () => {
    //poziva se kad confirmam ime postaje
    setIsNamingModalOpen(false);
    setSelectedStation(true); //odabrano

    /*
    fetch("http://localhost:8000/stations", {
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
    
    */
  }

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
   // return null;
  };
  
  const handleSelectedStation = () => {
    fetch("http://localhost:8000/stations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        station: selectedStation,
      }),
    })
      .then((res) => res.json())
      .then((data => {
        console.log("Poslani podaci:", data);
      }));
  }

  const handleCheckboxChangeTracker = (tracker) => {
    const isTrackerSelected = selectedTrackers.includes(tracker);

    if (isTrackerSelected) {
      //zadržava samo one koji nisu jednaki trenutnom - jer smo odznačili
      setSelectedTrackers(selectedTrackers.filter((selected) => selected !== tracker));
    } else {
      setSelectedTrackers([...selectedTrackers, tracker]);
    }
  };

  const handleEditAbilitiesClick = () => {
    setIsAbilitiesModalOpen(true);
  };


  const handleSaveAbilities = () => {
    console.log(`Spremljene promjene za ${selectedTracker}: ${selectedAbilities}`);
    setIsAbilitiesModalOpen(false);
  };


  return (
    <>
     <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
        Manager
      </Text>

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
              onChange={(e) => setMarkerName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleConfirmName}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={() => setIsNamingModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>


      <Card w={{ base: '300px', md: '600px', lg: '800px' }} background="#f9f7e8" alignSelf="center" padding="20px">
        {selectedStation && (
          <Stack spacing={4} direction="column" padding="14px">
          {/*
          {trackerOptions.map((tracker) => (
            <Checkbox key={tracker.id} value={tracker.name}
            colorScheme="green" isChecked={selectedTrackers.includes(tracker.name)}
                onChange={() => handleCheckboxChange(tracker.name)}
            >
              {tracker.name} 
              {tracker.surname}
            </Checkbox>
          ))}
          */} 

            <Checkbox colorScheme="green" isChecked={selectedTrackers.includes('Tracker 1')}
                onChange={() => handleCheckboxChangeTracker('Tracker 1')}>
              Tracker 1
            </Checkbox>
            <Checkbox colorScheme="green" isChecked={selectedTrackers.includes('Tracker 2')}
                onChange={() => handleCheckboxChangeTracker('Tracker 2')}>
              Tracker 2
            </Checkbox>
            <Checkbox colorScheme="green" isChecked={selectedTrackers.includes('Tracker 3')}
                onChange={() => handleCheckboxChangeTracker('Tracker 3')}>
              Tracker 3
            </Checkbox>
          </Stack>
        )}

        {selectedStation && selectedTrackers.length > 0 && (
          <Button colorScheme="green" margin="14px" onClick={handleEditAbilitiesClick}>Edit Trackers Abilities</Button>
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
                onChange={(e) => setSelectedTracker(e.target.value)}
              >
              {selectedTrackers.map((tracker) => (
                <option key={tracker} value={tracker}>
                  {tracker}
                </option>
              ))}
              </Select>

              {selectedTracker && (
                <Stack margin="8px" spacing={4} direction="column">
                {/*
                {abilityOptions.map((ability) => (
                  <Checkbox colorScheme="green" key={ability.name} onChange={() => handleCheckboxChange({ability})}>
                    {ability.name}
                  </Checkbox>
                ))} */}
                  <Checkbox colorScheme="green" onChange={() => handleAbilitiesCheckboxChange('foot')}>By foot</Checkbox>
                  <Checkbox colorScheme="green" onChange={() => handleAbilitiesCheckboxChange('car')}>Car</Checkbox>
                  <Checkbox colorScheme="green" onChange={() => handleAbilitiesCheckboxChange('airplane')}>Airplane</Checkbox>
                </Stack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={() => setIsAbilitiesModalOpen(false)}>
                Close
              </Button>
              <Button colorScheme="green" onClick={handleSaveAbilities}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
  </>

    
    
  );
}


