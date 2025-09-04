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
import { UserManagementDialog } from "@/components/user-management-dialog";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getCoursesByTeacher,
  getEnrollmentsByStudent,
  getUserStats,
  updateUser,
  type User,
} from "@/lib/mock-database";
import {
  ArrowUpDown,
  BookOpen,
  Calendar,
  Clock,
  Download,
  Edit,
  Eye,
  Filter,
  GraduationCap,
  Mail,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    suspendedUsers: 0,
    usersByRole: {
      admin: 0,
      teacher: 0,
      student: 0,
    },
    newUsersThisMonth: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, roleFilter, statusFilter, sortBy, sortOrder]);

  const loadData = () => {
    const allUsers = getAllUsers();
    const userStats = getUserStats();

    setUsers(allUsers);
    setStats(userStats);
  };

  //*** FILTROS ***//

  const applyFilters = () => {
    let filtered = [...users];

    // Filtro búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
    }

    // Filtro rol
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filtro estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof User];
      let bValue: any = b[sortBy as keyof User];

      if (sortBy === "joinDate") {
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

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogMode("add");
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogMode("edit");
    setUserDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    setIsLoading(true);
    try {
      if (dialogMode === "add") {
        await createUser(userData);
      } else if (selectedUser) {
        await updateUser(selectedUser.id, userData);
      }
      loadData();
      setUserDialogOpen(false);
    } catch (error) {
      throw error; // Que se haga cargo el Dialog
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      setIsLoading(true);
      try {
        await deleteUser(userToDelete.id);
        loadData();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Nombre",
      "Email",
      "Rol",
      "Estado",
      "Se unió",
      "Asignaturas",
    ];
    const csvData = filteredUsers.map((user) => [
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.role,
      user.status,
      new Date(user.joinDate).toLocaleDateString(),
      user.subjects?.join("; ") || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "suspended":
        return <UserX className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-purple-600" />;
      case "teacher":
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      case "student":
        return <BookOpen className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getRolEspanol = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "teacher":
        return "Profesor";
      case "student":
        return "Estudiante";
      default:
        return role;
    }
  };

  const getStatusEspanol = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "pending":
        return "Pendiente";
      case "suspended":
        return "Bloqueado";
      default:
        return status;
    }
  };

  const getUserActivity = (user: User) => {
    if (user.role === "student") {
      const enrollments = getEnrollmentsByStudent(user.id);
      return {
        type: "enrollments",
        count: enrollments.length,
        label: "cursos matriculados",
      };
    } else if (user.role === "teacher") {
      const courses = getCoursesByTeacher(user.id);
      return {
        type: "courses",
        count: courses.length,
        label: "cursos creados",
      };
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestionar Usuarios</h1>
          <p className="text-gray-600">
            Gestionar usuarios y sus permisos.
          </p>
        </div>

        {/* NuemeroSS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Usuarios
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersThisMonth} este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Activos
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% del
                total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profesores</CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.usersByRole.teacher}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.usersByRole.student} estudiantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendientes de revisión
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.suspendedUsers} bloqueados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros, Búsqueda y cómo e' */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Buscar Usuarios</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre, email, o rol..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="admin">Administrados</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="student">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="suspended">Bloqueados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handleAddUser} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Usuarios
                </Button>
                <Button onClick={exportToCSV} variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Todos</CardTitle>
            <CardDescription>
              Mostrando {filteredUsers.length} de {users.length} usuarios
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
                        if (sortBy === "firstName") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("firstName");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Nombre
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "email") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("email");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Email
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "role") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("role");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Rol
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "joinDate") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("joinDate");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Se unió
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No se han encontrado usuarios que coincidan con los
                        filtros de búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const activity = getUserActivity(user);

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {user.firstName[0]}
                                  {user.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {user.firstName} {user.lastName}
                                </div>
                                {user.subjects && user.subjects.length > 0 && (
                                  <div className="text-sm text-gray-500">
                                    {user.subjects.slice(0, 2).join(", ")}
                                    {user.subjects.length > 2 &&
                                      ` +${user.subjects.length - 2} more`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 w-fit"
                            >
                              {getRoleIcon(user.role)}
                              {getRolEspanol(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusColor(user.status) as any}
                              className="flex items-center gap-1 w-fit"
                            >
                              {getStatusIcon(user.status)}
                              {getStatusEspanol(user.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {activity && (
                              <div className="text-sm">
                                <span className="font-medium">
                                  {activity.count}
                                </span>
                                <span className="text-gray-500 ml-1">
                                  {activity.label}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {new Date(user.joinDate).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manejo de Usuarios */}
      <UserManagementDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        user={selectedUser}
        mode={dialogMode}
        onSave={handleSaveUser}
      />

      {/* La DATA del Usuario */}
      {selectedUser && (
        <AlertDialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalles del usuario</AlertDialogTitle>
              <AlertDialogDescription>
                Información completa de {selectedUser.firstName}{" "}
                {selectedUser.lastName}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Nombre completo
                  </Label>
                  <p className="font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Rol
                  </Label>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    {getRoleIcon(selectedUser.role)}
                    {getRolEspanol(selectedUser.role)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Estado
                  </Label>
                  <Badge
                    variant={getStatusColor(selectedUser.status) as any}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(selectedUser.status)}
                    {getStatusEspanol(selectedUser.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Se unió
                  </Label>
                  <p>{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    User ID
                  </Label>
                  <p className="font-mono text-sm">{selectedUser.id}</p>
                </div>
              </div>

              {selectedUser.subjects && selectedUser.subjects.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Asignaturas
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedUser.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.bio && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Bio
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedUser.bio}
                  </p>
                </div>
              )}

              {(() => {
                const activity = getUserActivity(selectedUser);
                if (activity) {
                  return (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Actividad
                      </Label>
                      <p className="text-sm">
                        <span className="font-medium">{activity.count}</span>{" "}
                        {activity.label}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setUserDetailsOpen(false);
                  handleEditUser(selectedUser);
                }}
              >
                Editar Usuario
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Dialog de confirmación de boshado */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la cuenta de{" "}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>{" "}
              y eliminará todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar Usuario"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
