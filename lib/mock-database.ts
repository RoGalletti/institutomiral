export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "teacher" | "student"
  avatar?: string
  bio?: string
  subjects?: string[]
  joinDate: string
  status: "active" | "pending" | "suspended"
}

export interface Course {
  id: string
  title: string
  description: string
  teacherId: string
  teacher: string
  price: number
  subject: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  totalLessons: number
  enrolledStudents: number
  rating: number
  reviewCount: number
  thumbnail: string
  status: "active" | "draft" | "archived"
  createdAt: string
  updatedAt: string
  tags?: string[]
  requirements?: string[]
  learningObjectives?: string[]
}

export interface Lesson {
  id: string
  courseId: string
  sectionId: string
  title: string
  description: string
  type: "video" | "text" | "pdf" | "quiz"
  duration: string
  order: number
  content?: string
  videoUrl?: string
  fileUrl?: string
  isPreview: boolean
  completed?: boolean
}

export interface CourseSection {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  enrolledAt: string
  progress: number
  completedLessons: string[]
  lastAccessedAt: string
  paymentStatus: "paid" | "pending" | "failed"
  paymentId?: string
  completedAt?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  courseId?: string
  content: string
  sentAt: string
  readAt?: string
  type: "text" | "file"
  fileUrl?: string
  fileName?: string
}

export interface Conversation {
  id: string
  participants: string[]
  courseId?: string
  lastMessage: Message
  unreadCount: number
  updatedAt: string
}

export interface Payment {
  id: string
  studentId: string
  courseId: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "refunded" | "partially_refunded"
  paymentMethod: string
  transactionId: string
  createdAt: string
  completedAt?: string
  refundedAt?: string
  refundAmount?: number
  refundReason?: string
  processingFee?: number
  netAmount?: number
  gatewayFee?: number
  platformFee?: number
}

export interface CourseMaterial {
  id: string
  courseId: string
  name: string
  type: "pdf" | "zip" | "doc" | "video" | "image"
  size: string
  url: string
  uploadedAt: string
  downloadCount: number
  isPremium: boolean
}

export interface Wishlist {
  id: string
  studentId: string
  courseId: string
  addedAt: string
}

export interface CourseReview {
  id: string
  courseId: string
  studentId: string
  studentName: string
  rating: number
  title: string
  comment: string
  pros: string[]
  cons: string[]
  wouldRecommend: boolean
  createdAt: string
  updatedAt: string
  helpfulVotes: number
  reportedCount: number
  isVerifiedPurchase: boolean
}

export interface ReviewHelpful {
  id: string
  reviewId: string
  userId: string
  isHelpful: boolean
  createdAt: string
}

