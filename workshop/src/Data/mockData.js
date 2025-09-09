export const currentUserId = "user-123";

export const mockEvents = [
  {
    id: "1",
    title: "Advanced React Patterns Workshop",
    description:
      "Learn advanced React patterns including render props, compound components, and custom hooks.",
    hostName: "Sarah Chen",
    hostId: "host-1",
    dateTime: "2025-02-15T14:00:00Z",
    duration: 180,
    category: "Programming",
    bannerImage:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
    registeredCount: 18,
  },
  {
    id: "2",
    title: "Digital Marketing Masterclass",
    description:
      "Master the fundamentals of digital marketing including SEO, social media, and content strategy.",
    hostName: "Marcus Johnson",
    hostId: "host-2",
    dateTime: "2025-02-20T10:00:00Z",
    duration: 240,
    category: "Marketing",
    bannerImage:
      "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg",
    registeredCount: 32,
  },
  {
    id: "3",
    title: "Mindfulness and Meditation",
    description:
      "Discover techniques for stress reduction and mental clarity through mindfulness practices.",
    hostName: "Dr. Emily Rodriguez",
    hostId: "host-3",
    dateTime: "2025-02-18T18:00:00Z",
    duration: 90,
    category: "Wellness",
    bannerImage:
      "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg",
    registeredCount: 22,
  },
  {
    id: "4",
    title: "Financial Planning Basics",
    description:
      "Learn essential financial planning strategies for personal wealth building and retirement.",
    hostName: "David Kim",
    hostId: currentUserId,
    dateTime: "2025-02-25T16:00:00Z",
    duration: 120,
    category: "Finance",
    bannerImage:
      "https://images.pexels.com/photos/4386371/pexels-photo-4386371.jpeg",
    registeredCount: 15,
  },
  {
    id: "5",
    title: "Creative Writing Workshop",
    description:
      "Explore creative writing techniques and develop your storytelling skills.",
    hostName: "Lisa Thompson",
    hostId: "host-4",
    dateTime: "2025-01-20T19:00:00Z",
    duration: 150,
    category: "Arts",
    bannerImage:
      "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
    registeredCount: 20,
  },
  {
    id: "6",
    title: "Python Data Science",
    description:
      "Introduction to data science with Python, pandas, and visualization libraries.",
    hostName: "Alex Zhang",
    hostId: "host-5",
    dateTime: "2025-02-22T13:00:00Z",
    duration: 300,
    category: "Programming",
    bannerImage:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    registeredCount: 28,
  },
];

export const mockRegistrations = [
  {
    id: "reg-1",
    eventId: "1",
    userId: currentUserId,
    userName: "John Doe",
    userEmail: "john@example.com",
    registeredAt: "2025-01-10T10:00:00Z",
    status: "registered",
  },
  {
    id: "reg-2",
    eventId: "3",
    userId: currentUserId,
    userName: "John Doe",
    userEmail: "john@example.com",
    registeredAt: "2025-01-12T15:30:00Z",
    status: "registered",
  },
  {
    id: "reg-3",
    eventId: "5",
    userId: currentUserId,
    userName: "John Doe",
    userEmail: "john@example.com",
    registeredAt: "2025-01-08T09:00:00Z",
    status: "registered",
  },
  {
    id: "reg-4",
    eventId: "4",
    userId: "user-456",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    registeredAt: "2025-01-15T14:00:00Z",
    status: "registered",
  },
  {
    id: "reg-5",
    eventId: "4",
    userId: "user-789",
    userName: "Mike Wilson",
    userEmail: "mike@example.com",
    registeredAt: "2025-01-16T11:30:00Z",
    status: "registered",
  },
];

export const categories = [
  "All Categories",
  "Programming",
  "Marketing",
  "Wellness",
  "Finance",
  "Arts",
  "Business",
  "Design",
];
