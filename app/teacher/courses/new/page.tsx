"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Plus,
  Trash2,
  GripVertical,
  Play,
  FileText,
  Save,
  Eye,
  ArrowLeft,
  BookOpen,
  DollarSign,
  Clock,
  Star,
} from "lucide-react";
import { TeacherLayout } from "@/components/teacher-layout";
import { getCurrentUser, createCourse } from "@/lib/mock-database";

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "video" | "text" | "pdf" | "quiz";
  duration: string;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  isPreview: boolean;
  order: number;
}

interface CourseSection {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export default function NewCoursePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Course basic information
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    subject: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    price: 0,
    duration: "",
    thumbnail: "",
    status: "draft" as "draft" | "active",
    tags: [] as string[],
    requirements: [] as string[],
    learningObjectives: [] as string[],
  });

  // Course curriculum
  const [sections, setSections] = useState<CourseSection[]>([
    {
      id: "1",
      title: "",
      description: "",
      lessons: [],
      order: 1,
    },
  ]);

  const [newTag, setNewTag] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newObjective, setNewObjective] = useState("");

  useState(() => {
    const user = getCurrentUser();
    if (user && user.role === "teacher") {
      setCurrentUser(user);
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCourseData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setCourseData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setCourseData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setCourseData((prev) => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, newObjective.trim()],
      }));
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setCourseData((prev) => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index),
    }));
  };

  const addSection = () => {
    const newSection: CourseSection = {
      id: Date.now().toString(),
      title: "",
      description: "",
      lessons: [],
      order: sections.length + 1,
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (sectionId: string, field: string, value: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const addLesson = (sectionId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      description: "",
      type: "video",
      duration: "",
      isPreview: false,
      order: 1,
    };

    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                { ...newLesson, order: section.lessons.length + 1 },
              ],
            }
          : section
      )
    );
  };

  const updateLesson = (
    sectionId: string,
    lessonId: string,
    field: string,
    value: any
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
              ),
            }
          : section
      )
    );
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.filter(
                (lesson) => lesson.id !== lessonId
              ),
            }
          : section
      )
    );
  };

  const handleSubmit = async (status: "draft" | "active") => {
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      // Calculate total lessons
      const totalLessons = sections.reduce(
        (total, section) => total + section.lessons.length,
        0
      );

      const newCourse = createCourse({
        title: courseData.title,
        description: courseData.description,
        teacherId: currentUser.id,
        teacher: `${currentUser.firstName} ${currentUser.lastName}`,
        price: courseData.price,
        subject: courseData.subject,
        level: courseData.level,
        duration: courseData.duration,
        totalLessons,
        thumbnail:
          courseData.thumbnail ||
          "/placeholder.svg?height=200&width=300&text=" +
            encodeURIComponent(courseData.title),
        status,
        tags: courseData.tags,
        requirements: courseData.requirements,
        learningObjectives: courseData.learningObjectives,
        sections,
      });

      // Redirect to course management or edit page
      if (status === "draft") {
        router.push(`/teacher/courses/${newCourse.id}/edit`);
      } else {
        router.push("/teacher/courses");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBasicInfoValid =
    courseData.title &&
    courseData.description &&
    courseData.subject &&
    courseData.price >= 0;
  const isCurriculumValid = sections.some(
    (section) => section.title && section.lessons.length > 0
  );

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Crear nuevo curso</h1>
              <p className="text-gray-600">
                Crea y publica el contenido de tu curso.
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting || !courseData.title}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar como borrador
            </Button>
            <Button
              onClick={() => handleSubmit("active")}
              disabled={isSubmitting || !isBasicInfoValid || !isCurriculumValid}
            >
              <Eye className="h-4 w-4 mr-2" />
              Publicar curso
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Información básica</TabsTrigger>
            <TabsTrigger value="curriculum">Plan de estudios</TabsTrigger>
            <TabsTrigger value="pricing">Precios y configuración</TabsTrigger>
            <TabsTrigger value="preview">Vista previa</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del curso</CardTitle>
                <CardDescription>
                  Información básica sobre el curso.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título del curso *</Label>
                      <Input
                        id="title"
                        placeholder="Introduzca el título del curso"
                        value={courseData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Asignatura *</Label>
                      <Select
                        value={courseData.subject}
                        onValueChange={(value) =>
                          handleInputChange("subject", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la asignatura" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matemáticas">
                            Matemáticas
                          </SelectItem>
                          <SelectItem value="Física">Física</SelectItem>
                          <SelectItem value="Química">Química</SelectItem>
                          <SelectItem value="Biología">Biología</SelectItem>
                          <SelectItem value="Inglés">Inglés</SelectItem>
                          <SelectItem value="Historia">Historia</SelectItem>
                          <SelectItem value="Informática">
                            Informática
                          </SelectItem>
                          <SelectItem value="Arte">Arte</SelectItem>
                          <SelectItem value="Música">Música</SelectItem>
                          <SelectItem value="Idiomas">Idiomas</SelectItem>
                          <SelectItem value="Psicología">Psicología</SelectItem>
                          <SelectItem value="Ciencias">Ciencias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="level">Nivel de dificultad *</Label>
                      <Select
                        value={courseData.level}
                        onValueChange={(value) =>
                          handleInputChange("level", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Principiante</SelectItem>
                          <SelectItem value="intermediate">
                            Intermedio
                          </SelectItem>
                          <SelectItem value="advanced">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duración del curso</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 8 weeks, 20 hours"
                        value={courseData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">
                        Descripción del curso *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describir lo que aprenderán los alumnos en este curso"
                        value={courseData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={6}
                      />
                    </div>

                    <div>
                      <Label htmlFor="thumbnail">
                        URL de la miniatura del curso
                      </Label>
                      <Input
                        id="thumbnail"
                        placeholder="Introducir la URL de la imagen o subirla"
                        value={courseData.thumbnail}
                        onChange={(e) =>
                          handleInputChange("thumbnail", e.target.value)
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-transparent"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Subir imagen
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <Label>Etiquetas del curso</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {courseData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Añadir una etiqueta"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      Añadir
                    </Button>
                  </div>
                </div>

                {/* Requisitos */}
                <div>
                  <Label>Requisitos previos y requisitos</Label>
                  <div className="space-y-2 mb-2">
                    {courseData.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <span className="flex-1">{req}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Añadir un requisito"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addRequirement())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addRequirement}
                    >
                      Añadir
                    </Button>
                  </div>
                </div>

                {/* Objetivos de aprendizaje */}
                <div>
                  <Label>Objetivos de aprendizaje</Label>
                  <div className="space-y-2 mb-2">
                    {courseData.learningObjectives.map((obj, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <span className="flex-1">{obj}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjective(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Añada un objetivo de aprendizaje"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addObjective())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addObjective}
                    >
                      Añadir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Plan de estudios del curso</CardTitle>
                    <CardDescription>
                      Organice el contenido de su curso en secciones y lecciones
                    </CardDescription>
                  </div>
                  <Button onClick={addSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir sección
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {sections.map((section, sectionIndex) => (
                  <Card key={section.id} className="border-2 border-dashed">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            Sección {sectionIndex + 1}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          disabled={sections.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Input
                          placeholder="Título de la sección"
                          value={section.title}
                          onChange={(e) =>
                            updateSection(section.id, "title", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Descripción de la secciónn"
                          value={section.description}
                          onChange={(e) =>
                            updateSection(
                              section.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <Card key={lesson.id} className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm font-medium">
                                    Lección {lessonIndex + 1}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeLesson(section.id, lesson.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <Input
                                  placeholder="Título de la lección"
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLesson(
                                      section.id,
                                      lesson.id,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                />
                                <Select
                                  value={lesson.type}
                                  onValueChange={(value) =>
                                    updateLesson(
                                      section.id,
                                      lesson.id,
                                      "type",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="video">
                                      <div className="flex items-center">
                                        <Play className="h-4 w-4 mr-2" />
                                        Video
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="text">
                                      <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Texto/artículo
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="pdf">
                                      <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Documento PDF
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="quiz">
                                      <div className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Cuestionario
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <Input
                                  placeholder="Duration (e.g., 10 min)"
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLesson(
                                      section.id,
                                      lesson.id,
                                      "duration",
                                      e.target.value
                                    )
                                  }
                                />
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`preview-${lesson.id}`}
                                    checked={lesson.isPreview}
                                    onChange={(e) =>
                                      updateLesson(
                                        section.id,
                                        lesson.id,
                                        "isPreview",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`preview-${lesson.id}`}
                                    className="text-sm"
                                  >
                                    Vista previa gratuita
                                  </Label>
                                </div>
                              </div>

                              <Textarea
                                placeholder="Descripción de la lección"
                                value={lesson.description}
                                onChange={(e) =>
                                  updateLesson(
                                    section.id,
                                    lesson.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                rows={2}
                              />

                              {lesson.type === "video" && (
                                <div className="mt-4">
                                  <Label>URL del vídeo</Label>
                                  <Input
                                    placeholder="Introduzca la URL del vídeo"
                                    value={lesson.videoUrl || ""}
                                    onChange={(e) =>
                                      updateLesson(
                                        section.id,
                                        lesson.id,
                                        "videoUrl",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              )}

                              {lesson.type === "text" && (
                                <div className="mt-4">
                                  <Label>Contenido</Label>
                                  <Textarea
                                    placeholder="Enter lesson content"
                                    value={lesson.content || ""}
                                    onChange={(e) =>
                                      updateLesson(
                                        section.id,
                                        lesson.id,
                                        "content",
                                        e.target.value
                                      )
                                    }
                                    rows={4}
                                  />
                                </div>
                              )}

                              {(lesson.type === "pdf" ||
                                lesson.type === "quiz") && (
                                <div className="mt-4">
                                  <Label>URL del archivo</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Introduzca la URL del archivo"
                                      value={lesson.fileUrl || ""}
                                      onChange={(e) =>
                                        updateLesson(
                                          section.id,
                                          lesson.id,
                                          "fileUrl",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Button variant="outline" size="sm">
                                      <Upload className="h-4 w-4 mr-2" />
                                      Subir
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        <Button
                          variant="outline"
                          onClick={() => addLesson(section.id)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Añadir lección
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Precios y configuración</CardTitle>
                <CardDescription>
                  Establezca el precio de su curso y la configuración de
                  publicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Precio del curso (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={courseData.price}
                        onChange={(e) =>
                          handleInputChange(
                            "price",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Establezca 0 $ para un curso gratuito
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="status">Estado de publicación</Label>
                    <Select
                      value={courseData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          Borrador: no visible para los estudiantes
                        </SelectItem>
                        <SelectItem value="active">
                          Publicado: visible para los estudiantes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Resumen del curso
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {sections.reduce(
                          (total, section) => total + section.lessons.length,
                          0
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total de lecciones
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {courseData.duration || "TBD"}
                      </p>
                      <p className="text-sm text-gray-600">Duración</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">${courseData.price}</p>
                      <p className="text-sm text-gray-600">Precio</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{courseData.level}</p>
                      <p className="text-sm text-gray-600">Nivel</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vista previa del curso</CardTitle>
                <CardDescription>
                  Previsualice cómo verán el curso los estudiantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                      <img
                        src={
                          courseData.thumbnail ||
                          "/placeholder.svg?height=200&width=300&text=" +
                            encodeURIComponent(courseData.title || "Curso")
                        }
                        alt={courseData.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="lg:w-2/3">
                      <h2 className="text-2xl font-bold mb-2">
                        {courseData.title || "Título del curso"}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {courseData.description ||
                          "La descripción del curso aparecerá aquí"}
                      </p>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1 text-blue-600" />
                          <span className="text-sm">
                            {sections.reduce(
                              (total, section) =>
                                total + section.lessons.length,
                              0
                            )}{" "}
                            Lecciones
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-green-600" />
                          <span className="text-sm">
                            {courseData.duration || "Duración por determinar"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-600" />
                          <span className="text-sm">{courseData.level}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-green-600">
                          ${courseData.price}
                        </div>
                        <Badge
                          variant={
                            courseData.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {courseData.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {sections.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">
                        Contenido del curso
                      </h3>
                      <div className="space-y-4">
                        {sections.map((section, index) => (
                          <div
                            key={section.id}
                            className="border rounded-lg p-4"
                          >
                            <h4 className="font-medium mb-2">
                              Sección {index + 1}:{" "}
                              {section.title || "Sección sin título"}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {section.description}
                            </p>
                            <div className="space-y-2">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <div className="flex items-center">
                                    {lesson.type === "video" && (
                                      <Play className="h-4 w-4 mr-2" />
                                    )}
                                    {lesson.type === "text" && (
                                      <FileText className="h-4 w-4 mr-2" />
                                    )}
                                    {lesson.type === "pdf" && (
                                      <FileText className="h-4 w-4 mr-2" />
                                    )}
                                    {lesson.type === "quiz" && (
                                      <BookOpen className="h-4 w-4 mr-2" />
                                    )}
                                    <span>
                                      {lesson.title ||
                                        `Lesson ${lessonIndex + 1}`}
                                    </span>
                                    {lesson.isPreview && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 text-xs"
                                      >
                                        Vista previa
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-gray-500">
                                    {lesson.duration}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  );
}