// Mock Data
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@email.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    joinDate: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    email: "dr.wilson@email.com",
    firstName: "Dr. James",
    lastName: "Wilson",
    role: "teacher",
    bio: "PhD in Mathematics with 15 years of teaching experience",
    subjects: ["Mathematics", "Calculus", "Statistics"],
    joinDate: "2024-01-05",
    status: "active",
  },
  {
    id: "3",
    email: "prof.anderson@email.com",
    firstName: "Prof. Sarah",
    lastName: "Anderson",
    role: "teacher",
    bio: "Physics professor specializing in quantum mechanics",
    subjects: ["Physics", "Quantum Mechanics", "Thermodynamics"],
    joinDate: "2024-01-08",
    status: "active",
  },
  {
    id: "4",
    email: "dr.brown@email.com",
    firstName: "Dr. Michael",
    lastName: "Brown",
    role: "teacher",
    bio: "Chemistry expert with focus on organic chemistry",
    subjects: ["Chemistry", "Organic Chemistry", "Biochemistry"],
    joinDate: "2024-01-10",
    status: "active",
  },
  {
    id: "5",
    email: "student@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "student",
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: "6",
    email: "alice.johnson@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    role: "student",
    joinDate: "2024-01-16",
    status: "active",
  },
  {
    id: "7",
    email: "bob.smith@example.com",
    firstName: "Bob",
    lastName: "Smith",
    role: "student",
    joinDate: "2024-01-17",
    status: "active",
  },
  {
    id: "8",
    email: "emily.johnson@email.com",
    firstName: "Ms. Emily",
    lastName: "Johnson",
    role: "teacher",
    bio: "English Literature specialist with focus on creative writing",
    subjects: ["English", "Literature", "Creative Writing"],
    joinDate: "2024-01-12",
    status: "active",
  },
  {
    id: "9",
    email: "carlos.rodriguez@email.com",
    firstName: "Prof. Carlos",
    lastName: "Rodriguez",
    role: "teacher",
    bio: "Native Spanish speaker with 10+ years teaching experience",
    subjects: ["Spanish", "Language Arts", "Cultural Studies"],
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: "10",
    email: "alex.chen@email.com",
    firstName: "Dr. Alex",
    lastName: "Chen",
    role: "teacher",
    bio: "Computer Science PhD with industry experience in software development",
    subjects: ["Computer Science", "Programming", "Web Development"],
    joinDate: "2024-01-18",
    status: "active",
  },
  {
    id: "11",
    email: "maria.gonzalez@email.com",
    firstName: "Prof. Maria",
    lastName: "Gonzalez",
    role: "teacher",
    bio: "Art historian and museum curator specializing in contemporary art",
    subjects: ["Art History", "Visual Arts", "Art Appreciation"],
    joinDate: "2024-01-20",
    status: "active",
  },
  {
    id: "12",
    email: "lisa.park@email.com",
    firstName: "Dr. Lisa",
    lastName: "Park",
    role: "teacher",
    bio: "Environmental scientist with focus on climate change research",
    subjects: ["Environmental Science", "Biology", "Earth Science"],
    joinDate: "2024-01-22",
    status: "active",
  },
  {
    id: "13",
    email: "robert.kim@email.com",
    firstName: "Dr. Robert",
    lastName: "Kim",
    role: "teacher",
    bio: "Clinical psychologist and researcher in cognitive psychology",
    subjects: ["Psychology", "Behavioral Science", "Research Methods"],
    joinDate: "2024-01-25",
    status: "active",
  },
  {
    id: "14",
    email: "david.martinez@email.com",
    firstName: "Prof. David",
    lastName: "Martinez",
    role: "teacher",
    bio: "Professional musician and composer with conservatory training",
    subjects: ["Music Theory", "Composition", "Music History"],
    joinDate: "2024-01-28",
    status: "active",
  },
  // Add more mock students for reviews
  {
    id: "15",
    email: "sarah.wilson@example.com",
    firstName: "Sarah",
    lastName: "Wilson",
    role: "student",
    joinDate: "2024-01-10",
    status: "active",
  },
  {
    id: "16",
    email: "mike.chen@example.com",
    firstName: "Mike",
    lastName: "Chen",
    role: "student",
    joinDate: "2024-01-12",
    status: "active",
  },
  {
    id: "17",
    email: "emma.davis@example.com",
    firstName: "Emma",
    lastName: "Davis",
    role: "student",
    joinDate: "2024-01-14",
    status: "active",
  },
]

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Advanced Mathematics",
    description:
      "Comprehensive course covering advanced mathematical concepts including calculus, algebra, and statistics for high school students preparing for college.",
    teacherId: "2",
    teacher: "Dr. James Wilson",
    price: 99,
    subject: "Mathematics",
    level: "advanced",
    duration: "12 weeks",
    totalLessons: 24,
    enrolledStudents: 145,
    rating: 4.8,
    reviewCount: 89,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Advanced+Mathematics",
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
    tags: ["calculus", "algebra", "statistics", "college-prep"],
    requirements: ["Basic algebra knowledge", "High school mathematics"],
    learningObjectives: ["Master calculus concepts", "Solve complex equations", "Apply statistical methods"],
  },
  {
    id: "2",
    title: "Physics Fundamentals",
    description:
      "Essential physics concepts covering mechanics, thermodynamics, and electromagnetism with practical applications and laboratory exercises.",
    teacherId: "3",
    teacher: "Prof. Sarah Anderson",
    price: 89,
    subject: "Physics",
    level: "intermediate",
    duration: "10 weeks",
    totalLessons: 20,
    enrolledStudents: 98,
    rating: 4.7,
    reviewCount: 67,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Physics+Fundamentals",
    status: "active",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-22",
    tags: ["mechanics", "thermodynamics", "electromagnetism"],
    requirements: ["Basic mathematics", "Scientific calculator"],
    learningObjectives: ["Understand fundamental physics laws", "Apply physics to real-world problems"],
  },
  {
    id: "3",
    title: "Chemistry Lab Essentials",
    description:
      "Hands-on chemistry course focusing on laboratory techniques, chemical reactions, and safety protocols for high school students.",
    teacherId: "4",
    teacher: "Dr. Michael Brown",
    price: 79,
    subject: "Chemistry",
    level: "intermediate",
    duration: "8 weeks",
    totalLessons: 16,
    enrolledStudents: 76,
    rating: 4.6,
    reviewCount: 54,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Chemistry+Lab",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-25",
    tags: ["laboratory", "chemical reactions", "safety"],
    requirements: ["Basic chemistry knowledge", "Lab safety training"],
    learningObjectives: ["Master lab techniques", "Understand chemical reactions", "Follow safety protocols"],
  },
  {
    id: "4",
    title: "Calculus Fundamentals",
    description:
      "Introduction to differential and integral calculus with real-world applications and problem-solving techniques.",
    teacherId: "2",
    teacher: "Dr. James Wilson",
    price: 109,
    subject: "Mathematics",
    level: "advanced",
    duration: "14 weeks",
    totalLessons: 28,
    enrolledStudents: 67,
    rating: 4.9,
    reviewCount: 45,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Calculus+Fundamentals",
    status: "active",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-28",
    tags: ["calculus", "derivatives", "integrals"],
    requirements: ["Advanced algebra", "Trigonometry"],
    learningObjectives: ["Master differential calculus", "Understand integral calculus", "Apply calculus to problems"],
  },
  {
    id: "5",
    title: "Biology Essentials",
    description:
      "Comprehensive biology course covering cell biology, genetics, evolution, and ecology for high school students.",
    teacherId: "4",
    teacher: "Dr. Michael Brown",
    price: 85,
    subject: "Biology",
    level: "beginner",
    duration: "12 weeks",
    totalLessons: 22,
    enrolledStudents: 123,
    rating: 4.5,
    reviewCount: 78,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Biology+Essentials",
    status: "active",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-30",
    tags: ["cell biology", "genetics", "evolution", "ecology"],
    requirements: ["Basic science knowledge"],
    learningObjectives: ["Understand cell structure", "Learn genetic principles", "Explore evolutionary concepts"],
  },
  {
    id: "6",
    title: "World History",
    description:
      "Comprehensive world history course from ancient civilizations to modern times with focus on critical thinking and analysis.",
    teacherId: "3",
    teacher: "Prof. Sarah Anderson",
    price: 75,
    subject: "History",
    level: "intermediate",
    duration: "16 weeks",
    totalLessons: 32,
    enrolledStudents: 89,
    rating: 4.4,
    reviewCount: 62,
    thumbnail: "/placeholder.svg?height=200&width=300&text=World+History",
    status: "active",
    createdAt: "2024-01-22",
    updatedAt: "2024-02-01",
    tags: ["ancient civilizations", "modern history", "critical thinking"],
    requirements: ["Reading comprehension", "Basic geography knowledge"],
    learningObjectives: ["Understand historical patterns", "Develop critical thinking", "Analyze historical events"],
  },
  // Add more diverse courses
  {
    id: "7",
    title: "English Literature & Composition",
    description:
      "Explore classic and contemporary literature while developing advanced writing and analytical skills for college preparation.",
    teacherId: "8",
    teacher: "Ms. Emily Johnson",
    price: 95,
    subject: "English",
    level: "advanced",
    duration: "15 weeks",
    totalLessons: 30,
    enrolledStudents: 112,
    rating: 4.7,
    reviewCount: 73,
    thumbnail: "/placeholder.svg?height=200&width=300&text=English+Literature",
    status: "active",
    createdAt: "2024-01-25",
    updatedAt: "2024-02-05",
    tags: ["literature", "composition", "writing", "analysis"],
    requirements: ["Strong reading skills", "Basic writing ability"],
    learningObjectives: ["Analyze literary works", "Improve writing skills", "Develop critical thinking"],
  },
  {
    id: "8",
    title: "Spanish for Beginners",
    description:
      "Learn Spanish from scratch with interactive lessons, cultural insights, and practical conversation skills.",
    teacherId: "9",
    teacher: "Prof. Carlos Rodriguez",
    price: 69,
    subject: "Language",
    level: "beginner",
    duration: "20 weeks",
    totalLessons: 40,
    enrolledStudents: 156,
    rating: 4.6,
    reviewCount: 94,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Spanish+Beginners",
    status: "active",
    createdAt: "2024-01-28",
    updatedAt: "2024-02-08",
    tags: ["spanish", "beginner", "conversation", "culture"],
    requirements: ["No prior Spanish knowledge required"],
    learningObjectives: ["Basic Spanish conversation", "Understanding Spanish culture", "Reading simple texts"],
  },
  {
    id: "9",
    title: "Computer Science Fundamentals",
    description: "Introduction to programming, algorithms, and computational thinking using Python and JavaScript.",
    teacherId: "10",
    teacher: "Dr. Alex Chen",
    price: 129,
    subject: "Computer Science",
    level: "beginner",
    duration: "18 weeks",
    totalLessons: 36,
    enrolledStudents: 203,
    rating: 4.8,
    reviewCount: 127,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Computer+Science",
    status: "active",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-10",
    tags: ["programming", "python", "javascript", "algorithms"],
    requirements: ["Basic computer skills", "Logical thinking"],
    learningObjectives: ["Learn programming basics", "Understand algorithms", "Build simple applications"],
  },
  {
    id: "10",
    title: "Art History & Appreciation",
    description:
      "Journey through art movements from Renaissance to modern times, developing visual literacy and critical analysis skills.",
    teacherId: "11",
    teacher: "Prof. Maria Gonzalez",
    price: 79,
    subject: "Art",
    level: "beginner",
    duration: "12 weeks",
    totalLessons: 24,
    enrolledStudents: 87,
    rating: 4.5,
    reviewCount: 56,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Art+History",
    status: "active",
    createdAt: "2024-02-03",
    updatedAt: "2024-02-12",
    tags: ["art history", "renaissance", "modern art", "visual literacy"],
    requirements: ["Interest in art and culture"],
    learningObjectives: [
      "Understand art movements",
      "Develop visual analysis skills",
      "Appreciate artistic techniques",
    ],
  },
  {
    id: "11",
    title: "Environmental Science",
    description:
      "Study ecosystems, climate change, and sustainability with hands-on projects and field work opportunities.",
    teacherId: "12",
    teacher: "Dr. Lisa Park",
    price: 92,
    subject: "Science",
    level: "intermediate",
    duration: "14 weeks",
    totalLessons: 28,
    enrolledStudents: 94,
    rating: 4.6,
    reviewCount: 61,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Environmental+Science",
    status: "active",
    createdAt: "2024-02-05",
    updatedAt: "2024-02-15",
    tags: ["environment", "climate change", "sustainability", "ecology"],
    requirements: ["Basic science knowledge", "Interest in environmental issues"],
    learningObjectives: ["Understand ecosystems", "Learn about climate change", "Explore sustainability solutions"],
  },
  {
    id: "12",
    title: "Psychology Introduction",
    description:
      "Explore human behavior, cognitive processes, and psychological theories with real-world applications.",
    teacherId: "13",
    teacher: "Dr. Robert Kim",
    price: 88,
    subject: "Psychology",
    level: "beginner",
    duration: "13 weeks",
    totalLessons: 26,
    enrolledStudents: 134,
    rating: 4.7,
    reviewCount: 82,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Psychology+Intro",
    status: "active",
    createdAt: "2024-02-08",
    updatedAt: "2024-02-18",
    tags: ["psychology", "behavior", "cognitive science", "mental health"],
    requirements: ["Open mind", "Interest in human behavior"],
    learningObjectives: [
      "Understand psychological principles",
      "Learn about human behavior",
      "Apply psychology concepts",
    ],
  },
  {
    id: "13",
    title: "Statistics & Data Analysis",
    description: "Master statistical concepts and data analysis techniques using real datasets and modern tools.",
    teacherId: "2",
    teacher: "Dr. James Wilson",
    price: 115,
    subject: "Mathematics",
    level: "intermediate",
    duration: "16 weeks",
    totalLessons: 32,
    enrolledStudents: 78,
    rating: 4.8,
    reviewCount: 52,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Statistics+Data",
    status: "active",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-20",
    tags: ["statistics", "data analysis", "probability", "research methods"],
    requirements: ["Basic mathematics", "Computer literacy"],
    learningObjectives: ["Master statistical concepts", "Analyze real data", "Interpret statistical results"],
  },
  {
    id: "14",
    title: "Creative Writing Workshop",
    description:
      "Develop your creative voice through poetry, short stories, and personal narratives with peer feedback.",
    teacherId: "8",
    teacher: "Ms. Emily Johnson",
    price: 85,
    subject: "English",
    level: "intermediate",
    duration: "10 weeks",
    totalLessons: 20,
    enrolledStudents: 65,
    rating: 4.6,
    reviewCount: 43,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Creative+Writing",
    status: "active",
    createdAt: "2024-02-12",
    updatedAt: "2024-02-22",
    tags: ["creative writing", "poetry", "short stories", "narrative"],
    requirements: ["Basic writing skills", "Creativity", "Willingness to share work"],
    learningObjectives: ["Develop creative voice", "Master writing techniques", "Give and receive feedback"],
  },
  {
    id: "15",
    title: "Music Theory & Composition",
    description: "Learn music fundamentals, harmony, and composition techniques for various instruments and styles.",
    teacherId: "14",
    teacher: "Prof. David Martinez",
    price: 98,
    subject: "Music",
    level: "beginner",
    duration: "20 weeks",
    totalLessons: 40,
    enrolledStudents: 91,
    rating: 4.5,
    reviewCount: 58,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Music+Theory",
    status: "active",
    createdAt: "2024-02-15",
    updatedAt: "2024-02-25",
    tags: ["music theory", "composition", "harmony", "instruments"],
    requirements: ["Basic music knowledge helpful but not required"],
    learningObjectives: ["Understand music theory", "Compose simple pieces", "Analyze musical works"],
  },
]

