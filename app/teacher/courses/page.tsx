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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Copy,
  BarChart3,
} from "lucide-react";
import { TeacherLayout } from "@/components/teacher-layout";
import {
  getCurrentUser,
  getCoursesByTeacher,
  deleteCourse,
  duplicateCourse,
  type Course,
} from "@/lib/mock-database";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === "teacher") {
      setCurrentUser(user);
      const teacherCourses = getCoursesByTeacher(user.id);
      setCourses(teacherCourses);
      setFilteredCourses(teacherCourses);
    }
  }, []);

  useEffect(() => {
    let filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((course) => course.status === filterStatus);
    }

    // Por ahora los ordeno así
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "students":
          return b.enrolledStudents - a.enrolledStudents;
        case "rating":
          return b.rating - a.rating;
        case "revenue":
          return b.price * b.enrolledStudents - a.price * a.enrolledStudents;
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [courses, searchTerm, filterStatus, sortBy]);

  const handleDeleteCourse = () => {
    if (selectedCourse) {
      deleteCourse(selectedCourse.id);
      setCourses(courses.filter((c) => c.id !== selectedCourse.id));
      setIsDeleteDialogOpen(false);
      setSelectedCourse(null);
    }
  };

  const handleDuplicateCourse = (course: Course) => {
    const duplicatedCourse = duplicateCourse(course.id);
    setCourses([...courses, duplicatedCourse]);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: {
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      draft: {
        variant: "secondary" as const,
        color: "bg-gray-100 text-gray-800",
      },
      archived: {
        variant: "outline" as const,
        color: "bg-red-100 text-red-800",
      },
    };
    const config = variants[status as keyof typeof variants] || variants.draft;
    return (
      <Badge className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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

  const CourseCard = ({ course }: { course: Course }) => {
    const revenue = course.price * course.enrolledStudents;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            {getStatusBadge(course.status)}
          </div>
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/80 hover:bg-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/teacher/courses/${course.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Curso
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/course/${course.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Curso
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/teacher/courses/${course.id}/analytics`}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Estadísticas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicateCourse(course)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">
                {course.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {course.subject} • {course.level}
              </CardDescription>
            </div>
            <div className="text-right ml-4">
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(course.price)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{course.enrolledStudents}</p>
                <p className="text-xs text-gray-500">Estudiantes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">{course.rating}</p>
                <p className="text-xs text-gray-500">
                  Valoraciones ({course.reviewCount})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{formatCurrency(revenue)}</p>
                <p className="text-xs text-gray-500">Ingresos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{course.totalLessons}</p>
                <p className="text-xs text-gray-500">Lecciones</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Link
              href={`/teacher/courses/${course.id}/edit`}
              className="flex-1"
            >
              <Button variant="outline" className="w-full bg-transparent">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Link href={`/teacher/courses/${course.id}/analytics`}>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
            Última actualización: {formatDate(course.updatedAt)}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calculs
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
  const activeCourses = courses.filter((c) => c.status === "active").length;

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mis Cursos</h1>
            <p className="text-gray-600">
              Gestiona y haz seguimiento de tus cursos.
            </p>
          </div>
          <Link href="/teacher/courses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Curso
            </Button>
          </Link>
        </div>

        {/* Tarjetas de Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Cursos</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-xs text-gray-500">
                    {activeCourses} activos
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
                  <p className="text-xs text-gray-500">En todos los cursos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Total Ingresos</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500">Desde el comienzo</p>
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
                  <p className="text-xs text-gray-500">En todos los cursos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">
                Todos los cursos ({courses.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Activos ({courses.filter((c) => c.status === "active").length})
              </TabsTrigger>
              <TabsTrigger value="draft">
                Borradores ({courses.filter((c) => c.status === "draft").length}
                )
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archivados (
                {courses.filter((c) => c.status === "archived").length})
              </TabsTrigger>
            </TabsList>

            {/* Búsqueda y Filtros */}
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    Actualizado recientemente
                  </SelectItem>
                  <SelectItem value="title">Título A-Z</SelectItem>
                  <SelectItem value="students">Más estudiantes</SelectItem>
                  <SelectItem value="rating">Mejor valorado</SelectItem>
                  <SelectItem value="revenue">Mayores ingresos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredCourses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    {searchTerm
                      ? "No se han encontrado cursos"
                      : "Aún no hay cursos disponibles"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "Intenta ajustar los términos de búsqueda"
                      : "Crea tu primer curso para empezar"}
                  </p>
                  {!searchTerm && (
                    <Link href="/teacher/courses/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Crea tu primer curso
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses
                .filter((c) => c.status === "active")
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses
                .filter((c) => c.status === "draft")
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses
                .filter((c) => c.status === "archived")
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de eliminación */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar curso</DialogTitle>
              <DialogDescription>
                ¿Estás seguro que quieres eliminar «{selectedCourse?.title}»?
                Esta acción no se puede deshacer. Todo el contenido del curso,
                las matriculaciones de los alumnos y los datos se eliminarán de
                forma permanente.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteCourse}>
                Eliminar curso
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  );
}
