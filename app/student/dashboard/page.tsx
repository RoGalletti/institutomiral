"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Download, MessageSquare, CreditCard, Play, Lock } from "lucide-react"
import { StudentLayout } from "@/components/student-layout"

export default function StudentDashboard() {
  const [enrolledCourses] = useState([
    {
      id: 1,
      title: "Advanced Mathematics",
      teacher: "Dr. Wilson",
      progress: 75,
      materials: 12,
      paid: true,
      nextLesson: "Calculus Integration",
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      teacher: "Prof. Anderson",
      progress: 45,
      materials: 8,
      paid: true,
      nextLesson: "Newton's Laws",
    },
    {
      id: 3,
      title: "Chemistry Lab",
      teacher: "Dr. Brown",
      progress: 0,
      materials: 15,
      paid: false,
      nextLesson: "Atomic Structure",
    },
  ])

  const [availableCourses] = useState([
    { id: 4, title: "Biology Essentials", teacher: "Dr. Green", price: 99, students: 234 },
    { id: 5, title: "World History", teacher: "Prof. Davis", price: 79, students: 189 },
    { id: 6, title: "English Literature", teacher: "Ms. Johnson", price: 89, students: 156 },
  ])

  const [messages] = useState([
    {
      id: 1,
      teacher: "Dr. Wilson",
      course: "Advanced Mathematics",
      message: "Great work on your last assignment!",
      time: "2 hours ago",
    },
    {
      id: 2,
      teacher: "Prof. Anderson",
      course: "Physics Fundamentals",
      message: "Don't forget about tomorrow's quiz",
      time: "1 day ago",
    },
  ])

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">2 active, 1 pending payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">60%</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">35</div>
              <p className="text-xs text-muted-foreground">Materials downloaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="browse">Browse Courses</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <h2 className="text-xl font-semibold">My Enrolled Courses</h2>
            <div className="grid gap-4">
              {enrolledCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>by {course.teacher}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {course.paid ? (
                          <Badge variant="default">Paid</Badge>
                        ) : (
                          <Badge variant="destructive">Payment Required</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Next: {course.nextLesson}</p>
                          <p className="text-xs text-gray-500">{course.materials} materials available</p>
                        </div>
                        <div className="space-x-2">
                          {course.paid ? (
                            <>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Materials
                              </Button>
                              <Button size="sm">Continue Learning</Button>
                            </>
                          ) : (
                            <Button size="sm">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="browse" className="space-y-4">
            <h2 className="text-xl font-semibold">Available Courses</h2>
            <div className="grid gap-4">
              {availableCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>by {course.teacher}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${course.price}</p>
                        <p className="text-xs text-gray-500">{course.students} students</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Premium Content</span>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button size="sm">Enroll Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <h2 className="text-xl font-semibold">Messages from Teachers</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{msg.teacher}</h3>
                          <p className="text-sm text-gray-600">{msg.course}</p>
                          <p className="text-sm mt-1">{msg.message}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{msg.time}</p>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  )
}
