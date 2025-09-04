"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Search } from "lucide-react"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Dr. Wilson",
      role: "Teacher",
      course: "Advanced Mathematics",
      lastMessage: "Great work on your last assignment!",
      time: "2 hours ago",
      unread: 2,
      avatar: "DW",
    },
    {
      id: 2,
      name: "Alice Johnson",
      role: "Student",
      course: "Physics Fundamentals",
      lastMessage: "Thank you for the explanation",
      time: "1 day ago",
      unread: 0,
      avatar: "AJ",
    },
    {
      id: 3,
      name: "Prof. Anderson",
      role: "Teacher",
      course: "Physics Fundamentals",
      lastMessage: "Don't forget about tomorrow's quiz",
      time: "2 days ago",
      unread: 1,
      avatar: "PA",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Dr. Wilson",
      content: "Hi! I've reviewed your latest assignment on quadratic equations. Excellent work overall!",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Thank you! I found the graphing section particularly challenging.",
      time: "10:45 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Dr. Wilson",
      content:
        "That's completely normal. Graphing quadratic functions requires practice. I've uploaded some additional practice problems to help you.",
      time: "11:00 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Dr. Wilson",
      content:
        "Great work on your last assignment! You've shown significant improvement in your problem-solving approach.",
      time: "2:15 PM",
      isOwn: false,
    },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600">Communicate with teachers and students</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation === conversation.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarFallback>{conversation.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{conversation.name}</h3>
                            {conversation.unread > 0 && (
                              <Badge variant="default" className="ml-2">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {conversation.role} • {conversation.course}
                          </p>
                          <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{conversation.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>DW</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Dr. Wilson</CardTitle>
                  <CardDescription>Advanced Mathematics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px]">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
          </Card>
        </div>
      </div>
    </div>
  )
}
