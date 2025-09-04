"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, Users, Star, Search, Filter } from "lucide-react"
import { StudentLayout } from "@/components/student-layout"
import { getCurrentUser, getStudentCourses, type Course, type Enrollment } from "@/lib/mock-database"

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<(Course & { enrollment: Enrollment })[]>([])
  const [filteredCourses, setFilteredCourses] = useState<(Course & { enrollment: Enrollment })[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.role === "student") {
      const studentCourses = getStudentCourses(user.id)
      setCourses(studentCourses)
      setFilteredCourses(studentCourses)
    }
  }, [])

  useEffect(() => {
    let filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterStatus !== "all") {
      filtered = filtered.filter((course) => {
        switch (filterStatus) {
          case "active":
            return course.enrollment.paymentStatus === "paid" && course.enrollment.progress < 100
          case "completed":
            return course.enrollment.progress === 100
          case "pending":
            return course.enrollment.paymentStatus === "pending"
          default:
            return true
        }
      })
    }

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.enrollment.lastAccessedAt).getTime() - new Date(a.enrollment.lastAccessedAt).getTime()
        case "progress":
          return b.enrollment.progress - a.enrollment.progress
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }, [courses, searchTerm, filterStatus, sortBy])

  const getStatusBadge = (enrollment: Enrollment) => {
    if (enrollment.paymentStatus === "pending") {
      return <Badge variant="destructive">Payment Required</Badge>
    }
    if (enrollment.progress === 100) {
      return <Badge variant="default">Completed</Badge>
    }
    if (enrollment.progress > 0) {
      return <Badge variant="secondary">In Progress</Badge>
    }
    return <Badge variant="outline">Not Started</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-gray-600">Manage and continue your enrolled courses</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Payment Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Accessed</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Courses</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">In Progress</p>
                  <p className="text-2xl font-bold">
                    {courses.filter((c) => c.enrollment.progress > 0 && c.enrollment.progress < 100).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">{courses.filter((c) => c.enrollment.progress === 100).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Avg Progress</p>
                  <p className="text-2xl font-bold">
                    {courses.length > 0
                      ? Math.round(courses.reduce((acc, c) => acc + c.enrollment.progress, 0) / courses.length)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6">
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't enrolled in any courses yet"}
                </p>
                <Link href="/student/browse">
                  <Button>Browse Available Courses</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Course Image */}
                    <div className="lg:w-48 lg:flex-shrink-0">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-32 lg:h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                          <p className="text-gray-600 mb-2">by {course.teacher}</p>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                        </div>
                        {getStatusBadge(course.enrollment)}
                      </div>

                      {/* Course Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.totalLessons} lessons
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {course.rating} rating
                        </div>
                        <div className="text-xs">Last accessed: {formatDate(course.enrollment.lastAccessedAt)}</div>
                      </div>

                      {/* Progress Bar */}
                      {course.enrollment.paymentStatus === "paid" && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{course.enrollment.progress}%</span>
                          </div>
                          <Progress value={course.enrollment.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {course.enrollment.completedLessons.length} of {course.totalLessons} lessons completed
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {course.enrollment.paymentStatus === "paid" ? (
                          <Link href={`/course/${course.id}`}>
                            <Button>{course.enrollment.progress > 0 ? "Continue Learning" : "Start Course"}</Button>
                          </Link>
                        ) : (
                          <Link href={`/course/${course.id}`}>
                            <Button variant="destructive">Complete Payment</Button>
                          </Link>
                        )}
                        <Link href={`/course/${course.id}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  )
}