export const mockCourseSections: CourseSection[] = [
  {
    id: "1",
    courseId: "1",
    title: "Algebra Fundamentals",
    description: "Basic algebraic concepts and operations",
    order: 1,
    lessons: [
      {
        id: "1",
        courseId: "1",
        sectionId: "1",
        title: "Linear Equations",
        description: "Understanding and solving linear equations",
        type: "video",
        duration: "15 min",
        order: 1,
        videoUrl: "/placeholder-video.mp4",
        isPreview: true,
      },
      {
        id: "2",
        courseId: "1",
        sectionId: "1",
        title: "Quadratic Functions",
        description: "Working with quadratic equations and their graphs",
        type: "text",
        duration: "20 min",
        order: 2,
        content: "Detailed explanation of quadratic functions...",
        isPreview: false,
      },
      {
        id: "3",
        courseId: "1",
        sectionId: "1",
        title: "Practice Problems Set 1",
        description: "Algebra practice problems with solutions",
        type: "pdf",
        duration: "30 min",
        order: 3,
        fileUrl: "/algebra-practice-1.pdf",
        isPreview: false,
      },
    ],
  },
  {
    id: "2",
    courseId: "1",
    title: "Calculus Introduction",
    description: "Introduction to differential and integral calculus",
    order: 2,
    lessons: [
      {
        id: "4",
        courseId: "1",
        sectionId: "2",
        title: "Limits and Continuity",
        description: "Understanding limits and continuous functions",
        type: "video",
        duration: "25 min",
        order: 1,
        videoUrl: "/placeholder-video.mp4",
        isPreview: false,
      },
      {
        id: "5",
        courseId: "1",
        sectionId: "2",
        title: "Derivatives",
        description: "Introduction to derivatives and differentiation",
        type: "text",
        duration: "30 min",
        order: 2,
        content: "Comprehensive guide to derivatives...",
        isPreview: false,
      },
      {
        id: "6",
        courseId: "1",
        sectionId: "2",
        title: "Integration Basics",
        description: "Fundamental concepts of integration",
        type: "video",
        duration: "35 min",
        order: 3,
        videoUrl: "/placeholder-video.mp4",
        isPreview: false,
      },
    ],
  },
]

