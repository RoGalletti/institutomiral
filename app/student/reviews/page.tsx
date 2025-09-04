"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, BookOpen, MessageSquare, ThumbsUp, Award, Search, Filter, Plus } from "lucide-react"
import { StudentLayout } from "@/components/student-layout"
import {
  getCurrentUser,
  getCompletedCourses,
  addCourseReview,
  canReviewCourse,
  hasReviewedCourse,
  getStudentReview,
  markReviewHelpful,
  getUserReviewVote,
  type Course,
  type Enrollment,
  type CourseReview,
} from "@/lib/mock-database"

export default function StudentReviewsPage() {
  const [completedCourses, setCompletedCourses] = useState<(Course & { enrollment: Enrollment })[]>([])
  const [myReviews, setMyReviews] = useState<CourseReview[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    comment: "",
    pros: [""],
    cons: [""],
    wouldRecommend: true,
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.role === "student") {
      setCurrentUser(user)
      const completed = getCompletedCourses(user.id)
      setCompletedCourses(completed)

      // Get user's reviews
      const userReviews = completed
        .map((course) => getStudentReview(user.id, course.id))
        .filter((review): review is CourseReview => review !== undefined)
      setMyReviews(userReviews)
    }
  }, [])

  const handleOpenReviewDialog = (course: Course) => {
    setSelectedCourse(course)
    setReviewForm({
      rating: 0,
      title: "",
      comment: "",
      pros: [""],
      cons: [""],
      wouldRecommend: true,
    })
    setIsReviewDialogOpen(true)
  }

  const handleSubmitReview = () => {
    if (!currentUser || !selectedCourse || reviewForm.rating === 0) return

    const review = addCourseReview({
      courseId: selectedCourse.id,
      studentId: currentUser.id,
      studentName: `${currentUser.firstName} ${currentUser.lastName}`,
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment,
      pros: reviewForm.pros.filter((pro) => pro.trim() !== ""),
      cons: reviewForm.cons.filter((con) => con.trim() !== ""),
      wouldRecommend: reviewForm.wouldRecommend,
      isVerifiedPurchase: true,
    })

    setMyReviews([...myReviews, review])
    setIsReviewDialogOpen(false)
  }

  const addProsCons = (type: "pros" | "cons") => {
    setReviewForm((prev) => ({
      ...prev,
      [type]: [...prev[type], ""],
    }))
  }

  const updateProsCons = (type: "pros" | "cons", index: number, value: string) => {
    setReviewForm((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeProsCons = (type: "pros" | "cons", index: number) => {
    setReviewForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const StarRating = ({ rating, onRatingChange, readonly = false }: any) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  const ReviewCard = ({ review, showCourse = false }: { review: CourseReview; showCourse?: boolean }) => {
    const course = completedCourses.find((c) => c.id === review.courseId)
    const userVote = getUserReviewVote(review.id, currentUser?.id || "")

    const handleHelpfulClick = (isHelpful: boolean) => {
      if (currentUser) {
        markReviewHelpful(review.id, currentUser.id, isHelpful)
        // In a real app, you'd refresh the data here
      }
    }

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {showCourse && course && (
                <div className="mb-2">
                  <Link href={`/course/${course.id}`} className="text-blue-600 hover:underline font-medium">
                    {course.title}
                  </Link>
                </div>
              )}
              <div className="flex items-center space-x-2 mb-2">
                <StarRating rating={review.rating} readonly />
                <Badge variant="outline" className="text-xs">
                  {review.isVerifiedPurchase ? "Verified Purchase" : "Unverified"}
                </Badge>
              </div>
              <CardTitle className="text-lg">{review.title}</CardTitle>
              <CardDescription>
                by {review.studentName} • {new Date(review.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{review.comment}</p>

          {review.pros.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-green-700 mb-2">👍 Pros:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
          )}

          {review.cons.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-red-700 mb-2">👎 Cons:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Would recommend:</span>
                <Badge variant={review.wouldRecommend ? "default" : "secondary"}>
                  {review.wouldRecommend ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleHelpfulClick(true)}
                className={userVote === true ? "text-blue-600" : ""}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful ({review.helpfulVotes})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredCompletedCourses = completedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedMyReviews = [...myReviews].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Course Reviews</h1>
          <p className="text-gray-600">Share your experience and help other students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Completed Courses</p>
                  <p className="text-2xl font-bold">{completedCourses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Reviews Written</p>
                  <p className="text-2xl font-bold">{myReviews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Average Rating Given</p>
                  <p className="text-2xl font-bold">
                    {myReviews.length > 0
                      ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Helpful Votes</p>
                  <p className="text-2xl font-bold">{myReviews.reduce((sum, r) => sum + r.helpfulVotes, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="write-reviews" className="space-y-4">
          <TabsList>
            <TabsTrigger value="write-reviews">Write Reviews</TabsTrigger>
            <TabsTrigger value="my-reviews">My Reviews ({myReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="write-reviews" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search completed courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Courses Available for Review</CardTitle>
                <CardDescription>You can only review courses you've completed</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredCompletedCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No completed courses found</h3>
                    <p className="text-gray-600">Complete some courses to start writing reviews</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCompletedCourses.map((course) => {
                      const canReview = canReviewCourse(currentUser?.id || "", course.id)
                      const hasReviewed = hasReviewedCourse(currentUser?.id || "", course.id)

                      return (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <p className="text-sm text-gray-600">by {course.teacher}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  Completed {new Date(course.enrollment.completedAt!).toLocaleDateString()}
                                </Badge>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span className="text-sm">{course.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            {hasReviewed ? (
                              <Badge variant="secondary">Review Written</Badge>
                            ) : canReview ? (
                              <Button onClick={() => handleOpenReviewDialog(course)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Write Review
                              </Button>
                            ) : (
                              <Badge variant="outline">Not Eligible</Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-reviews" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Reviews</h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sortedMyReviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Start writing reviews for your completed courses</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedMyReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} showCourse={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                {selectedCourse && `Share your experience with "${selectedCourse.title}"`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Rating */}
              <div>
                <Label className="text-base font-medium">Overall Rating *</Label>
                <div className="mt-2">
                  <StarRating
                    rating={reviewForm.rating}
                    onRatingChange={(rating: number) => setReviewForm((prev) => ({ ...prev, rating }))}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Review Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience in a few words"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment" className="text-base font-medium">
                  Detailed Review *
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share your detailed thoughts about the course content, instructor, and overall experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  className="mt-2 min-h-[120px]"
                />
              </div>

              {/* Pros */}
              <div>
                <Label className="text-base font-medium">What did you like? (Pros)</Label>
                <div className="mt-2 space-y-2">
                  {reviewForm.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="What was good about this course?"
                        value={pro}
                        onChange={(e) => updateProsCons("pros", index, e.target.value)}
                      />
                      {reviewForm.pros.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeProsCons("pros", index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addProsCons("pros")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pro
                  </Button>
                </div>
              </div>

              {/* Cons */}
              <div>
                <Label className="text-base font-medium">What could be improved? (Cons)</Label>
                <div className="mt-2 space-y-2">
                  {reviewForm.cons.map((con, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="What could be better about this course?"
                        value={con}
                        onChange={(e) => updateProsCons("cons", index, e.target.value)}
                      />
                      {reviewForm.cons.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeProsCons("cons", index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addProsCons("cons")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Con
                  </Button>
                </div>
              </div>

              {/* Recommendation */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommend"
                  checked={reviewForm.wouldRecommend}
                  onCheckedChange={(checked) =>
                    setReviewForm((prev) => ({ ...prev, wouldRecommend: checked as boolean }))
                  }
                />
                <Label htmlFor="recommend" className="text-base font-medium">
                  I would recommend this course to other students
                </Label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={reviewForm.rating === 0 || !reviewForm.title.trim() || !reviewForm.comment.trim()}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StudentLayout>
  )
}
