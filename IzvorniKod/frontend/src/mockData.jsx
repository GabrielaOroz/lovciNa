const mockData = {
  mockManagers: [
    {
      id: 1,
      name: "John",
      surname: "Doe",
      station: { name: "Puntijarka", latitude: 45.8659, longitude: 15.9722 },
    },
    {
      id: 2,
      name: "Emily",
      surname: "Johnson",
      station: { name: "Sljeme", latitude: 45.8634, longitude: 15.9772 },
    },
  ],

  mockActions: [
    {
      id: 1,
      title: "Study on Lion Movement",
      manager: {
        id: 1,
        name: "John",
        surname: "Doe",
        station: { name: "Puntijarka", latitude: 45.8659, longitude: 15.9722 },
      },
      start: "15.1.2023.", // biljezi se automatski kreiranjem akcije
      end: "15.2.2023", // biljezi se automatski kad se registrira da su svi tragaci zavrsili svoje zadatke
      status: 2, // 0: Not started, 1: In Progress, 2: Completed
      comment: "Be careful.",
      species: [
        {
          id: 1,
          name: "African Lion",
          photo: "lion_photo_url",
          description: "They like to eat",
        },
      ],
      individuals: [
        {
          id: 1,
          species: "African Lion",
          photo: "lion_photo_url",
          description: "Adult male lion",
          latitude: 45.8678,
          longitude: 15.9715,
          comments: ["Don't let him eat you."],
        },
        {
          id: 2,
          species: "African Lion",
          photo: "lion_photo_url",
          description: "Adult female lion",
          latitude: 45.8668,
          longitude: 15.9732,
          comments: [],
        },
      ],
      habitats: [
        {
          id: 1,
          name: "Habitat of Lions",
          photo: "photo_url",
          description: "Some amazing stuff",
          latitude: 45.8668,
          longitude: 15.9732,
        },
      ],
      trackers: [
        {
          id: 1,
          name: "Alice",
          surname: "Smith",
          photo: "url_to_photo",
          medium: "by foot",
          latitude: 45.8685,
          longitude: 15.9725,
          tasks: [
            {
              id: 1,
              title: "Camera Trap Setup",
              start: "15.1.2023.", //automatski se postavi kad se kreira zadatak
              end: "15.2.2023",
              status: 2, // 0: Not started, 1: In Progress, 2: Completed
              coordinatesStart: [45, 15],
              coordinatesFinish: [45, 15],
              content: "Setting up cameras in designated areas.",
              comments: ["Weather conditions may affect camera placements."],
            },
            {
              id: 5,
              title: "Camera Trap Setup",
              start: "15.1.2023.",
              end: "15.2.2023",
              status: 2,
              coordinatesStart: [45, 15],
              coordinatesFinish: [45, 15],
              content: "Setting up cameras in designated areas.",
              comments: ["Weather conditions may affect camera placements."],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Avian Migration Study",
      manager: {
        id: 2,
        name: "Emily",
        surname: "Johnson",
        station: { name: "Sljeme", latitude: 45.8634, longitude: 15.9772 },
      },
      start: "20.2.2023.",
      end: "",
      status: 1,
      comment: "",
      species: [],
      individuals: [
        {
          id: 3,
          species: "Eurasian Magpie",
          photo: "magpie_photo_url",
          description: "Adult male magpie",
          latitude: 45.8639,
          longitude: 15.9778,
          comments: [],
        },
        {
          id: 4,
          species: "Eurasian Magpie",
          photo: "magpie_photo_url",
          description: "Adult female magpie",
          latitude: 45.8631,
          longitude: 15.9785,
          comments: [],
        },
      ],
      habitats: [],
      trackers: [
        {
          id: 2,
          name: "David",
          surname: "Brown",
          photo: "url_to_photo",
          medium: "dron",
          latitude: 45.8641,
          longitude: 15.9743,
          tasks: [
            {
              id: 2,
              title: "Deploy GPS Tags",
              start: "20.2.2023.",
              end: "",
              status: 1,
              coordinatesStart: [45, 15],
              coordinatesFinish: [45, 15],
              content: "Attaching GPS tags to selected bird species.",
              comments: ["Birds seem disturbed."],
            },
          ],
        },
        {
          id: 3,
          name: "Emily",
          surname: "Johnson",
          photo: "url_to_photo",
          medium: "car",
          latitude: 45.8637,
          longitude: 15.9769,
          tasks: [
            {
              id: 3,
              title: "Observation Period",
              start: "20.2.2023.",
              end: "",
              status: 0,
              coordinatesStart: [45, 15],
              coordinatesFinish: [45, 15],
              content: "Observe bird migration patterns during early morning hours.",
              comments: ["Weather conditions will affect visibility."],
            },
          ],
        },
      ],
    },
  ],

  mockNewActions: [
    {
      id: 1,
      title: "Study on Lion Movement",
      manager: {
        id: 1,
        name: "John",
        surname: "Doe",
        station: { name: "Puntijarka", latitude: 45.8659, longitude: 15.9722 },
      },
      comment: "",
      species: [],
      individuals: [],
      habitats: [],
      trackers: [
        {
          id: 1,
          name: "Alice",
          surname: "Smith",
          photo: "url_to_photo",
          medium: "by foot",
          latitude: 45.8685,
          longitude: 15.9725,
          tasks: [],
        },
      ],
    },
    {
      id: 2,
      title: "Avian Migration Study",
      manager: {
        id: 2,
        name: "Emily",
        surname: "Johnson",
        station: { name: "Sljeme", latitude: 45.8634, longitude: 15.9772 },
      },
      comment: "",
      species: [],
      individuals: [],
      habitats: [],
      trackers: [
        {
          id: 2,
          name: "David",
          surname: "Brown",
          photo: "url_to_photo",
          medium: "dron",
          latitude: 45.8641,
          longitude: 15.9743,
          tasks: [],
        },
        {
          id: 3,
          name: "Emily",
          surname: "Johnson",
          photo: "url_to_photo",
          medium: "car",
          latitude: 45.8637,
          longitude: 15.9769,
          tasks: [],
        },
      ],
    },
  ],
};

export default mockData;
