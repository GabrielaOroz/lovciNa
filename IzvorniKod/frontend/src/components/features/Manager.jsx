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
  const [selectedStation, setSelectedStation] = useState(null); //je li ili nije selectana -- nema mijenjanja
  const [selectedTracker, setSelectedTracker] = useState(null); //trenutni selectan
  const [isAbilitiesModalOpen, setIsAbilitiesModalOpen] = useState(false);
  const [currentSelectedTracker, setCurrentSelectedTracker] = useState(null); // u prozoru


  //selectana postaja 
  const [markerPosition, setMarkerPosition] = useState(null);
  const[markerName, setMarkerName] = useState('');
  const[isNamingModalOpen, setIsNamingModalOpen] = useState(false);



  //selectani trackeri
  const [selectedTrackers, setSelectedTrackers] = useState([])

  const [selectedAbilities, setSelectedAbilities] = useState({}); //rijecnik - tracker i abilities


  const mapRef = useRef(null);
  const [formData, setFormData] = useState(mockData.mockActions);



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
    //if(!selectedStation) {
      const { lat, lng } = e.latlng;
      setMarkerPosition({ lat, lng });
      setIsNamingModalOpen(true);
      setMarkerName("")
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  
      //sve na novo
      setSelectedTracker(null);
      setSelectedAbilities([]);
      setSelectedTrackers([]);

   // }
  };

  const handleConfirmName = () => {
    //poziva se kad confirmam ime postaje
    setSelectedStation(true); //odabrano
    setIsNamingModalOpen(false);
    

    // šaljemo na back naziv postaje, lat i lon

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
  

  const handleCheckboxChangeTracker = (tracker) => {
    const isTrackerSelected = selectedTrackers.includes(tracker);

    if (isTrackerSelected) {
      // odznaci trackera 
      setSelectedTrackers(selectedTrackers.filter((selected) => selected !== tracker)); // zadrzavamo one koji nisu jedaki trackeru
      // provjeri je li tragac prisutan u rječniku i ukloni ga ako postoji
      if (selectedAbilities[tracker]) {
        setSelectedAbilities((prevAbilities) => {
          const { [tracker]: removed, ...newAbilities } = prevAbilities;
          return newAbilities;
        });
    }
    } else {
      //inace dodaj selectanog trackera
      setSelectedTrackers([...selectedTrackers, tracker]);
    }

    // dodaj sposobnosti (ništa) za novog odabranog tragača
    setSelectedAbilities((prevAbilities) => {
      return {
        ...prevAbilities,
        [tracker]: [],
      };
    });
  };

  const handleAbilitiesCheckboxChange = (ability) => {
    //console.log(selectedAbilities[selectedTracker]?.includes('foot'));

    setSelectedAbilities((prevAbilities) => {
      //if(!isTrackerSelected) return;
      const currentAbilities = prevAbilities[selectedTracker] || [];
      
      if (currentAbilities.includes(ability)) {
        // Ako je sposobnost već odabrana, uklonite je
        return {
          ...prevAbilities, //kopira sve prije
          //ureduje selectanog i njegove abilitiese taji da mice taj ability
          [selectedTracker]: currentAbilities.filter((a) => a !== ability),
        };
      } else {
       
        // Inače, dodajte sposobnost
        return {
          ...prevAbilities,
          [selectedTracker]: [...currentAbilities, ability],
        }
      }
    });

  };


  const handleSaveAbilities = () => {
    const trackersWithoutAbilities = selectedTrackers.filter(
      (tracker) => !selectedAbilities[tracker] || selectedAbilities[tracker].length === 0
    );
  
    if (trackersWithoutAbilities.length > 0) {
      alert(`Please select abilities for tracker(s): ${trackersWithoutAbilities.join(', ')}`);
      return;
    }
  
    // slanje na back

    fetch("http://localhost:8000/saveAbilities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedAbilities),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from server:", data);
        setIsAbilitiesModalOpen(false);
      })
      .catch((error) => {
        console.error("Error saving abilities:", error);
      });


    console.log('Selected Abilities:', selectedAbilities);
    setIsAbilitiesModalOpen(false);
  };
  

  return (
    <>
     <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
        Mananger
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
              onChange={(e) => setMarkerName(e.target.value)} //postavimo ime postaje
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
                onChange={() => handleCheckboxChangeTracker(tracker.name)}
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
          <Button colorScheme="green" margin="14px" onClick= {() => {setIsAbilitiesModalOpen(true) 
                                                              setCurrentSelectedTracker(null)}}>
            Edit Trackers Abilities</Button>
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
                onChange={(e) => {setSelectedTracker(e.target.value);
                                setCurrentSelectedTracker(e.target.value);}} 
              >
              {selectedTrackers.map((tracker) => (
                <option key={tracker} value={tracker}>
                  {tracker}
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
                  {selectedTracker && selectedAbilities[selectedTracker]?.includes('foot')}
                  onChange={() => handleAbilitiesCheckboxChange('foot')}>By foot</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker]?.includes('car')}
                  onChange={() => handleAbilitiesCheckboxChange('car')}>Car</Checkbox>
                  <Checkbox colorScheme="green" isChecked=
                  {selectedTracker && selectedAbilities[selectedTracker]?.includes('airplane')} 
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


