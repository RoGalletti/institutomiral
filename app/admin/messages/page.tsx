"use client";

import { AdminLayout } from "@/components/admin-layout";
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
import { Textarea } from "@/components/ui/textarea";
import {
  getCourseById,
  getUserById,
  mockMessages,
  mockUsers,
  type Message,
} from "@/lib/mock-database";
import {
  AlertCircle,
  ArrowUpDown,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  MessageSquare,
  Reply,
  Search,
  Send,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ExtendedMessage extends Message {
  senderName: string;
  receiverName: string;
  courseName?: string;
  isFromAdmin: boolean;
  isToAdmin: boolean;
  priority: "low" | "medium" | "high";
  category: "general" | "technical" | "billing" | "course";
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ExtendedMessage[]>(
    []
  );
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0,
    pendingReplies: 0,
    averageResponseTime: "2.5 hours",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("sentAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedMessage, setSelectedMessage] =
    useState<ExtendedMessage | null>(null);
  const [messageDetailsOpen, setMessageDetailsOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    messages,
    searchQuery,
    statusFilter,
    categoryFilter,
    priorityFilter,
    sortBy,
    sortOrder,
  ]);

  const loadData = () => {
    // Info adicional de los mensajes
    const extendedMessages: ExtendedMessage[] = mockMessages.map((message) => {
      const sender = getUserById(message.senderId);
      const receiver = getUserById(message.receiverId);
      const course = message.courseId
        ? getCourseById(message.courseId)
        : undefined;

      // Prioridad según contenido del mensaje
      let priority: "low" | "medium" | "high" = "medium";
      const content = message.content.toLowerCase();
      if (
        content.includes("urgent") ||
        content.includes("emergency") ||
        content.includes("asap")
      ) {
        priority = "high";
      } else if (content.includes("question") || content.includes("help")) {
        priority = "medium";
      } else {
        priority = "low";
      }

      // Categoría según contenido del mensaje
      let category: "general" | "technical" | "billing" | "course" = "general";
      if (
        content.includes("payment") ||
        content.includes("billing") ||
        content.includes("refund")
      ) {
        category = "billing";
      } else if (
        content.includes("technical") ||
        content.includes("bug") ||
        content.includes("error")
      ) {
        category = "technical";
      } else if (message.courseId) {
        category = "course";
      }

      return {
        ...message,
        senderName: sender
          ? `${sender.firstName} ${sender.lastName}`
          : "Unknown User",
        receiverName: receiver
          ? `${receiver.firstName} ${receiver.lastName}`
          : "Unknown User",
        courseName: course?.title,
        isFromAdmin: sender?.role === "admin",
        isToAdmin: receiver?.role === "admin",
        priority,
        category,
      };
    });

    //*** MOCK DATA ***//
    const adminMessages: ExtendedMessage[] = [
      {
        id: "admin_1",
        senderId: "5",
        receiverId: "1",
        content:
          "Hi, I'm having trouble accessing my purchased course. Can you help?",
        sentAt: "2024-02-28T10:30:00Z",
        type: "text",
        senderName: "John Doe",
        receiverName: "Admin User",
        isFromAdmin: false,
        isToAdmin: true,
        priority: "high",
        category: "technical",
      },
      {
        id: "admin_2",
        senderId: "6",
        receiverId: "1",
        content:
          "I need a refund for the course I purchased yesterday. It's not what I expected.",
        sentAt: "2024-02-28T14:15:00Z",
        type: "text",
        senderName: "Alice Johnson",
        receiverName: "Admin User",
        isFromAdmin: false,
        isToAdmin: true,
        priority: "medium",
        category: "billing",
      },
      {
        id: "admin_3",
        senderId: "2",
        receiverId: "1",
        content:
          "Can you review the new course I submitted? It's been pending for a week.",
        sentAt: "2024-02-27T16:45:00Z",
        type: "text",
        senderName: "Dr. James Wilson",
        receiverName: "Admin User",
        isFromAdmin: false,
        isToAdmin: true,
        priority: "medium",
        category: "course",
      },
    ];

    const allMessages = [...extendedMessages, ...adminMessages];
    setMessages(allMessages);

    const totalMessages = allMessages.length;
    const unreadMessages = allMessages.filter(
      (m) => !m.readAt && m.isToAdmin
    ).length;
    const today = new Date().toDateString();
    const todayMessages = allMessages.filter(
      (m) => new Date(m.sentAt).toDateString() === today
    ).length;
    const pendingReplies = allMessages.filter(
      (m) => m.isToAdmin && !m.readAt
    ).length;

    setStats({
      totalMessages,
      unreadMessages,
      todayMessages,
      pendingReplies,
      averageResponseTime: "2.5 hours",
    });
  };

  const applyFilters = () => {
    let filtered = [...messages];

    // Filtro Búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (message) =>
          message.content.toLowerCase().includes(query) ||
          message.senderName.toLowerCase().includes(query) ||
          message.receiverName.toLowerCase().includes(query) ||
          (message.courseName &&
            message.courseName.toLowerCase().includes(query))
      );
    }

    // Filtro Estado
    if (statusFilter !== "all") {
      if (statusFilter === "unread") {
        filtered = filtered.filter((message) => !message.readAt);
      } else if (statusFilter === "read") {
        filtered = filtered.filter((message) => message.readAt);
      } else if (statusFilter === "to_admin") {
        filtered = filtered.filter((message) => message.isToAdmin);
      } else if (statusFilter === "from_admin") {
        filtered = filtered.filter((message) => message.isFromAdmin);
      }
    }

    // Filtro Categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (message) => message.category === categoryFilter
      );
    }

    // Filtro Prioridad
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (message) => message.priority === priorityFilter
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ExtendedMessage];
      let bValue: any = b[sortBy as keyof ExtendedMessage];

      if (sortBy === "sentAt") {
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

    setFilteredMessages(filtered);
  };

  const handleViewMessage = (message: ExtendedMessage) => {
    setSelectedMessage(message);
    setMessageDetailsOpen(true);

    // Marcar como leído si es para el administrador y no leído.
    if (message.isToAdmin && !message.readAt) {
      const updatedMessages = messages.map((m) =>
        m.id === message.id ? { ...m, readAt: new Date().toISOString() } : m
      );
      setMessages(updatedMessages);
    }
  };

  const handleReply = (message: ExtendedMessage) => {
    setSelectedMessage(message);
    setReplyContent("");
    setReplyDialogOpen(true);
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    setIsLoading(true);
    try {
      const newMessage: ExtendedMessage = {
        id: `reply_${Date.now()}`,
        senderId: "1", // Admin ID
        receiverId: selectedMessage.senderId,
        courseId: selectedMessage.courseId,
        content: replyContent,
        sentAt: new Date().toISOString(),
        type: "text",
        senderName: "Admin User",
        receiverName: selectedMessage.senderName,
        isFromAdmin: true,
        isToAdmin: false,
        priority: "medium",
        category: selectedMessage.category,
      };

      setMessages([newMessage, ...messages]);
      setReplyDialogOpen(false);
      setReplyContent("");
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendBroadcast = async () => {
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return;

    setIsLoading(true);
    try {
      interface UserType {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
      }

      let recipients: UserType[] = [];

      if (broadcastTarget === "all") {
        recipients = mockUsers.filter((u) => u.role !== "admin");
      } else if (broadcastTarget === "students") {
        recipients = mockUsers.filter((u) => u.role === "student");
      } else if (broadcastTarget === "teachers") {
        recipients = mockUsers.filter((u) => u.role === "teacher");
      }

      const broadcastMessages: ExtendedMessage[] = recipients.map(
        (recipient) => ({
          id: `broadcast_${Date.now()}_${recipient.id}`,
          senderId: "1", // Admin ID
          receiverId: recipient.id,
          content: `Subject: ${broadcastSubject}\n\n${broadcastMessage}`,
          sentAt: new Date().toISOString(),
          type: "text",
          senderName: "Admin User",
          receiverName: `${recipient.firstName} ${recipient.lastName}`,
          isFromAdmin: true,
          isToAdmin: false,
          priority: "medium",
          category: "general",
        })
      );

      setMessages([...broadcastMessages, ...messages]);
      setBroadcastDialogOpen(false);
      setBroadcastSubject("");
      setBroadcastMessage("");
      setBroadcastTarget("all");
    } catch (error) {
      console.error("Error sending broadcast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "From",
      "To",
      "Subject",
      "Category",
      "Priority",
      "Status",
    ];
    const csvData = filteredMessages.map((message) => [
      new Date(message.sentAt).toLocaleDateString(),
      message.senderName,
      message.receiverName,
      message.content.substring(0, 50) + "...",
      message.category,
      message.priority,
      message.readAt ? "Read" : "Unread",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMessagePriorityEspanol = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "Normal";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return <AlertCircle className="h-4 w-4" />;
      case "billing":
        return <MessageSquare className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getMessageCategoryEspanol = (category: string) => {
    switch (category) {
      case "technical":
        return "Técnico";
      case "billing":
        return "Facturación";
      case "course":
        return "Curso";
      default:
        return "General";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestionar Mensajes</h1>
            <p className="text-gray-600">Supervisar y responder mensajes.</p>
          </div>
          <Button onClick={() => setBroadcastDialogOpen(true)}>
            <Send className="h-4 w-4 mr-2" />
            Enviar difusión
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Mensajes
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.todayMessages} hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mensajes sin leer
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.unreadMessages}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendientes de revisión
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sin responder
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingReplies}
              </div>
              <p className="text-xs text-muted-foreground">
                Esperando respuesta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tiempo promedio de respuesta
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.averageResponseTime}
              </div>
              <p className="text-xs text-muted-foreground">Últimos 30 días</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros/Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Buscar Mensajes</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar mensajes, usuarios o cursos..."
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
                    <SelectItem value="unread">Sin leer</SelectItem>
                    <SelectItem value="read">Leídos</SelectItem>
                    <SelectItem value="to_admin">Para Admin</SelectItem>
                    <SelectItem value="from_admin">De Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                    <SelectItem value="billing">Facturación</SelectItem>
                    <SelectItem value="course">Curso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
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

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los mensajes</CardTitle>
            <CardDescription>
              Mostrando {filteredMessages.length} de {messages.length} mensajes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "senderName") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("senderName");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        De
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>A</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "sentAt") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("sentAt");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Fecha
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        No se encontraron mensajes según los filtros de
                        búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((message) => (
                      <TableRow
                        key={message.id}
                        className={
                          !message.readAt && message.isToAdmin
                            ? "bg-blue-50"
                            : ""
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {!message.readAt && message.isToAdmin ? (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            ) : (
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            )}
                            {message.readAt ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {message.senderName}
                              </div>
                              {message.isFromAdmin && (
                                <Badge variant="outline" className="text-xs">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {message.receiverName}
                              </div>
                              {message.isToAdmin && (
                                <Badge variant="outline" className="text-xs">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-[300px] truncate"
                            title={message.content}
                          >
                            {message.content}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 w-fit"
                          >
                            {getCategoryIcon(message.category)}
                            {getMessageCategoryEspanol(message.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              message.priority
                            )}`}
                          >
                            {getMessagePriorityEspanol(message.priority)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {message.courseName ? (
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <span
                                className="text-sm truncate max-w-[150px]"
                                title={message.courseName}
                              >
                                {message.courseName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm">
                                {new Date(message.sentAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(message.sentAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReply(message)}
                            >
                              <Reply className="h-4 w-4" />
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

      {/* DETALLE MENSAJE */}
      <Dialog open={messageDetailsOpen} onOpenChange={setMessageDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del mensaje</DialogTitle>
            <DialogDescription>
              Información completa del mensaje
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    De
                  </Label>
                  <p className="font-medium">{selectedMessage.senderName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">A</Label>
                  <p className="font-medium">{selectedMessage.receiverName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Categoría
                  </Label>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    {getCategoryIcon(selectedMessage.category)}
                    {getMessageCategoryEspanol(selectedMessage.category)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Prioridad
                  </Label>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      selectedMessage.priority
                    )}`}
                  >
                    {getMessagePriorityEspanol(selectedMessage.priority)}
                  </span>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Enviado
                  </Label>
                  <p>{new Date(selectedMessage.sentAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Estado
                  </Label>
                  <div className="flex items-center gap-2">
                    {selectedMessage.readAt ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Leer</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Marcar como no leído</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {selectedMessage.courseName && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Curso asociado
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span>{selectedMessage.courseName}</span>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Contenido del mensaje
                </Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>
              </div>

              {selectedMessage.readAt && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Leer en
                  </Label>
                  <p className="text-sm">
                    {new Date(selectedMessage.readAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMessageDetailsOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              onClick={() => {
                setMessageDetailsOpen(false);
                if (selectedMessage) handleReply(selectedMessage);
              }}
            >
              Responder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de respuesta */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Responder al Mensaje</DialogTitle>
            <DialogDescription>
              Enviar respuesta a {selectedMessage?.senderName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMessage && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-500">
                  Mensaje Original
                </Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="replyContent">Tu respuesta</Label>
              <Textarea
                id="replyContent"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply here..."
                rows={6}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={sendReply}
              disabled={isLoading || !replyContent.trim()}
            >
              {isLoading ? "Enviando..." : "Enviar Respuesta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Díalogo de Difusión */}
      <Dialog open={broadcastDialogOpen} onOpenChange={setBroadcastDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enviar mensaje de difusión</DialogTitle>
            <DialogDescription>
              Enviar un mensaje a varios usuarios a la vez
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="broadcastTarget">Enviar a</Label>
              <Select
                value={broadcastTarget}
                onValueChange={setBroadcastTarget}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los usuarios</SelectItem>
                  <SelectItem value="students">
                    Todos los estudiantes
                  </SelectItem>
                  <SelectItem value="teachers">Todos los profesores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="broadcastSubject">Asunto</Label>
              <Input
                id="broadcastSubject"
                value={broadcastSubject}
                onChange={(e) => setBroadcastSubject(e.target.value)}
                placeholder="Enter message subject..."
              />
            </div>
            <div>
              <Label htmlFor="broadcastMessage">Mensaje</Label>
              <Textarea
                id="broadcastMessage"
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="TEscribe aquí el mensaje de difusión..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBroadcastDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={sendBroadcast}
              disabled={
                isLoading ||
                !broadcastSubject.trim() ||
                !broadcastMessage.trim()
              }
            >
              {isLoading ? "Enviando..." : "Enviar mensaje de difusión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
