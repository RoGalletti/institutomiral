"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Heart,
  HeartIcon,
  Play,
  Award,
  TrendingUp,
  Zap,
} from "lucide-react"
import { StudentLayout } from "@/components/student-layout"
import {
  getCurrentUser,
  getAvailableCourses,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  enrollInCourse,
  type Course,
} from "@/lib/mock-database"
import { useRouter } from "next/navigation"

export default function BrowseCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterPrice, setFilterPrice] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.role === "student") {
      setCurrentUser(user)
      const availableCourses = getAvailableCourses(user.id)
      setCourses(availableCourses)
      setFilteredCourses(availableCourses)

      // Load wishlist status
      const wishlist = new Set<string>()
      availableCourses.forEach((course) => {
        if (isInWishlist(user.id, course.id)) {
          wishlist.add(course.id)
        }
      })
      setWishlistItems(wishlist)
    }
  }, [])

  useEffect(() => {
    let filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterSubject !== "all") {
      filtered = filtered.filter((course) => course.subject.toLowerCase() === filterSubject.toLowerCase())
    }

    if (filterLevel !== "all") {
      filtered = filtered.filter((course) => course.level === filterLevel)
    }

    if (filterPrice !== "all") {
      filtered = filtered.filter((course) => {
        switch (filterPrice) {
          case "free":
            return course.price === 0
          case "under-50":
            return course.price > 0 && course.price < 50
          case "50-100":
            return course.price >= 50 && course.price <= 100
          case "over-100":
            return course.price > 100
          default:
            return true
        }
      })
    }

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.enrolledStudents - a.enrolledStudents
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }, [courses, searchTerm, filterSubject, filterLevel, filterPrice, sortBy])

  const subjects = Array.from(new Set(courses.map((course) => course.subject)))

  const getLevelBadge = (level: string) => {
    const variants = {
      beginner: { variant: "default" as const, color: "bg-green-100 text-green-800" },
      intermediate: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      advanced: { variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    }
    const config = variants[level as keyof typeof variants] || {
      variant: "outline" as const,
      color: "bg-gray-100 text-gray-800",
    }
    return <Badge className={config.color}>{level.charAt(0).toUpperCase() + level.slice(1)}</Badge>
  }

  const handleWishlistToggle = (courseId: string) => {
    if (!currentUser) return

    const newWishlistItems = new Set(wishlistItems)

    if (wishlistItems.has(courseId)) {
      removeFromWishlist(currentUser.id, courseId)
      newWishlistItems.delete(courseId)
    } else {
      addToWishlist(currentUser.id, courseId)
      newWishlistItems.add(courseId)
    }

    setWishlistItems(newWishlistItems)
  }

  const handleEnrollNow = (courseId: string) => {
    if (!currentUser) return

    try {
      enrollInCourse(currentUser.id, courseId)
      // Redirect to the course page or my courses
      router.push(`/course/${courseId}`)
    } catch (error) {
      console.error("Enrollment failed:", error)
    }
  }

  const getFeaturedCourses = () => {
    return courses.filter((course) => course.rating >= 4.7 || course.enrolledStudents >= 150).slice(0, 6)
  }

  const getPopularCourses = () => {
    return courses.sort((a, b) => b.enrolledStudents - a.enrolledStudents).slice(0, 8)
  }

  const getNewCourses = () => {
    return courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6)
  }

  const CourseCard = ({ course, featured = false }: { course: Course; featured?: boolean }) => (
    <Card className={`hover:shadow-xl transition-all duration-300 ${featured ? "border-2 border-blue-200" : ""} group`}>
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">{getLevelBadge(course.level)}</div>
        <div className="absolute top-4 right-4">
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white"
            onClick={() => handleWishlistToggle(course.id)}
          >
            {wishlistItems.has(course.id) ? (
              <Heart className="h-4 w-4 text-red-500 fill-current" />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
        {featured && (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-blue-600 text-white">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        {course.enrolledStudents >= 200 && (
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-orange-600 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Bestseller
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </CardTitle>
            <CardDescription className="mt-1 text-sm">by {course.teacher}</CardDescription>
          </div>
          <div className="text-right ml-4">
            <p className="text-2xl font-bold text-green-600">${course.price}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-medium">{course.rating}</span>
            <span className="ml-1">({course.reviewCount})</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.enrolledStudents}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>

        {/* Course Stats */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            {course.totalLessons} lessons
          </Badge>
          <Badge variant="outline" className="text-xs">
            {course.subject}
          </Badge>
          {course.rating >= 4.8 && (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              <Award className="h-3 w-3 mr-1" />
              Top Rated
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleEnrollNow(course.id)}>
            <Zap className="h-4 w-4 mr-2" />
            Enroll Now
          </Button>
          <Link href={`/course/${course.id}`}>
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Browse Courses
          </h1>
          <p className="text-gray-600 text-lg mt-2">Discover new courses to expand your knowledge and skills</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses, teachers, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-full lg:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject.toLowerCase()}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPrice} onValueChange={setFilterPrice}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="under-50">Under $50</SelectItem>
                    <SelectItem value="50-100">$50 - $100</SelectItem>
                    <SelectItem value="over-100">Over $100</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
                <span className="font-semibold">{courses.length}</span> courses
              </p>
              <div className="text-sm text-gray-500">{searchTerm && `Results for "${searchTerm}"`}</div>
            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No courses found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                      <Button
                        onClick={() => {
                          setSearchTerm("")
                          setFilterSubject("all")
                          setFilterLevel("all")
                          setFilterPrice("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Featured Courses</h2>
              <p className="text-gray-600">Hand-picked courses with exceptional quality and ratings</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFeaturedCourses().map((course) => (
                <CourseCard key={course.id} course={course} featured={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Most Popular Courses</h2>
              <p className="text-gray-600">Courses with the highest enrollment numbers</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getPopularCourses().map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">New Courses</h2>
              <p className="text-gray-600">Recently added courses from our expert instructors</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getNewCourses().map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-600 mb-4">Get notified about new courses and special offers</p>
            <div className="flex max-w-md mx-auto gap-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  )
}
