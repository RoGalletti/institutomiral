"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Archive, ImageIcon, Video, Search, Filter, Calendar } from "lucide-react"
import { StudentLayout } from "@/components/student-layout"
import { getCurrentUser, getStudentCourses, getCourseMaterials, type CourseMaterial } from "@/lib/mock-database"

interface DownloadItem extends CourseMaterial {
  courseName: string
  downloadedAt: string
}

export default function DownloadsPage() {
  const [allMaterials, setAllMaterials] = useState<DownloadItem[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<DownloadItem[]>([])
  const [downloadHistory, setDownloadHistory] = useState<DownloadItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.role === "student") {
      const studentCourses = getStudentCourses(user.id)
      const paidCourses = studentCourses.filter((course) => course.enrollment.paymentStatus === "paid")

      const materials: DownloadItem[] = []
      paidCourses.forEach((course) => {
        const courseMaterials = getCourseMaterials(course.id)
        courseMaterials.forEach((material) => {
          materials.push({
            ...material,
            courseName: course.title,
            downloadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
        })
      })

      setAllMaterials(materials)
      setFilteredMaterials(materials)

      // Mock download history (recently downloaded items)
      const recentDownloads = materials
        .filter(() => Math.random() > 0.5) // Randomly select some as downloaded
        .slice(0, 8)
        .map((material) => ({
          ...material,
          downloadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        }))

      setDownloadHistory(recentDownloads)
    }
  }, [])

  useEffect(() => {
    let filtered = allMaterials.filter(
      (material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.courseName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterType !== "all") {
      filtered = filtered.filter((material) => material.type === filterType)
    }

    // Sort materials
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return Number.parseFloat(b.size) - Number.parseFloat(a.size)
        case "downloads":
          return b.downloadCount - a.downloadCount
        default:
          return 0
      }
    })

    setFilteredMaterials(filtered)
  }, [allMaterials, searchTerm, filterType, sortBy])

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "doc":
        return <FileText className="h-5 w-5 text-red-500" />
      case "zip":
        return <Archive className="h-5 w-5 text-yellow-500" />
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getFileTypeBadge = (type: string) => {
    const colors = {
      pdf: "bg-red-100 text-red-800",
      doc: "bg-blue-100 text-blue-800",
      zip: "bg-yellow-100 text-yellow-800",
      video: "bg-purple-100 text-purple-800",
      image: "bg-green-100 text-green-800",
    }
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{type.toUpperCase()}</Badge>
    )
  }

  const handleDownload = (material: DownloadItem) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading: ${material.name}`)

    // Update download history
    const updatedMaterial = { ...material, downloadedAt: new Date().toISOString() }
    setDownloadHistory((prev) => [updatedMaterial, ...prev.filter((item) => item.id !== material.id)].slice(0, 10))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatFileSize = (size: string) => {
    return size
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Downloads</h1>
          <p className="text-gray-600">Access and download your course materials</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Available Files</p>
                  <p className="text-2xl font-bold">{allMaterials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Documents</p>
                  <p className="text-2xl font-bold">
                    {allMaterials.filter((m) => m.type === "pdf" || m.type === "doc").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Archive className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Archives</p>
                  <p className="text-2xl font-bold">{allMaterials.filter((m) => m.type === "zip").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Recent Downloads</p>
                  <p className="text-2xl font-bold">{downloadHistory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-files" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all-files">All Files</TabsTrigger>
            <TabsTrigger value="recent">Recent Downloads</TabsTrigger>
          </TabsList>

          <TabsContent value="all-files" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="File type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">Documents</SelectItem>
                  <SelectItem value="zip">Archives</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                  <SelectItem value="downloads">Most Downloaded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Files List */}
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
                <CardDescription>Download materials from your enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredMaterials.length === 0 ? (
                  <div className="text-center py-8">
                    <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No files found</h3>
                    <p className="text-gray-600">
                      {searchTerm || filterType !== "all"
                        ? "Try adjusting your search or filters"
                        : "No downloadable materials available"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          {getFileIcon(material.type)}
                          <div className="flex-1">
                            <h4 className="font-medium">{material.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{material.courseName}</span>
                              <span>{formatFileSize(material.size)}</span>
                              <span>{material.downloadCount} downloads</span>
                              <span>Added {formatDate(material.uploadedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getFileTypeBadge(material.type)}
                          {material.isPremium && <Badge variant="secondary">Premium</Badge>}
                          <Button size="sm" onClick={() => handleDownload(material)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Downloads</CardTitle>
                <CardDescription>Files you've downloaded in the past week</CardDescription>
              </CardHeader>
              <CardContent>
                {downloadHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No recent downloads</h3>
                    <p className="text-gray-600">Files you download will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {downloadHistory.map((material) => (
                      <div
                        key={`${material.id}-${material.downloadedAt}`}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          {getFileIcon(material.type)}
                          <div>
                            <h4 className="font-medium">{material.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{material.courseName}</span>
                              <span>{formatFileSize(material.size)}</span>
                              <span>Downloaded {formatDate(material.downloadedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getFileTypeBadge(material.type)}
                          <Button size="sm" variant="outline" onClick={() => handleDownload(material)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  )
}