export const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    studentId: "5",
    courseId: "1",
    enrolledAt: "2024-01-20",
    progress: 100,
    completedLessons: ["1", "2", "4", "5", "6"],
    lastAccessedAt: "2024-01-30",
    paymentStatus: "paid",
    paymentId: "pay_1",
    completedAt: "2024-02-15",
  },
  {
    id: "2",
    studentId: "5",
    courseId: "2",
    enrolledAt: "2024-01-22",
    progress: 45,
    completedLessons: ["7", "8"],
    lastAccessedAt: "2024-01-29",
    paymentStatus: "paid",
    paymentId: "pay_2",
  },
  {
    id: "3",
    studentId: "5",
    courseId: "3",
    enrolledAt: "2024-01-25",
    progress: 0,
    completedLessons: [],
    lastAccessedAt: "2024-01-25",
    paymentStatus: "pending",
  },
  // Add more completed enrollments for review testing
  {
    id: "4",
    studentId: "6",
    courseId: "1",
    enrolledAt: "2024-01-18",
    progress: 100,
    completedLessons: ["1", "2", "4", "5", "6"],
    lastAccessedAt: "2024-02-10",
    paymentStatus: "paid",
    paymentId: "pay_4",
    completedAt: "2024-02-10",
  },
  {
    id: "5",
    studentId: "15",
    courseId: "9",
    enrolledAt: "2024-02-01",
    progress: 100,
    completedLessons: ["1", "2", "3", "4", "5"],
    lastAccessedAt: "2024-02-20",
    paymentStatus: "paid",
    paymentId: "pay_5",
    completedAt: "2024-02-20",
  },
]

export const mockPayments: Payment[] = [
  {
    id: "pay_1",
    studentId: "5",
    courseId: "1",
    amount: 99,
    currency: "USD",
    status: "completed",
    paymentMethod: "Credit Card",
    transactionId: "txn_1234567890",
    createdAt: "2024-01-20T10:30:00Z",
    completedAt: "2024-01-20T10:30:15Z",
    processingFee: 2.97,
    gatewayFee: 2.97,
    platformFee: 9.90,
    netAmount: 86.13,
  },
  {
    id: "pay_2",
    studentId: "5",
    courseId: "2",
    amount: 89,
    currency: "USD",
    status: "completed",
    paymentMethod: "PayPal",
    transactionId: "txn_0987654321",
    createdAt: "2024-01-22T14:15:00Z",
    completedAt: "2024-01-22T14:15:10Z",
    processingFee: 2.67,
    gatewayFee: 2.67,
    platformFee: 8.90,
    netAmount: 77.43,
  },
  {
    id: "pay_3",
    studentId: "5",
    courseId: "3",
    amount: 79,
    currency: "USD",
    status: "pending",
    paymentMethod: "Credit Card",
    transactionId: "txn_1122334455",
    createdAt: "2024-01-25T09:20:00Z",
    processingFee: 2.37,
    gatewayFee: 2.37,
    platformFee: 7.90,
    netAmount: 68.73,
  },
  {
    id: "pay_4",
    studentId: "6",
    courseId: "1",
    amount: 99,
    currency: "USD",
    status: "completed",
    paymentMethod: "Credit Card",
    transactionId: "txn_4455667788",
    createdAt: "2024-01-18T16:45:00Z",
    completedAt: "2024-01-18T16:45:12Z",
    processingFee: 2.97,
    gatewayFee: 2.97,
    platformFee: 9.90,
    netAmount: 86.13,
  },
  {
    id: "pay_5",
    studentId: "15",
    courseId: "9",
    amount: 129,
    currency: "USD",
    status: "completed",
    paymentMethod: "PayPal",
    transactionId: "txn_5566778899",
    createdAt: "2024-02-01T11:30:00Z",
    completedAt: "2024-02-01T11:30:08Z",
    processingFee: 3.87,
    gatewayFee: 3.87,
    platformFee: 12.90,
    netAmount: 112.23,
  },
  // Add more mock payments for comprehensive testing
  {
    id: "pay_6",
    studentId: "16",
    courseId: "2",
    amount: 89,
    currency: "USD",
    status: "failed",
    paymentMethod: "Credit Card",
    transactionId: "txn_6677889900",
    createdAt: "2024-02-03T08:15:00Z",
    processingFee: 2.67,
    gatewayFee: 2.67,
    platformFee: 8.90,
    netAmount: 77.43,
  },
  {
    id: "pay_7",
    studentId: "17",
    courseId: "8",
    amount: 69,
    currency: "USD",
    status: "refunded",
    paymentMethod: "PayPal",
    transactionId: "txn_7788990011",
    createdAt: "2024-01-28T13:20:00Z",
    completedAt: "2024-01-28T13:20:05Z",
    refundedAt: "2024-02-05T10:15:00Z",
    refundAmount: 69,
    refundReason: "Course not as expected",
    processingFee: 2.07,
    gatewayFee: 2.07,
    platformFee: 6.90,
    netAmount: 60.03,
  },
  {
    id: "pay_8",
    studentId: "6",
    courseId: "7",
    amount: 95,
    currency: "USD",
    status: "partially_refunded",
    paymentMethod: "Credit Card",
    transactionId: "txn_8899001122",
    createdAt: "2024-01-30T15:45:00Z",
    completedAt: "2024-01-30T15:45:18Z",
    refundedAt: "2024-02-10T14:30:00Z",
    refundAmount: 47.50,
    refundReason: "Partial completion",
    processingFee: 2.85,
    gatewayFee: 2.85,
    platformFee: 9.50,
    netAmount: 82.65,
  },
  {
    id: "pay_9",
    studentId: "15",
    courseId: "12",
    amount: 88,
    currency: "USD",
    status: "completed",
    paymentMethod: "Apple Pay",
    transactionId: "txn_9900112233",
    createdAt: "2024-02-08T12:00:00Z",
    completedAt: "2024-02-08T12:00:03Z",
    processingFee: 2.64,
    gatewayFee: 2.64,
    platformFee: 8.80,
    netAmount: 76.56,
  },
  {
    id: "pay_10",
    studentId: "16",
    courseId: "10",
    amount: 79,
    currency: "USD",
    status: "completed",
    paymentMethod: "Google Pay",
    transactionId: "txn_0011223344",
    createdAt: "2024-02-12T09:30:00Z",
    completedAt: "2024-02-12T09:30:07Z",
    processingFee: 2.37,
    gatewayFee: 2.37,
    platformFee: 7.90,
    netAmount: 68.73,
  },
]

