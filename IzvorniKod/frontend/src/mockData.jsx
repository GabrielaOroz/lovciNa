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
      manager: { name: "John", surname: "Doe", station: { name: "Puntijarka", latitude: 45.8659, longitude: 15.9722 } },
      start: "15.1.2023.",
      end: "15.2.2023",
      status: "completed", // 0: Not started, 1: In Progress, 2: Completed
      comment: "Be careful.",
      tasks: [
        {
          id: 1,
          title: "Camera Trap Setup",
          tracker: { name: "Alice", surname: "Smith", photo: "url_to_photo", latitude: 45.8685, longitude: 15.9725 },
          start: "15.1.2023.",
          end: "15.2.2023",
          status: "completed", // 0: Not started, 1: In Progress, 2: Completed
          content: "Setting up cameras in designated areas.",
          animals: [
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
          comments: ["Weather conditions may affect camera placements."],
        },
      ],
    },
    {
      id: 2,
      title: "Avian Migration Study",
      manager: {
        name: "Emily",
        surname: "Johnson",
        station: { name: "Sljeme", latitude: 45.8634, longitude: 15.9772 },
      },
      start: "20.2.2023.",
      end: "",
      status: "in progress",
      comment: "",
      tasks: [
        {
          id: 2,
          title: "Deploy GPS Tags",
          tracker: { name: "David", surname: "Brown", photo: "url_to_photo", latitude: 45.8641, longitude: 15.9743 },
          start: "20.2.2023.",
          end: "",
          status: "in progress",
          content: "Attaching GPS tags to selected bird species.",
          animals: [
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
          comments: ["Birds seem disturbed."],
        },
        {
          id: 3,
          title: "Observation Period",
          tracker: { name: "Emily", surname: "Johnson", photo: "url_to_photo", latitude: 45.8637, longitude: 15.9769 },
          start: "20.2.2023.",
          end: "",
          status: "not started",
          content: "Observe bird migration patterns during early morning hours.",
          animals: [],
          comments: ["Weather conditions will affect visibility."],
        },
      ],
    },
  ],
};

export default mockData;
