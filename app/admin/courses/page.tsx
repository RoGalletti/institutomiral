"use client";

import { AdminLayout } from "@/components/admin-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteCourse,
  duplicateCourse,
  mockCourses,
  updateCourse,
  type Course,
} from "@/lib/mock-database";
import {
  Archive,
  ArrowUpDown,
  BookOpen,
  Copy,
  DollarSign,
  Download,
  Eye,
  Filter,
  Pause,
  Play,
  Search,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    draftCourses: 0,
    archivedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseDetailsOpen, setCourseDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    courses,
    searchQuery,
    statusFilter,
    subjectFilter,
    levelFilter,
    sortBy,
    sortOrder,
  ]);

  const loadData = () => {
    setCourses(mockCourses);

    // Calcular stats
    const totalCourses = mockCourses.length;
    const activeCourses = mockCourses.filter(
      (c) => c.status === "active"
    ).length;
    const draftCourses = mockCourses.filter((c) => c.status === "draft").length;
    const archivedCourses = mockCourses.filter(
      (c) => c.status === "archived"
    ).length;
    const totalStudents = mockCourses.reduce(
      (sum, c) => sum + c.enrolledStudents,
      0
    );
    const totalRevenue = mockCourses.reduce(
      (sum, c) => sum + c.price * c.enrolledStudents,
      0
    );
    const averageRating =
      mockCourses.reduce((sum, c) => sum + c.rating, 0) / mockCourses.length;

    setStats({
      totalCourses,
      activeCourses,
      draftCourses,
      archivedCourses,
      totalStudents,
      totalRevenue,
      averageRating,
    });
  };

  //** FILTROS **//

  const applyFilters = () => {
    let filtered = [...courses];

    // Filtro búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.teacher.toLowerCase().includes(query) ||
          course.subject.toLowerCase().includes(query)
      );
    }

    // Filtro estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    // Filtro asignatura
    if (subjectFilter !== "all") {
      filtered = filtered.filter((course) => course.subject === subjectFilter);
    }

    // Filtro nivel
    if (levelFilter !== "all") {
      filtered = filtered.filter((course) => course.level === levelFilter);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Course];
      let bValue: any = b[sortBy as keyof Course];

      if (
        sortBy === "price" ||
        sortBy === "enrolledStudents" ||
        sortBy === "rating"
      ) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCourses(filtered);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseDetailsOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDuplicateCourse = async (course: Course) => {
    setIsLoading(true);
    try {
      await duplicateCourse(course.id);
      loadData();
    } catch (error) {
      console.error("Error duplicando curso:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (course: Course) => {
    setIsLoading(true);
    try {
      const newStatus = course.status === "active" ? "draft" : "active";
      await updateCourse(course.id, { status: newStatus });
      loadData();
    } catch (error) {
      console.error("Error actualizando el estado del curso:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteCourse = async () => {
    if (courseToDelete) {
      setIsLoading(true);
      try {
        await deleteCourse(courseToDelete.id);
        loadData();
        setDeleteDialogOpen(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error("Error eliminando el curso:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Título",
      "Profesor",
      "Asignatura",
      "Nivel",
      "Precio",
      "Estudiantes",
      "Valoración",
      "Estado",
      "Creado",
    ];
    const csvData = filteredCourses.map((course) => [
      course.title,
      course.teacher,
      course.subject,
      course.level,
      `$${course.price}`,
      course.enrolledStudents.toString(),
      course.rating.toString(),
      course.status,
      new Date(course.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `courses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4 text-green-600" />;
      case "draft":
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case "archived":
        return <Archive className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getCourseStatusEspanol = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      default:
        return "Desconocido";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCourseLevelEspanol = (level: string) => {
    switch (level) {
      case "beginner":
        return "Principiante";
      case "intermediate":
        return "Intermedio";
      case "advanced":
        return "Avanzado";
      default:
        return "Desconocido";
    }
  };

  const uniqueSubjects = Array.from(new Set(courses.map((c) => c.subject)));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestionar cursos</h1>
          <p className="text-gray-600">
            Gestiona todos los cursos y su contenido
          </p>
        </div>

        {/* NumeroSS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Cursos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeCourses} activos, {stats.draftCourses} en borrador
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Estudiantes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                En todos los cursos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Por ventas de cursos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valoración promedio
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                En todos los cursos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Coso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros & Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Buscar Cursos</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="SBuscar por título, profesor o asignatura..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="archived">Archivados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Asignatura</Label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Nivel</Label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla Cursos */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los Cursos</CardTitle>
            <CardDescription>
              Mostrando {filteredCourses.length} de {courses.length} cursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "title") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("title");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Curso
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Profesor</TableHead>
                    <TableHead>Asignatura</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "price") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("price");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Precio
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "enrolledStudents") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("enrolledStudents");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Estudiantes
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "rating") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("rating");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Valoración
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        No se encontraron cursos que coincidan con los filtros
                        de búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              className="w-12 h-8 object-cover rounded"
                            />
                            <div>
                              <div
                                className="font-medium max-w-[200px] truncate"
                                title={course.title}
                              >
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {course.totalLessons} lecciones •{" "}
                                {course.duration}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{course.teacher}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.subject}</Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                              course.level
                            )}`}
                          >
                            {getCourseLevelEspanol(course.level)}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${course.price}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            {course.enrolledStudents}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            {course.rating}
                            <span className="text-sm text-gray-500">
                              ({course.reviewCount})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(course.status) as any}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getStatusIcon(course.status)}
                            {getCourseStatusEspanol(course.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCourse(course)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDuplicateCourse(course)}
                              disabled={isLoading}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(course)}
                              disabled={isLoading}
                            >
                              {course.status === "active" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCourse(course)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalle curso */}
      <Dialog open={courseDetailsOpen} onOpenChange={setCourseDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Curso</DialogTitle>
            <DialogDescription>
              Información completa de {selectedCourse?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Título
                    </Label>
                    <p className="font-medium text-lg">
                      {selectedCourse.title}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Descripción
                    </Label>
                    <p className="text-sm text-gray-600">
                      {selectedCourse.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Profesor
                      </Label>
                      <p>{selectedCourse.teacher}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Asignatura
                      </Label>
                      <Badge variant="outline">{selectedCourse.subject}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Nivel
                      </Label>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                          selectedCourse.level
                        )}`}
                      >
                        {getCourseLevelEspanol(selectedCourse.level)}
                      </span>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Duración
                      </Label>
                      <p>{selectedCourse.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <img
                    src={selectedCourse.thumbnail || "/placeholder.svg"}
                    alt={selectedCourse.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Precio
                      </Label>
                      <p className="text-2xl font-bold">
                        ${selectedCourse.price}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Estudiantes
                      </Label>
                      <p className="text-2xl font-bold">
                        {selectedCourse.enrolledStudents}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Valoración
                      </Label>
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-xl font-bold">
                          {selectedCourse.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({selectedCourse.reviewCount} reseñas)
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Lecciones
                      </Label>
                      <p className="text-2xl font-bold">
                        {selectedCourse.totalLessons}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCourse.tags && selectedCourse.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Etiquetas
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCourse.requirements &&
                selectedCourse.requirements.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Requisitos
                    </Label>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {selectedCourse.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedCourse.learningObjectives &&
                selectedCourse.learningObjectives.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Objetivos de aprendizaje
                    </Label>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {selectedCourse.learningObjectives.map((obj, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Creado
                  </Label>
                  <p className="text-sm">
                    {new Date(selectedCourse.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Última Actualización
                  </Label>
                  <p className="text-sm">
                    {new Date(selectedCourse.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Estado
                  </Label>
                  <Badge
                    variant={getStatusColor(selectedCourse.status) as any}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(selectedCourse.status)}
                    {selectedCourse.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    ID Curso
                  </Label>
                  <p className="font-mono text-sm">{selectedCourse.id}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCourseDetailsOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              onClick={() => {
                setCourseDetailsOpen(false);
                // Va a la ruta de edición del curso
                window.open(
                  `/teacher/courses/${selectedCourse?.id}/manage`,
                  "_blank"
                );
              }}
            >
              Editar Curso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar boshar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el curso <strong>"{courseToDelete?.title}"</strong> a y eliminará
              todos los datos asociados, incluyendo matrículas de estudiantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCourse}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar Curso"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