export const mockCourseMaterials: CourseMaterial[] = [
  {
    id: "1",
    courseId: "1",
    name: "Course Syllabus.pdf",
    type: "pdf",
    size: "2.3 MB",
    url: "/materials/syllabus.pdf",
    uploadedAt: "2024-01-10",
    downloadCount: 145,
    isPremium: false,
  },
  {
    id: "2",
    courseId: "1",
    name: "Algebra Reference Sheet.pdf",
    type: "pdf",
    size: "1.8 MB",
    url: "/materials/algebra-ref.pdf",
    uploadedAt: "2024-01-12",
    downloadCount: 98,
    isPremium: false,
  },
  {
    id: "3",
    courseId: "1",
    name: "Practice Problems Set 1.zip",
    type: "zip",
    size: "15.2 MB",
    url: "/materials/practice-set-1.zip",
    uploadedAt: "2024-01-15",
    downloadCount: 67,
    isPremium: true,
  },
  {
    id: "4",
    courseId: "1",
    name: "Video Lectures Collection.zip",
    type: "zip",
    size: "450 MB",
    url: "/materials/video-lectures.zip",
    uploadedAt: "2024-01-18",
    downloadCount: 45,
    isPremium: true,
  },
  {
    id: "5",
    courseId: "1",
    name: "Solutions Manual.pdf",
    type: "pdf",
    size: "8.7 MB",
    url: "/materials/solutions-manual.pdf",
    uploadedAt: "2024-01-20",
    downloadCount: 78,
    isPremium: true,
  },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "2",
    receiverId: "5",
    courseId: "1",
    content: "Hi! I've reviewed your latest assignment on quadratic equations. Excellent work overall!",
    sentAt: "2024-01-30T10:30:00Z",
    readAt: "2024-01-30T10:35:00Z",
    type: "text",
  },
  {
    id: "2",
    senderId: "5",
    receiverId: "2",
    courseId: "1",
    content: "Thank you! I found the graphing section particularly challenging.",
    sentAt: "2024-01-30T10:45:00Z",
    readAt: "2024-01-30T10:50:00Z",
    type: "text",
  },
  {
    id: "3",
    senderId: "2",
    receiverId: "5",
    courseId: "1",
    content:
      "That's completely normal. Graphing quadratic functions requires practice. I've uploaded some additional practice problems to help you.",
    sentAt: "2024-01-30T11:00:00Z",
    readAt: "2024-01-30T11:05:00Z",
    type: "text",
  },
  {
    id: "4",
    senderId: "2",
    receiverId: "5",
    courseId: "1",
    content:
      "Great work on your last assignment! You've shown significant improvement in your problem-solving approach.",
    sentAt: "2024-01-30T14:15:00Z",
    readAt: "2024-01-30T14:15:00Z",
    type: "text",
  },
]

// Add wishlist functionality
export const mockWishlist: Wishlist[] = []

// Mock Reviews Data
export const mockCourseReviews: CourseReview[] = [
  {
    id: "1",
    courseId: "1",
    studentId: "6",
    studentName: "Alice Johnson",
    rating: 5,
    title: "Excellent course with clear explanations",
    comment:
      "Dr. Wilson's teaching style is exceptional. The course content is well-structured and the examples are very helpful. I particularly enjoyed the calculus section which was explained in a way that made complex concepts easy to understand.",
    pros: ["Clear explanations", "Well-structured content", "Great examples", "Responsive instructor"],
    cons: ["Could use more practice problems"],
    wouldRecommend: true,
    createdAt: "2024-02-12",
    updatedAt: "2024-02-12",
    helpfulVotes: 15,
    reportedCount: 0,
    isVerifiedPurchase: true,
  },
  {
    id: "2",
    courseId: "1",
    studentId: "15",
    studentName: "Sarah Wilson",
    rating: 4,
    title: "Good course but challenging",
    comment:
      "The course covers a lot of material and can be quite challenging. However, the instructor is knowledgeable and the content is comprehensive. I would recommend having a strong algebra foundation before taking this course.",
    pros: ["Comprehensive content", "Knowledgeable instructor", "Good preparation for college"],
    cons: ["Very challenging", "Fast-paced", "Requires strong math background"],
    wouldRecommend: true,
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10",
    helpfulVotes: 8,
    reportedCount: 0,
    isVerifiedPurchase: true,
  },
  {
    id: "3",
    courseId: "9",
    studentId: "15",
    studentName: "Sarah Wilson",
    rating: 5,
    title: "Perfect introduction to programming",
    comment:
      "As someone with no programming experience, this course was perfect for me. Dr. Chen explains everything clearly and the hands-on projects really help solidify the concepts. The Python and JavaScript sections were particularly well done.",
    pros: ["Beginner-friendly", "Hands-on projects", "Clear explanations", "Good mix of languages"],
    cons: ["Could cover more advanced topics"],
    wouldRecommend: true,
    createdAt: "2024-02-22",
    updatedAt: "2024-02-22",
    helpfulVotes: 23,
    reportedCount: 0,
    isVerifiedPurchase: true,
  },
  {
    id: "4",
    courseId: "2",
    studentId: "16",
    studentName: "Mike Chen",
    rating: 4,
    title: "Solid physics foundation",
    comment:
      "Prof. Anderson does a great job explaining physics concepts. The lab exercises are particularly valuable for understanding the practical applications. Some topics could be explained in more detail, but overall a solid course.",
    pros: ["Great lab exercises", "Practical applications", "Good foundation", "Engaging instructor"],
    cons: ["Some topics need more detail", "Could use more visual aids"],
    wouldRecommend: true,
    createdAt: "2024-02-18",
    updatedAt: "2024-02-18",
    helpfulVotes: 12,
    reportedCount: 0,
    isVerifiedPurchase: true,
  },
  {
    id: "5",
    courseId: "8",
    studentId: "17",
    studentName: "Emma Davis",
    rating: 5,
    title: "¡Excelente curso de español!",
    comment:
      "Prof. Rodriguez is an amazing teacher! The course is well-paced and includes great cultural insights. I went from knowing no Spanish to being able to have basic conversations. The interactive lessons and pronunciation guides are fantastic.",
    pros: ["Native speaker instructor", "Cultural insights", "Interactive lessons", "Great pronunciation guides"],
    cons: ["Could use more advanced grammar"],
    wouldRecommend: true,
    createdAt: "2024-02-25",
    updatedAt: "2024-02-25",
    helpfulVotes: 19,
    reportedCount: 0,
    isVerifiedPurchase: true,
  },
]

