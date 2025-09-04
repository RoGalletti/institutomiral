"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, Filter, MessageSquare } from "lucide-react";
import {
  getCourseReviews,
  getCurrentUser,
  markReviewHelpful,
  getUserReviewVote,
  type CourseReview,
} from "@/lib/mock-database";

interface CourseReviewsProps {
  courseId: string;
}

export function CourseReviews({ courseId }: CourseReviewsProps) {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ratingBreakdown, setRatingBreakdown] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    loadReviews();
  }, [courseId, sortBy]);

  const loadReviews = () => {
    const courseReviews = getCourseReviews(courseId, sortBy);
    setReviews(courseReviews);

    // Calculate rating breakdown
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    courseReviews.forEach((review) => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });
    setRatingBreakdown(breakdown);
  };

  const handleHelpfulClick = (reviewId: string, isHelpful: boolean) => {
    if (currentUser) {
      markReviewHelpful(reviewId, currentUser.id, isHelpful);
      loadReviews(); // Refresh reviews to show updated helpful count
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const ReviewCard = ({ review }: { review: CourseReview }) => {
    const userVote = currentUser
      ? getUserReviewVote(review.id, currentUser.id)
      : null;

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <StarRating rating={review.rating} />
                <Badge variant="outline" className="text-xs">
                  {review.isVerifiedPurchase
                    ? "Verified Purchase"
                    : "Unverified"}
                </Badge>
              </div>
              <CardTitle className="text-lg">{review.title}</CardTitle>
              <CardDescription>
                por {review.studentName} •{" "}
                {new Date(review.createdAt).toLocaleDateString()}
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
                <span className="text-sm text-gray-600">Lo recomiendo:</span>
                <Badge
                  variant={review.wouldRecommend ? "default" : "secondary"}
                >
                  {review.wouldRecommend ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleHelpfulClick(review.id, true)}
                className={userVote === true ? "text-blue-600" : ""}
                disabled={!currentUser}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful ({review.helpfulVotes})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Reseñas de estudiantes</CardTitle>
          <CardDescription>{totalReviews} reseñas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} />
              <p className="text-sm text-gray-600 mt-2">
                {totalReviews} reseñas
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingBreakdown[rating] || 0;
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-8">{rating}★</span>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Reseñas ({totalReviews})</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Últimas primero</SelectItem>
            <SelectItem value="oldest">Antiguas primero</SelectItem>
            <SelectItem value="highest">Mayor valoración</SelectItem>
            <SelectItem value="lowest">Menor valoración</SelectItem>
            <SelectItem value="helpful">Más útiles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin reseñas</h3>
            <p className="text-gray-600">
              Deja la primer reseña para este curso!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
