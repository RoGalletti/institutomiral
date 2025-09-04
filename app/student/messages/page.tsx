"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Search, MessageSquare, User } from "lucide-react"
import { StudentLayout } from "@/components/student-layout"
import {
  getCurrentUser,
  getStudentCourses,
  getUserById,
  getMessagesBetweenUsers,
  type Message,
  type User as UserType,
} from "@/lib/mock-database"

interface ConversationInfo {
  teacherId: string
  teacher: UserType
  courseName: string
  courseId: string
  lastMessage?: Message
  unreadCount: number
}

export default function StudentMessagesPage() {
  const [conversations, setConversations] = useState<ConversationInfo[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ConversationInfo | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.role === "student") {
      setCurrentUser(user)

      // Get all enrolled courses and their teachers
      const studentCourses = getStudentCourses(user.id)
      const paidCourses = studentCourses.filter((course) => course.enrollment.paymentStatus === "paid")

      const conversationList: ConversationInfo[] = []

      paidCourses.forEach((course) => {
        const teacher = getUserById(course.teacherId)
        if (teacher) {
          const courseMessages = getMessagesBetweenUsers(user.id, teacher.id, course.id)
          const lastMessage = courseMessages[courseMessages.length - 1]
          const unreadCount = courseMessages.filter((msg) => msg.senderId === teacher.id && !msg.readAt).length

          conversationList.push({
            teacherId: teacher.id,
            teacher,
            courseName: course.title,
            courseId: course.id,
            lastMessage,
            unreadCount,
          })
        }
      })

      setConversations(conversationList)

      // Select first conversation by default
      if (conversationList.length > 0) {
        setSelectedConversation(conversationList[0])
      }
    }
  }, [])

  useEffect(() => {
    if (selectedConversation && currentUser) {
      const conversationMessages = getMessagesBetweenUsers(
        currentUser.id,
        selectedConversation.teacherId,
        selectedConversation.courseId,
      )
      setMessages(conversationMessages)
    }
  }, [selectedConversation, currentUser])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation && currentUser) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId: selectedConversation.teacherId,
        courseId: selectedConversation.courseId,
        content: newMessage,
        sentAt: new Date().toISOString(),
        type: "text",
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")

      // Update last message in conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.courseId === selectedConversation.courseId ? { ...conv, lastMessage: message, unreadCount: 0 } : conv,
        ),
      )
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.courseName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600">Communicate with your teachers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center">
                    <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No conversations found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={`${conversation.teacherId}-${conversation.courseId}`}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedConversation?.courseId === conversation.courseId
                            ? "bg-blue-50 border-r-2 border-blue-500"
                            : ""
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(conversation.teacher.firstName, conversation.teacher.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate">
                                {conversation.teacher.firstName} {conversation.teacher.lastName}
                              </h3>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="default" className="ml-2">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{conversation.courseName}</p>
                            {conversation.lastMessage && (
                              <>
                                <p className="text-sm text-gray-500 truncate mt-1">
                                  {conversation.lastMessage.content}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatTime(conversation.lastMessage.sentAt)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(selectedConversation.teacher.firstName, selectedConversation.teacher.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {selectedConversation.teacher.firstName} {selectedConversation.teacher.lastName}
                      </CardTitle>
                      <CardDescription>{selectedConversation.courseName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-[500px]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 pr-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                          <p className="text-gray-600">Send a message to your teacher</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.senderId === currentUser?.id
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.senderId === currentUser?.id ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {formatTime(message.sentAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 min-h-[60px] resize-none"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} className="self-end">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a teacher to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </StudentLayout>
  )
}