export const mockReviewHelpful: ReviewHelpful[] = []

export const addToWishlist = (studentId: string, courseId: string): Wishlist => {
  const wishlistItem: Wishlist = {
    id: Date.now().toString(),
    studentId,
    courseId,
    addedAt: new Date().toISOString(),
  }
  mockWishlist.push(wishlistItem)
  return wishlistItem
}

export const removeFromWishlist = (studentId: string, courseId: string): boolean => {
  const index = mockWishlist.findIndex((item) => item.studentId === studentId && item.courseId === courseId)
  if (index > -1) {
    mockWishlist.splice(index, 1)
    return true
  }
  return false
}

export const isInWishlist = (studentId: string, courseId: string): boolean => {
  return mockWishlist.some((item) => item.studentId === studentId && item.courseId === courseId)
}

export const getWishlistByStudent = (studentId: string): Wishlist[] => {
  return mockWishlist.filter((item) => item.studentId === studentId)
}

// Review functions
export const getCourseReviews = (courseId: string, sortBy = "newest"): CourseReview[] => {
  const reviews = mockCourseReviews.filter((review) => review.courseId === courseId)

  switch (sortBy) {
    case "newest":
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case "oldest":
      reviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case "highest":
      reviews.sort((a, b) => b.rating - a.rating)
      break
    case "lowest":
      reviews.sort((a, b) => a.rating - b.rating)
      break
    case "helpful":
      reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes)
      break
  }

  return reviews
}

export const addCourseReview = (review: Omit<CourseReview, "id" | "createdAt" | "updatedAt">): CourseReview => {
  const newReview: CourseReview = {
    ...review,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    helpfulVotes: 0,
    reportedCount: 0,
  }

  mockCourseReviews.push(newReview)

  // Update course rating and review count
  const course = mockCourses.find((c) => c.id === review.courseId)
  if (course) {
    const courseReviews = mockCourseReviews.filter((r) => r.courseId === review.courseId)
    const totalRating = courseReviews.reduce((sum, r) => sum + r.rating, 0)
    course.rating = Math.round((totalRating / courseReviews.length) * 10) / 10
    course.reviewCount = courseReviews.length
  }

  return newReview
}

export const canReviewCourse = (studentId: string, courseId: string): boolean => {
  const enrollment = mockEnrollments.find(
    (e) => e.studentId === studentId && e.courseId === courseId && e.paymentStatus === "paid" && e.progress === 100,
  )
  const existingReview = mockCourseReviews.find((r) => r.studentId === studentId && r.courseId === courseId)
  return !!enrollment && !existingReview
}

export const hasReviewedCourse = (studentId: string, courseId: string): boolean => {
  return mockCourseReviews.some((r) => r.studentId === studentId && r.courseId === courseId)
}

export const getStudentReview = (studentId: string, courseId: string): CourseReview | undefined => {
  return mockCourseReviews.find((r) => r.studentId === studentId && r.courseId === courseId)
}

export const markReviewHelpful = (reviewId: string, userId: string, isHelpful: boolean): void => {
  const existingVote = mockReviewHelpful.find((v) => v.reviewId === reviewId && v.userId === userId)

  if (existingVote) {
    existingVote.isHelpful = isHelpful
  } else {
    mockReviewHelpful.push({
      id: Date.now().toString(),
      reviewId,
      userId,
      isHelpful,
      createdAt: new Date().toISOString(),
    })
  }

  // Update helpful votes count
  const review = mockCourseReviews.find((r) => r.id === reviewId)
  if (review) {
    const helpfulVotes = mockReviewHelpful.filter((v) => v.reviewId === reviewId && v.isHelpful).length
    review.helpfulVotes = helpfulVotes
  }
}

export const getUserReviewVote = (reviewId: string, userId: string): boolean | null => {
  const vote = mockReviewHelpful.find((v) => v.reviewId === reviewId && v.userId === userId)
  return vote ? vote.isHelpful : null
}

export const getCompletedCourses = (studentId: string): (Course & { enrollment: Enrollment })[] => {
  const completedEnrollments = mockEnrollments.filter(
    (enrollment) =>
      enrollment.studentId === studentId && enrollment.paymentStatus === "paid" && enrollment.progress === 100,
  )
  return completedEnrollments.map((enrollment) => {
    const course = getCourseById(enrollment.courseId)!
    return { ...course, enrollment }
  })
}

