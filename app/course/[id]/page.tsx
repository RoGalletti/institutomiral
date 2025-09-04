"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Download, Play, Lock, FileText, Archive } from "lucide-react"
import {
  getCourseById,
  getCurrentUser,
  isEnrolledInCourse,
  getCourseSections,
  getCourseMaterials,
} from "@/lib/mock-database"
import type { Course, CourseMaterial, CourseSection } from "@/lib/mock-database"
import { CourseReviews } from "@/components/course-reviews"

export default function CoursePage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [courseSections, setCourseSections] = useState<CourseSection[]>([])
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([])

  useEffect(() => {
    const courseData = getCourseById(params.id as string)
    const user = getCurrentUser()

    if (courseData) {
      setCourse(courseData)
      setCourseSections(getCourseSections(courseData.id))
      setCourseMaterials(getCourseMaterials(courseData.id))

      if (user) {
        setIsPaid(isEnrolledInCourse(user.id, courseData.id))
      }
    }
  }, [params.id])

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p>Course not found</p>
      </div>
    )
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "zip":
        return <Archive className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-lg text-gray-600 mt-2">by {course.teacher}</p>
              <p className="text-gray-600 mt-2">{course.description}</p>
            </div>
            <div className="text-right">
              {isPaid ? (
                <Badge variant="default" className="mb-2">
                  Enrolled
                </Badge>
              ) : (
                <div>
                  <p className="text-2xl font-bold">${course.price}</p>
                  <Button className="mt-2">Enroll Now</Button>
                </div>
              )}
            </div>
          </div>

          {isPaid && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Course Progress</span>
                <span>
                  {course.completedLessons}/{course.totalLessons} lessons completed
                </span>
              </div>
              <Progress value={course.progress} className="h-3" />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>Thematic index of all course content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {courseSections.map((section) => (
                        <AccordionItem key={section.id} value={`section-${section.id}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center justify-between w-full mr-4">
                              <span className="font-medium">{section.title}</span>
                              <span className="text-sm text-gray-500">{section.lessons.length} lessons</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {section.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center justify-between p-3 rounded-lg border ${
                                    lesson.completed ? "bg-green-50 border-green-200" : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    {getFileIcon(lesson.type)}
                                    <div>
                                      <h4 className="font-medium">{lesson.title}</h4>
                                      <p className="text-sm text-gray-600">{lesson.duration}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {lesson.completed && (
                                      <Badge variant="secondary" className="text-xs">
                                        Completed
                                      </Badge>
                                    )}
                                    {isPaid ? (
                                      <Button size="sm" variant="outline">
                                        {lesson.completed ? "Review" : "Start"}
                                      </Button>
                                    ) : (
                                      <Lock className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Materials</CardTitle>
                    <CardDescription>Download textual content and supplementary resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {courseMaterials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(material.type)}
                            <div>
                              <h4 className="font-medium">{material.name}</h4>
                              <p className="text-sm text-gray-600">{material.size}</p>
                            </div>
                          </div>
                          <div>
                            {material.downloadable ? (
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            ) : (
                              <div className="flex items-center space-x-2 text-gray-400">
                                <Lock className="h-4 w-4" />
                                <span className="text-sm">Premium</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="space-y-4">
                <CourseReviews courseId={course.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Instructor</h4>
                  <p className="text-gray-600">{course.teacher}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Total Lessons</h4>
                  <p className="text-gray-600">{course.totalLessons} lessons</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Subject</h4>
                  <p className="text-gray-600">Mathematics</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Level</h4>
                  <p className="text-gray-600">High School Advanced</p>
                </div>
              </CardContent>
            </Card>

            {isPaid && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download All Materials
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Message Teacher
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Certificate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
