"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Settings, Save, RefreshCw, Shield, Mail, Bell, Database, Palette, Globe, Lock, Users, CreditCard, FileText, AlertTriangle, CheckCircle, Upload, Download } from 'lucide-react'
import { AdminLayout } from "@/components/admin-layout"

interface PlatformSettings {
  general: {
    platformName: string
    platformDescription: string
    supportEmail: string
    contactPhone: string
    timezone: string
    language: string
    currency: string
    maintenanceMode: boolean
  }
  security: {
    requireEmailVerification: boolean
    enableTwoFactor: boolean
    passwordMinLength: number
    sessionTimeout: number
    maxLoginAttempts: number
    enableCaptcha: boolean
  }
  email: {
    smtpHost: string
    smtpPort: string
    smtpUsername: string
    smtpPassword: string
    fromEmail: string
    fromName: string
    enableEmailNotifications: boolean
  }
  notifications: {
    enablePushNotifications: boolean
    enableEmailDigest: boolean
    enableSmsNotifications: boolean
    notifyOnNewUser: boolean
    notifyOnNewCourse: boolean
    notifyOnPayment: boolean
  }
  payments: {
    enablePayments: boolean
    stripePublicKey: string
    stripeSecretKey: string
    paypalClientId: string
    paypalClientSecret: string
    currency: string
    taxRate: number
    processingFee: number
  }
  content: {
    maxFileSize: number
    allowedFileTypes: string[]
    enableVideoStreaming: boolean
    enableDownloads: boolean
    watermarkEnabled: boolean
    contentModeration: boolean
  }
  appearance: {
    primaryColor: string
    secondaryColor: string
    logoUrl: string
    faviconUrl: string
    customCss: string
    enableDarkMode: boolean
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({
    general: {
      platformName: "Instituto Miral",
      platformDescription: "A comprehensive educational platform for online learning",
      supportEmail: "support@institutomiralargentina.com",
      contactPhone: "+1 (555) 123-4567",
      timezone: "UTC",
      language: "es",
      currency: "ARS",
      maintenanceMode: false,
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      passwordMinLength: 8,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableCaptcha: true,
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: "587",
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "noreply@institutomiralargentina.com",
      fromName: "Instituto Miral",
      enableEmailNotifications: true,
    },
    notifications: {
      enablePushNotifications: true,
      enableEmailDigest: true,
      enableSmsNotifications: false,
      notifyOnNewUser: true,
      notifyOnNewCourse: true,
      notifyOnPayment: true,
    },
    payments: {
      enablePayments: true,
      stripePublicKey: "",
      stripeSecretKey: "",
      paypalClientId: "",
      paypalClientSecret: "",
      currency: "USD",
      taxRate: 8.5,
      processingFee: 2.9,
    },
    content: {
      maxFileSize: 100,
      allowedFileTypes: ["pdf", "doc", "docx", "ppt", "pptx", "mp4", "mp3", "jpg", "png"],
      enableVideoStreaming: true,
      enableDownloads: true,
      watermarkEnabled: false,
      contentModeration: true,
    },
    appearance: {
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      logoUrl: "",
      faviconUrl: "",
      customCss: "",
      enableDarkMode: true,
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [backupDialogOpen, setBackupDialogOpen] = useState(false)

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem("platformSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSettings = (section: keyof PlatformSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would save to the database
      localStorage.setItem("platformSettings", JSON.stringify(settings))
      setHasChanges(false)
      
      // Show success message
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error saving settings:", error)
      setIsLoading(false)
    }
  }

  const resetSettings = () => {
    setResetDialogOpen(true)
  }

  const confirmReset = () => {
    // Reset to default settings
    localStorage.removeItem("platformSettings")
    window.location.reload()
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `platform-settings-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
          setHasChanges(true)
        } catch (error) {
          console.error("Error importing settings:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Platform Settings</h1>
            <p className="text-gray-600">Configure your educational platform</p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" onClick={exportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('import-settings')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <input
              id="import-settings"
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
            <Button variant="outline" onClick={resetSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={saveSettings} disabled={isLoading || !hasChanges}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.general.platformName}
                      onChange={(e) => updateSettings('general', 'platformName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => updateSettings('general', 'supportEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={settings.general.contactPhone}
                      onChange={(e) => updateSettings('general', 'contactPhone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={settings.general.timezone} 
                      onValueChange={(value) => updateSettings('general', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Default Language</Label>
                    <Select 
                      value={settings.general.language} 
                      onValueChange={(value) => updateSettings('general', 'language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select 
                      value={settings.general.currency} 
                      onValueChange={(value) => updateSettings('general', 'currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="platformDescription">Platform Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={settings.general.platformDescription}
                    onChange={(e) => updateSettings('general', 'platformDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSettings('general', 'maintenanceMode', checked)}
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Enable to show maintenance page to users</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure platform security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireEmailVerification"
                      checked={settings.security.requireEmailVerification}
                      onCheckedChange={(checked) => updateSettings('security', 'requireEmailVerification', checked)}
                    />
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableTwoFactor"
                      checked={settings.security.enableTwoFactor}
                      onCheckedChange={(checked) => updateSettings('security', 'enableTwoFactor', checked)}
                    />
                    <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableCaptcha"
                      checked={settings.security.enableCaptcha}
                      onCheckedChange={(checked) => updateSettings('security', 'enableCaptcha', checked)}
                    />
                    <Label htmlFor="enableCaptcha">Enable CAPTCHA</Label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      min="6"
                      max="20"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="1"
                      max="168"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure SMTP settings for email delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="enableEmailNotifications"
                    checked={settings.email.enableEmailNotifications}
                    onCheckedChange={(checked) => updateSettings('email', 'enableEmailNotifications', checked)}
                  />
                  <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSettings('email', 'smtpPort', e.target.value)}
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.email.smtpUsername}
                      onChange={(e) => updateSettings('email', 'smtpUsername', e.target.value)}
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                      placeholder="noreply@institutomiralargentina.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={settings.email.fromName}
                      onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                      placeholder="Instituto Miral"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Test Email Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enablePushNotifications"
                      checked={settings.notifications.enablePushNotifications}
                      onCheckedChange={(checked) => updateSettings('notifications', 'enablePushNotifications', checked)}
                    />
                    <Label htmlFor="enablePushNotifications">Enable Push Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableEmailDigest"
                      checked={settings.notifications.enableEmailDigest}
                      onCheckedChange={(checked) => updateSettings('notifications', 'enableEmailDigest', checked)}
                    />
                    <Label htmlFor="enableEmailDigest">Enable Email Digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableSmsNotifications"
                      checked={settings.notifications.enableSmsNotifications}
                      onCheckedChange={(checked) => updateSettings('notifications', 'enableSmsNotifications', checked)}
                    />
                    <Label htmlFor="enableSmsNotifications">Enable SMS Notifications</Label>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Admin Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifyOnNewUser"
                        checked={settings.notifications.notifyOnNewUser}
                        onCheckedChange={(checked) => updateSettings('notifications', 'notifyOnNewUser', checked)}
                      />
                      <Label htmlFor="notifyOnNewUser">Notify on new user registration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifyOnNewCourse"
                        checked={settings.notifications.notifyOnNewCourse}
                        onCheckedChange={(checked) => updateSettings('notifications', 'notifyOnNewCourse', checked)}
                      />
                      <Label htmlFor="notifyOnNewCourse">Notify on new course submission</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifyOnPayment"
                        checked={settings.notifications.notifyOnPayment}
                        onCheckedChange={(checked) => updateSettings('notifications', 'notifyOnPayment', checked)}
                      />
                      <Label htmlFor="notifyOnPayment">Notify on payment transactions</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Settings */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment gateways and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="enablePayments"
                    checked={settings.payments.enablePayments}
                    onCheckedChange={(checked) => updateSettings('payments', 'enablePayments', checked)}
                  />
                  <Label htmlFor="enablePayments">Enable Payments</Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Payment Currency</Label>
                    <Select 
                      value={settings.payments.currency} 
                      onValueChange={(value) => updateSettings('payments', 'currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="50"
                      value={settings.payments.taxRate}
                      onChange={(e) => updateSettings('payments', 'taxRate', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Stripe Configuration</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                      <Input
                        id="stripePublicKey"
                        value={settings.payments.stripePublicKey}
                        onChange={(e) => updateSettings('payments', 'stripePublicKey', e.target.value)}
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                      <Input
                        id="stripeSecretKey"
                        type="password"
                        value={settings.payments.stripeSecretKey}
                        onChange={(e) => updateSettings('payments', 'stripeSecretKey', e.target.value)}
                        placeholder="sk_test_..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">PayPal Configuration</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                      <Input
                        id="paypalClientId"
                        value={settings.payments.paypalClientId}
                        onChange={(e) => updateSettings('payments', 'paypalClientId', e.target.value)}
                        placeholder="AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paypalClientSecret">PayPal Client Secret</Label>
                      <Input
                        id="paypalClientSecret"
                        type="password"
                        value={settings.payments.paypalClientSecret}
                        onChange={(e) => updateSettings('payments', 'paypalClientSecret', e.target.value)}
                        placeholder="EGnHDxD_qRPdaLdZz8iCr8N7_MzF-YHPTkjs6NKYQvQSBngp4PTTVWkPZRbL"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="processingFee">Processing Fee (%)</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={settings.payments.processingFee}
                    onChange={(e) => updateSettings('payments', 'processingFee', parseFloat(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">Platform processing fee percentage</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>Configure content upload and management options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      min="1"
                      max="1000"
                      value={settings.content.maxFileSize}
                      onChange={(e) => updateSettings('content', 'maxFileSize', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                    <Input
                      id="allowedFileTypes"
                      value={settings.content.allowedFileTypes.join(", ")}
                      onChange={(e) => updateSettings('content', 'allowedFileTypes', e.target.value.split(", "))}
                      placeholder="pdf, doc, mp4, jpg, png"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableVideoStreaming"
                      checked={settings.content.enableVideoStreaming}
                      onCheckedChange={(checked) => updateSettings('content', 'enableVideoStreaming', checked)}
                    />
                    <Label htmlFor="enableVideoStreaming">Enable Video Streaming</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableDownloads"
                      checked={settings.content.enableDownloads}
                      onCheckedChange={(checked) => updateSettings('content', 'enableDownloads', checked)}
                    />
                    <Label htmlFor="enableDownloads">Enable File Downloads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="watermarkEnabled"
                      checked={settings.content.watermarkEnabled}
                      onCheckedChange={(checked) => updateSettings('content', 'watermarkEnabled', checked)}
                    />
                    <Label htmlFor="watermarkEnabled">Enable Content Watermarking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="contentModeration"
                      checked={settings.content.contentModeration}
                      onCheckedChange={(checked) => updateSettings('content', 'contentModeration', checked)}
                    />
                    <Label htmlFor="contentModeration">Enable Content Moderation</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.appearance.primaryColor}
                        onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => updateSettings('appearance', 'secondaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => updateSettings('appearance', 'secondaryColor', e.target.value)}
                        placeholder="#64748b"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={settings.appearance.logoUrl}
                      onChange={(e) => updateSettings('appearance', 'logoUrl', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faviconUrl">Favicon URL</Label>
                    <Input
                      id="faviconUrl"
                      value={settings.appearance.faviconUrl}
                      onChange={(e) => updateSettings('appearance', 'faviconUrl', e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableDarkMode"
                    checked={settings.appearance.enableDarkMode}
                    onCheckedChange={(checked) => updateSettings('appearance', 'enableDarkMode', checked)}
                  />
                  <Label htmlFor="enableDarkMode">Enable Dark Mode Support</Label>
                </div>

                <div>
                  <Label htmlFor="customCss">Custom CSS</Label>
                  <Textarea
                    id="customCss"
                    value={settings.appearance.customCss}
                    onChange={(e) => updateSettings('appearance', 'customCss', e.target.value)}
                    rows={6}
                    placeholder="/* Add your custom CSS here */"
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Add custom CSS to override default styles
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Settings</AlertDialogTitle>
            <AlertDialogDescription>
              This action will reset all platform settings to their default values. This cannot be undone.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="bg-red-600 hover:bg-red-700"
            >
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