// Course management functions
export const createCourse = (courseData: {
  title: string
  description: string
  teacherId: string
  teacher: string
  price: number
  subject: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  totalLessons: number
  thumbnail: string
  status: "draft" | "active"
  tags?: string[]
  requirements?: string[]
  learningObjectives?: string[]
  sections?: any[]
}): Course => {
  const newCourse: Course = {
    id: Date.now().toString(),
    ...courseData,
    enrolledStudents: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockCourses.push(newCourse)
  return newCourse
}

export const deleteCourse = (courseId: string): boolean => {
  const index = mockCourses.findIndex((course) => course.id === courseId)
  if (index > -1) {
    mockCourses.splice(index, 1)
    return true
  }
  return false
}

export const duplicateCourse = (courseId: string): Course => {
  const originalCourse = mockCourses.find((course) => course.id === courseId)
  if (!originalCourse) {
    throw new Error("Course not found")
  }

  const duplicatedCourse: Course = {
    ...originalCourse,
    id: Date.now().toString(),
    title: `${originalCourse.title} (Copy)`,
    enrolledStudents: 0,
    rating: 0,
    reviewCount: 0,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockCourses.push(duplicatedCourse)
  return duplicatedCourse
}

// Update course basic information
export const updateCourse = (courseId: string, updates: Partial<Course>): Course => {
  const courseIndex = mockCourses.findIndex((course) => course.id === courseId)
  if (courseIndex === -1) throw new Error("Course not found")

  mockCourses[courseIndex] = {
    ...mockCourses[courseIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return mockCourses[courseIndex]
}

// Get students enrolled in a specific course
export const getStudentsByCourse = (courseId: string): (User & { enrolledAt: string; progress: number })[] => {
  const enrollments = mockEnrollments.filter(
    (enrollment) => enrollment.courseId === courseId && enrollment.paymentStatus === "paid",
  )

  return enrollments
    .map((enrollment) => {
      const user = mockUsers.find((u) => u.id === enrollment.studentId)
      return user
        ? {
            ...user,
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress,
          }
        : null
    })
    .filter(Boolean) as (User & { enrolledAt: string; progress: number })[]
}

// Get course analytics
export const getCourseAnalytics = (courseId: string) => {
  const course = getCourseById(courseId)
  if (!course) return null

  const enrollments = mockEnrollments.filter(
    (enrollment) => enrollment.courseId === courseId && enrollment.paymentStatus === "paid",
  )

  const completedEnrollments = enrollments.filter((e) => e.progress === 100)
  const thisMonthEnrollments = enrollments.filter((e) => {
    const enrollDate = new Date(e.enrolledAt)
    const now = new Date()
    return enrollDate.getMonth() === now.getMonth() && enrollDate.getFullYear() === now.getFullYear()
  })

  return {
    completedStudents: completedEnrollments.length,
    newEnrollments: thisMonthEnrollments.length,
    monthlyRevenue: course.price * thisMonthEnrollments.length,
    averageProgress:
      enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) : 0,
    totalWatchTime: Math.floor(Math.random() * 1000) + 500,
  }
}

// Database functions
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  const userData = JSON.parse(userStr)
  return mockUsers.find((user) => user.email === userData.email) || null
}

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find((course) => course.id === id)
}

export const getCoursesByTeacher = (teacherId: string): Course[] => {
  return mockCourses.filter((course) => course.teacherId === teacherId)
}

export const getEnrollmentsByStudent = (studentId: string): Enrollment[] => {
  return mockEnrollments.filter((enrollment) => enrollment.studentId === studentId)
}

export const getStudentCourses = (studentId: string): (Course & { enrollment: Enrollment })[] => {
  const enrollments = getEnrollmentsByStudent(studentId)
  return enrollments.map((enrollment) => {
    const course = getCourseById(enrollment.courseId)!
    return { ...course, enrollment }
  })
}

export const getPaymentsByStudent = (studentId: string): Payment[] => {
  return mockPayments.filter((payment) => payment.studentId === studentId)
}

export const getCourseMaterials = (courseId: string): CourseMaterial[] => {
  return mockCourseMaterials.filter((material) => material.courseId === courseId)
}

export const getCourseSections = (courseId: string): CourseSection[] => {
  return mockCourseSections.filter((section) => section.courseId === courseId)
}

export const getMessagesBetweenUsers = (userId1: string, userId2: string, courseId?: string): Message[] => {
  return mockMessages.filter(
    (message) =>
      ((message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)) &&
      (!courseId || message.courseId === courseId),
  )
}

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id)
}

export const isEnrolledInCourse = (studentId: string, courseId: string): boolean => {
  return mockEnrollments.some(
    (enrollment) =>
      enrollment.studentId === studentId && enrollment.courseId === courseId && enrollment.paymentStatus === "paid",
  )
}

export const getAvailableCourses = (studentId: string): Course[] => {
  const enrolledCourseIds = getEnrollmentsByStudent(studentId).map((e) => e.courseId)
  return mockCourses.filter((course) => !enrolledCourseIds.includes(course.id) && course.status === "active")
}

// Teacher analytics function
export const getTeacherAnalytics = (teacherId: string) => {
  const teacherCourses = getCoursesByTeacher(teacherId)
  const totalStudents = teacherCourses.reduce((sum, course) => sum + course.enrolledStudents, 0)
  const totalRevenue = teacherCourses.reduce((sum, course) => sum + course.price * course.enrolledStudents, 0)
  
  // Calculate this month's data
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  
  const thisMonthEnrollments = mockEnrollments.filter((enrollment) => {
    const enrollDate = new Date(enrollment.enrolledAt)
    return (
      enrollDate.getMonth() === thisMonth &&
      enrollDate.getFullYear() === thisYear &&
      teacherCourses.some((course) => course.id === enrollment.courseId)
    )
  })

  const newStudentsThisMonth = thisMonthEnrollments.length
  const monthlyRevenue = thisMonthEnrollments.reduce((sum, enrollment) => {
    const course = teacherCourses.find((c) => c.id === enrollment.courseId)
    return sum + (course ? course.price : 0)
  }, 0)

  return {
    totalCourses: teacherCourses.length,
    totalStudents,
    totalRevenue,
    newStudentsThisMonth,
    monthlyRevenue,
    averageRating: teacherCourses.length > 0 
      ? teacherCourses.reduce((sum, course) => sum + course.rating, 0) / teacherCourses.length 
      : 0,
  }
}

// Mock enrollment function
export const enrollInCourse = (
  studentId: string,
  courseId: string,
  paymentMethod = "Credit Card",
): { enrollment: Enrollment; payment: Payment } => {
  const course = getCourseById(courseId)
  if (!course) throw new Error("Course not found")

  const enrollment: Enrollment = {
    id: Date.now().toString(),
    studentId,
    courseId,
    enrolledAt: new Date().toISOString(),
    progress: 0,
    completedLessons: [],
    lastAccessedAt: new Date().toISOString(),
    paymentStatus: "paid",
    paymentId: `pay_${Date.now()}`,
  }

  const payment: Payment = {
    id: `pay_${Date.now()}`,
    studentId,
    courseId,
    amount: course.price,
    currency: "USD",
    status: "completed",
    paymentMethod,
    transactionId: `txn_${Date.now()}`,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  }

  mockEnrollments.push(enrollment)
  mockPayments.push(payment)

  // Remove from wishlist if it was there
  removeFromWishlist(studentId, courseId)

  return { enrollment, payment }
}

// User management functions for admin
export const getAllUsers = (): User[] => {
  return mockUsers
}

export const createUser = (userData: Omit<User, "id" | "joinDate">): User => {
  // Check if email already exists
  const existingUser = mockUsers.find(user => user.email === userData.email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    joinDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
  }

  mockUsers.push(newUser)
  return newUser
}

export const updateUser = (userId: string, updates: Partial<Omit<User, "id" | "joinDate">>): User => {
  const userIndex = mockUsers.findIndex(user => user.id === userId)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Check if email is being updated and if it already exists
  if (updates.email) {
    const existingUser = mockUsers.find(user => user.email === updates.email && user.id !== userId)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }
  }

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates,
  }

  return mockUsers[userIndex]
}

export const deleteUser = (userId: string): boolean => {
  const userIndex = mockUsers.findIndex(user => user.id === userId)
  if (userIndex === -1) {
    return false
  }

  mockUsers.splice(userIndex, 1)
  return true
}

