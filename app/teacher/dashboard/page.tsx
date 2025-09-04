"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  BookOpen,
  DollarSign,
  Star,
  TrendingUp,
  MessageSquare,
  Eye,
  Settings,
  Plus,
  BarChart3,
} from "lucide-react";
import { TeacherLayout } from "@/components/teacher-layout";
import {
  getCurrentUser,
  getCoursesByTeacher,
  getTeacherAnalytics,
  type Course,
  type User,
} from "@/lib/mock-database";

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== "teacher") {
          window.location.href = "/login";
          return;
        }

        setUser(currentUser);

        const teacherCourses = getCoursesByTeacher(currentUser.id);
        setCourses(teacherCourses);

        const teacherAnalytics = getTeacherAnalytics(currentUser.id);
        setAnalytics(teacherAnalytics);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { className: "bg-green-100 text-green-800", label: "Published" },
      draft: { className: "bg-gray-100 text-gray-800", label: "Draft" },
      archived: { className: "bg-red-100 text-red-800", label: "Archived" },
    };
    const config = variants[status as keyof typeof variants] || variants.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando panel...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  const totalStudents = courses.reduce(
    (sum, course) => sum + course.enrolledStudents,
    0
  );
  const totalRevenue = courses.reduce(
    (sum, course) => sum + course.price * course.enrolledStudents,
    0
  );
  const averageRating =
    courses.length > 0
      ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
      : 0;

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Bienvenid@ de nuevo, {user?.firstName}!
            </h1>
            <p className="text-gray-600">Vista general de tus cursos.</p>
          </div>
          <Link href="/teacher/courses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear nuevo curso
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Cursos</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-xs text-gray-500">
                    {courses.filter((c) => c.status === "active").length}{" "}
                    publicados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Total Estudiantes</p>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-xs text-gray-500">
                    {analytics?.newStudentsThisMonth || 0} este mes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Ingresos totales</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(analytics?.monthlyRevenue || 0)} este mes
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
                  <p className="text-sm font-medium">Valoración promedio</p>
                  <p className="text-2xl font-bold">
                    {averageRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {courses.reduce(
                      (sum, course) => sum + course.reviewCount,
                      0
                    )}{" "}
                    reseñas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actividad + Acciones */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Actividad Reciente */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Nuevo estudiante matriculado en «Advanced Mathematics»
                    </p>
                    <p className="text-xs text-gray-500">hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      El curso «Physics Fundamentals» recibió una valoración de
                      5 estrellas.
                    </p>
                    <p className="text-xs text-gray-500">hace 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Nuevo mensaje de un estudiante en «Chemistry Lab»
                    </p>
                    <p className="text-xs text-gray-500">hace 6 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Curso «Calculus Fundamentals» publicado con éxito.
                    </p>
                    <p className="text-xs text-gray-500">hace 1 día</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/teacher/courses/new">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nuevo Curso
                </Button>
              </Link>
              <Link href="/teacher/courses">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Gestionar Cursos
                </Button>
              </Link>
              <Link href="/messages">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ver Mensajes
                </Button>
              </Link>
              <Link href="/teacher/analytics">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Estadísticas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Mis Cursos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mis Cursos</CardTitle>
              <CardDescription>
                Gestiona y supervisa el rendimiento de tu curso.
              </CardDescription>
            </div>
            <Link href="/teacher/courses">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{course.title}</h3>
                        {getStatusBadge(course.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {course.enrolledStudents} estudiantes
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {course.rating} ({course.reviewCount})
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatCurrency(
                            course.price * course.enrolledStudents
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/course/${course.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/teacher/courses/${course.id}/manage`}>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Gestionar Curso
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aún no se han creado cursos.</p>
                  <p className="text-sm">Crea tu primer curso para empezar.</p>
                  <Link href="/teacher/courses/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Crea tu primer curso
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de los cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {course.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {course.enrolledStudents} estudiantes
                      </span>
                    </div>
                    <Progress value={(course.enrolledStudents / 200) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingresos mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(analytics?.monthlyRevenue || 0)}
                  </p>
                  <p className="text-sm text-gray-500">Este mes</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">
                    +12% respecto al mes pasado
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
