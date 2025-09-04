"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, BookOpen, DollarSign, Star, TrendingUp, MessageSquare, Eye, Settings, Plus, BarChart3, Edit, Trash2, Copy, Upload, Download, Mail, MoreHorizontal, ArrowLeft, Calendar, Clock, Award, Target } from 'lucide-react'
import { TeacherLayout } from "@/components/teacher-layout"
import {
  getCourseById,
  getStudentsByCourse,
  getCourseAnalytics,
  updateCourse,
  deleteCourse,
  duplicateCourse,
  type Course,
  type User,
} from "@/lib/mock-database"

export default function ManageCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [students, setStudents] = useState<(User & { enrolledAt: string; progress: number })[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: 0,
    status: "draft" as "draft" | "active" | "archived",
  })

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const courseData = getCourseById(courseId)
        if (!courseData) {
          router.push("/teacher/courses")
          return
        }

        setCourse(courseData)
        setEditForm({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          status: courseData.status as "draft" | "active" | "archived",
        })

        const courseStudents = getStudentsByCourse(courseId)
        setStudents(courseStudents)

        const courseAnalytics = getCourseAnalytics(courseId)
        setAnalytics(courseAnalytics)

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading course data:", error)
        setIsLoading(false)
      }
    }

    loadCourseData()
  }, [courseId, router])

  const handleSaveChanges = () => {
    if (!course) return

    try {
      const updatedCourse = updateCourse(courseId, editForm)
      setCourse(updatedCourse)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating course:", error)
    }
  }

  const handleDuplicateCourse = () => {
    try {
      const duplicatedCourse = duplicateCourse(courseId)
      router.push(`/teacher/courses/${duplicatedCourse.id}/manage`)
    } catch (error) {
      console.error("Error duplicating course:", error)
    }
  }

  const handleDeleteCourse = () => {
    try {
      deleteCourse(courseId)
      router.push("/teacher/courses")
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { className: "bg-green-100 text-green-800", label: "Published" },
      draft: { className: "bg-gray-100 text-gray-800", label: "Draft" },
      archived: { className: "bg-red-100 text-red-800", label: "Archived" },
    }
    const config = variants[status as keyof typeof variants] || variants.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </TeacherLayout>
    )
  }

  if (!course) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link href="/teacher/courses">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/teacher/courses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                {getStatusBadge(course.status)}
                <span className="text-sm text-gray-500">
                  Created {formatDate(course.createdAt)} • Updated {formatDate(course.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/course/${course.id}`}>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Course
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicateCourse}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Course
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleDeleteCourse}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Enrolled Students</p>
                  <p className="text-2xl font-bold">{course.enrolledStudents}</p>
                  <p className="text-xs text-gray-500">{analytics?.newEnrollments || 0} this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(course.price * course.enrolledStudents)}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(analytics?.monthlyRevenue || 0)} this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Course Rating</p>
                  <p className="text-2xl font-bold">{course.rating}</p>
                  <p className="text-xs text-gray-500">{course.reviewCount} reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold">{analytics?.averageProgress || 0}%</p>
                  <p className="text-xs text-gray-500">{analytics?.completedStudents || 0} completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Course Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Course Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                          id="title"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Price:</span> {formatCurrency(course.price)}
                        </div>
                        <div>
                          <span className="font-medium">Level:</span> {course.level}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {course.duration}
                        </div>
                        <div>
                          <span className="font-medium">Lessons:</span> {course.totalLessons}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Materials
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Message All Students
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">New student enrolled: Alice Johnson</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Course received a 5-star review from Bob Smith</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Student completed lesson: "Introduction to Calculus"</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>Manage your course sections and lessons</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock curriculum sections */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Section 1: Algebra Fundamentals</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">3 lessons</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit Section</DropdownMenuItem>
                            <DropdownMenuItem>Add Lesson</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>📹 Linear Equations (15 min)</span>
                        <Badge variant="outline">Preview</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>📄 Quadratic Functions (20 min)</span>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>📋 Practice Problems Set 1 (30 min)</span>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Section 2: Calculus Introduction</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">3 lessons</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit Section</DropdownMenuItem>
                            <DropdownMenuItem>Add Lesson</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>📹 Limits and Continuity (25 min)</span>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>📄 Derivatives (30 min)</span>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>📹 Integration Basics (35 min)</span>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Enrolled Students</CardTitle>
                  <CardDescription>{students.length} students enrolled in this course</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export List
                  </Button>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Message All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{student.firstName} {student.lastName}</h3>
                            <p className="text-sm text-gray-500">
                              Enrolled {formatDate(student.enrolledAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{student.progress}% Complete</p>
                            <Progress value={student.progress} className="w-24" />
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No students enrolled yet</p>
                    <p className="text-sm">Students will appear here once they enroll in your course</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enrollment chart would go here</p>
                      <p className="text-sm">Integration with charting library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed Course</span>
                      <span className="text-sm font-medium">{analytics?.completedStudents || 0} students</span>
                    </div>
                    <Progress value={((analytics?.completedStudents || 0) / course.enrolledStudents) * 100} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Progress</span>
                      <span className="text-sm font-medium">
                        {course.enrolledStudents - (analytics?.completedStudents || 0)} students
                      </span>
                    </div>
                    <Progress 
                      value={((course.enrolledStudents - (analytics?.completedStudents || 0)) / course.enrolledStudents) * 100} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(course.price * course.enrolledStudents)}
                    </p>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(analytics?.monthlyRevenue || 0)}
                    </p>
                    <p className="text-sm text-gray-500">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(course.price)}
                    </p>
                    <p className="text-sm text-gray-500">Per Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Reviews</CardTitle>
                <CardDescription>
                  {course.reviewCount} reviews • {course.rating} average rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Reviews integration would go here</p>
                  <p className="text-sm">Connect with the existing review system</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Course Visibility</h3>
                    <p className="text-sm text-gray-500">Make this course visible to students</p>
                  </div>
                  <Switch checked={course.status === "active"} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Reviews</h3>
                    <p className="text-sm text-gray-500">Allow students to leave reviews</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications for new enrollments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-600">Archive Course</h3>
                    <p className="text-sm text-gray-500">Hide this course from students but keep the data</p>
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-600">
                    Archive
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-600">Delete Course</h3>
                    <p className="text-sm text-gray-500">Permanently delete this course and all its data</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the course
                          "{course.title}" and remove all associated data including student progress,
                          reviews, and materials.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-600">
                          Delete Course
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  )
}