export const getUserStats = () => {
  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter(user => user.status === "active").length
  const pendingUsers = mockUsers.filter(user => user.status === "pending").length
  const suspendedUsers = mockUsers.filter(user => user.status === "suspended").length
  
  const usersByRole = {
    admin: mockUsers.filter(user => user.role === "admin").length,
    teacher: mockUsers.filter(user => user.role === "teacher").length,
    student: mockUsers.filter(user => user.role === "student").length,
  }

  // Calculate new users this month
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const newUsersThisMonth = mockUsers.filter(user => {
    const joinDate = new Date(user.joinDate)
    return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear
  }).length

  return {
    totalUsers,
    activeUsers,
    pendingUsers,
    suspendedUsers,
    usersByRole,
    newUsersThisMonth,
  }
}

// Payment management functions for admin
export const getAllPayments = (): Payment[] => {
  return mockPayments
}

export const getPaymentById = (paymentId: string): Payment | undefined => {
  return mockPayments.find(payment => payment.id === paymentId)
}

export const getPaymentsByStatus = (status: Payment['status']): Payment[] => {
  return mockPayments.filter(payment => payment.status === status)
}

export const getPaymentsByDateRange = (startDate: string, endDate: string): Payment[] => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return mockPayments.filter(payment => {
    const paymentDate = new Date(payment.createdAt)
    return paymentDate >= start && paymentDate <= end
  })
}

export const getPaymentsByPaymentMethod = (paymentMethod: string): Payment[] => {
  return mockPayments.filter(payment => payment.paymentMethod === paymentMethod)
}

export const updatePaymentStatus = (paymentId: string, status: Payment['status']): Payment => {
  const paymentIndex = mockPayments.findIndex(payment => payment.id === paymentId)
  if (paymentIndex === -1) {
    throw new Error("Payment not found")
  }

  mockPayments[paymentIndex] = {
    ...mockPayments[paymentIndex],
    status,
    ...(status === 'completed' && !mockPayments[paymentIndex].completedAt ? { completedAt: new Date().toISOString() } : {}),
  }

  return mockPayments[paymentIndex]
}

export const processRefund = (paymentId: string, refundAmount: number, refundReason: string): Payment => {
  const paymentIndex = mockPayments.findIndex(payment => payment.id === paymentId)
  if (paymentIndex === -1) {
    throw new Error("Payment not found")
  }

  const payment = mockPayments[paymentIndex]
  if (payment.status !== 'completed') {
    throw new Error("Can only refund completed payments")
  }

  const isPartialRefund = refundAmount < payment.amount
  
  mockPayments[paymentIndex] = {
    ...payment,
    status: isPartialRefund ? 'partially_refunded' : 'refunded',
    refundedAt: new Date().toISOString(),
    refundAmount,
    refundReason,
  }

  return mockPayments[paymentIndex]
}

export const getPaymentStats = () => {
  const totalPayments = mockPayments.length
  const completedPayments = mockPayments.filter(p => p.status === 'completed').length
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length
  const failedPayments = mockPayments.filter(p => p.status === 'failed').length
  const refundedPayments = mockPayments.filter(p => p.status === 'refunded' || p.status === 'partially_refunded').length

  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed' || p.status === 'partially_refunded')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalRefunded = mockPayments
    .filter(p => p.refundAmount)
    .reduce((sum, p) => sum + (p.refundAmount || 0), 0)

  const netRevenue = totalRevenue - totalRefunded

  const totalFees = mockPayments
    .filter(p => p.status === 'completed' || p.status === 'partially_refunded')
    .reduce((sum, p) => sum + (p.processingFee || 0) + (p.gatewayFee || 0) + (p.platformFee || 0), 0)

  // Calculate this month's data
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  
  const thisMonthPayments = mockPayments.filter(payment => {
    const paymentDate = new Date(payment.createdAt)
    return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear
  })

  const monthlyRevenue = thisMonthPayments
    .filter(p => p.status === 'completed' || p.status === 'partially_refunded')
    .reduce((sum, p) => sum + p.amount, 0)

  const monthlyRefunded = thisMonthPayments
    .filter(p => p.refundAmount)
    .reduce((sum, p) => sum + (p.refundAmount || 0), 0)

  // Payment method breakdown
  const paymentMethodStats = mockPayments.reduce((acc, payment) => {
    const method = payment.paymentMethod
    if (!acc[method]) {
      acc[method] = { count: 0, amount: 0 }
    }
    acc[method].count++
    if (payment.status === 'completed' || payment.status === 'partially_refunded') {
      acc[method].amount += payment.amount
    }
    return acc
  }, {} as Record<string, { count: number; amount: number }>)

  return {
    totalPayments,
    completedPayments,
    pendingPayments,
    failedPayments,
    refundedPayments,
    totalRevenue,
    totalRefunded,
    netRevenue,
    totalFees,
    monthlyRevenue,
    monthlyRefunded,
    paymentMethodStats,
    thisMonthPayments: thisMonthPayments.length,
  }
}

export const getRevenueAnalytics = (days: number = 30) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const paymentsInRange = mockPayments.filter(payment => {
    const paymentDate = new Date(payment.createdAt)
    return paymentDate >= startDate && paymentDate <= endDate && 
           (payment.status === 'completed' || payment.status === 'partially_refunded')
  })

  // Group by date
  const dailyRevenue = paymentsInRange.reduce((acc, payment) => {
    const date = new Date(payment.createdAt).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { revenue: 0, transactions: 0, refunds: 0 }
    }
    acc[date].revenue += payment.amount
    acc[date].transactions++
    if (payment.refundAmount) {
      acc[date].refunds += payment.refundAmount
    }
    return acc
  }, {} as Record<string, { revenue: number; transactions: number; refunds: number }>)

  return dailyRevenue
}

export const searchPayments = (query: string): Payment[] => {
  const lowerQuery = query.toLowerCase()
  
  return mockPayments.filter(payment => {
    const student = getUserById(payment.studentId)
    const course = getCourseById(payment.courseId)
    
    return (
      payment.id.toLowerCase().includes(lowerQuery) ||
      payment.transactionId.toLowerCase().includes(lowerQuery) ||
      payment.paymentMethod.toLowerCase().includes(lowerQuery) ||
      payment.status.toLowerCase().includes(lowerQuery) ||
      (student && `${student.firstName} ${student.lastName}`.toLowerCase().includes(lowerQuery)) ||
      (student && student.email.toLowerCase().includes(lowerQuery)) ||
      (course && course.title.toLowerCase().includes(lowerQuery))
    )
  })
}
