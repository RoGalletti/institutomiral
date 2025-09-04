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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import {
  getAllPayments,
  getPaymentStats,
  getRevenueAnalytics,
  processRefund,
  updatePaymentStatus,
  searchPayments,
  getUserById,
  getCourseById,
  type Payment,
} from "@/lib/mock-database";

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    refundedPayments: 0,
    totalRevenue: 0,
    totalRefunded: 0,
    netRevenue: 0,
    monthlyRevenue: 0,
    paymentMethodStats: {} as Record<string, { count: number; amount: number }>,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Payment["status"]>("completed");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    payments,
    searchQuery,
    statusFilter,
    paymentMethodFilter,
    dateFilter,
    sortBy,
    sortOrder,
  ]);

  const loadData = () => {
    const allPayments = getAllPayments();
    const paymentStats = getPaymentStats();

    setPayments(allPayments);
    setStats(paymentStats);
  };

  const applyFilters = () => {
    let filtered = [...payments];

    // Search filter
    if (searchQuery) {
      filtered = searchPayments(searchQuery);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Payment method filter
    if (paymentMethodFilter !== "all") {
      filtered = filtered.filter(
        (payment) => payment.paymentMethod === paymentMethodFilter
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      if (dateFilter !== "all") {
        filtered = filtered.filter(
          (payment) => new Date(payment.createdAt) >= filterDate
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Payment];
      let bValue: any = b[sortBy as keyof Payment];

      if (sortBy === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPayments(filtered);
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentDetailsOpen(true);
  };

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundAmount(payment.amount.toString());
    setRefundReason("");
    setRefundDialogOpen(true);
  };

  const handleStatusUpdate = (payment: Payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setStatusUpdateDialogOpen(true);
  };

  const processRefundAction = async () => {
    if (!selectedPayment) return;

    setIsLoading(true);
    try {
      await processRefund(
        selectedPayment.id,
        Number(refundAmount),
        refundReason
      );
      loadData();
      setRefundDialogOpen(false);
      setRefundAmount("");
      setRefundReason("");
    } catch (error) {
      console.error("Error processing refund:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusAction = async () => {
    if (!selectedPayment) return;

    setIsLoading(true);
    try {
      await updatePaymentStatus(selectedPayment.id, newStatus);
      loadData();
      setStatusUpdateDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Payment ID",
      "Student",
      "Course",
      "Amount",
      "Status",
      "Payment Method",
      "Date",
      "Transaction ID",
    ];
    const csvData = filteredPayments.map((payment) => {
      const student = getUserById(payment.studentId);
      const course = getCourseById(payment.courseId);
      return [
        payment.id,
        student ? `${student.firstName} ${student.lastName}` : "Unknown",
        course?.title || "Unknown",
        `$${payment.amount}`,
        payment.status,
        payment.paymentMethod,
        new Date(payment.createdAt).toLocaleDateString(),
        payment.transactionId,
      ];
    });

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "refunded":
      case "partially_refunded":
        return <RotateCcw className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
      case "partially_refunded":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusEspanol = (status: string) => {
    switch (status) {
      case "completed":
        return "Exitoso";
      case "pending":
        return "Pendiente";
      case "failed":
        return "Fallido";
      case "refunded":
        return "Reembolsado";
      case "partially_refunded":
        return "Parcialmente reembolsado";
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestionar Transacciones</h1>
          <p className="text-gray-600">Supervisar y gestionar transacciones.</p>
        </div>

        {/* Numerinhos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                ${stats.monthlyRevenue.toLocaleString()} este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos netos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.netRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Después de los reembolsos: $
                {stats.totalRefunded.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transacciones
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedPayments} exitosos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de éxito
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalPayments > 0
                  ? Math.round(
                      (stats.completedPayments / stats.totalPayments) * 100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.failedPayments} pagos fallidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
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
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar transacciones..."
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
                    <SelectItem value="completed">Exitosos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="failed">Fallidos</SelectItem>
                    <SelectItem value="refunded">Reembolsados</SelectItem>
                    <SelectItem value="partially_refunded">
                      Parcialmente reembolsados
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="method">Método de Pago</Label>
                <Select
                  value={paymentMethodFilter}
                  onValueChange={setPaymentMethodFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Credit Card">
                      Tarjeta de Crédito
                    </SelectItem>
                    <SelectItem value="MercadoPago">MercadoPago</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Período</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Desde siempre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Desde siempre</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Semana pasada</SelectItem>
                    <SelectItem value="month">Mes pasado</SelectItem>
                    <SelectItem value="quarter">Semestre pasado</SelectItem>
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
            <CardTitle>Transacciones</CardTitle>
            <CardDescription>
              Mostrando {filteredPayments.length} de {payments.length}{" "}
              transacciones
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
                        if (sortBy === "id") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("id");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Payment ID
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "amount") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("amount");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Monto
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "createdAt") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("createdAt");
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
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No se encontraron transacciones según los filtros
                        aplicados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => {
                      const student = getUserById(payment.studentId);
                      const course = getCourseById(payment.courseId);

                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">
                            {payment.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {student
                                  ? `${student.firstName} ${student.lastName}`
                                  : "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student?.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className="max-w-[200px] truncate"
                              title={course?.title}
                            >
                              {course?.title || "Unknown Course"}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${payment.amount}
                            {payment.refundAmount && (
                              <div className="text-sm text-red-600">
                                -${payment.refundAmount} reembolsado
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusColor(payment.status)}
                              className="flex items-center gap-1 w-fit"
                            >
                              {getStatusIcon(payment.status)}
                              {getPaymentStatusEspanol(
                                payment.status.replace("_", " ")
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell>
                            <div>
                              <div>
                                {new Date(
                                  payment.createdAt
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  payment.createdAt
                                ).toLocaleTimeString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(payment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {payment.status === "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRefund(payment)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                              {payment.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(payment)}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
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

      {/* PDETALLES */}
      <Dialog open={paymentDetailsOpen} onOpenChange={setPaymentDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Transacción</DialogTitle>
            <DialogDescription>
              Información completa de: {selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Payment ID
                  </Label>
                  <p className="font-mono">{selectedPayment.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Transaction ID
                  </Label>
                  <p className="font-mono">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Estudiante
                  </Label>
                  <p>
                    {getUserById(selectedPayment.studentId)?.firstName}{" "}
                    {getUserById(selectedPayment.studentId)?.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Curso
                  </Label>
                  <p>{getCourseById(selectedPayment.courseId)?.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Monto
                  </Label>
                  <p className="text-lg font-semibold">
                    ${selectedPayment.amount}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Estado
                  </Label>
                  <Badge
                    variant={getStatusColor(selectedPayment.status)}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(selectedPayment.status)}
                    {getPaymentStatusEspanol(
                      selectedPayment.status.replace("_", " ")
                    )}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Método de Pago
                  </Label>
                  <p>{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Moneda
                  </Label>
                  <p>{selectedPayment.currency}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Creado
                  </Label>
                  <p>{new Date(selectedPayment.createdAt).toLocaleString()}</p>
                </div>
                {selectedPayment.completedAt && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Completado
                    </Label>
                    <p>
                      {new Date(selectedPayment.completedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* ¿Se muestran impuestos o tarifas extra o como es la coisa??  */}
              {selectedPayment.processingFee && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-gray-500">
                    Desglose de tarifas
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tarifa de tramitación:</span>
                      <span>${selectedPayment.processingFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarifa de acceso:</span>
                      <span>${selectedPayment.gatewayFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarifa de la plataforma:</span>
                      <span>${selectedPayment.platformFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Importe neto:</span>
                      <span>${selectedPayment.netAmount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Información sobre reembolso */}
              {selectedPayment.refundAmount && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-gray-500">
                    Información sobre reembolso
                  </Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Importe del reembolso:</span>
                      <span className="text-red-600 font-semibold">
                        ${selectedPayment.refundAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fecha reembolso:</span>
                      <span>
                        {selectedPayment.refundedAt
                          ? new Date(
                              selectedPayment.refundedAt
                            ).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    {selectedPayment.refundReason && (
                      <div>
                        <span className="text-sm font-medium">Motivo:</span>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedPayment.refundReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Reembolso */}
      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Procesar Reembolso</AlertDialogTitle>
            <AlertDialogDescription>
              Procesar un reembolso por el pago {selectedPayment?.id}. Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="refundAmount">Importe del reembolso</Label>
              <Input
                id="refundAmount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                max={selectedPayment?.amount}
                step="0.01"
              />
              <p className="text-sm text-gray-500 mt-1">
                Máximo: ${selectedPayment?.amount}
              </p>
            </div>
            <div>
              <Label htmlFor="refundReason">Motivo del reembolso</Label>
              <Textarea
                id="refundReason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Ingrese el motivo del reembolso..."
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={processRefundAction}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading || !refundAmount || !refundReason}
            >
              {isLoading ? "Procesando..." : "Procesar Reembolso"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialgo para el Status Update */}
      <AlertDialog
        open={statusUpdateDialogOpen}
        onOpenChange={setStatusUpdateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Actualizar estado del pago</AlertDialogTitle>
            <AlertDialogDescription>
              Actualizar el estado del pago {selectedPayment?.id}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newStatus">Nuevo estado</Label>
              <Select
                value={newStatus}
                onValueChange={(value) =>
                  setNewStatus(value as Payment["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Exitoso</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={updateStatusAction}
              disabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Actualizar Estado"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
