"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Unimate Design System</h1>
          <p className="text-muted-foreground text-lg">
            A comprehensive dark-themed design system using shadcn/ui components
          </p>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Dark theme colors matching the kiosk aesthetic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="w-full h-20 bg-background border rounded-lg"></div>
                <p className="text-sm font-medium">Background</p>
                <p className="text-xs text-muted-foreground">Pure Black</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-card border rounded-lg"></div>
                <p className="text-sm font-medium">Card</p>
                <p className="text-xs text-muted-foreground">Dark Gray</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-primary rounded-lg"></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">Blue Accent</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-muted rounded-lg"></div>
                <p className="text-sm font-medium">Muted</p>
                <p className="text-xs text-muted-foreground">Medium Gray</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components Showcase */}
        <Tabs defaultValue="buttons" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="data">Data Display</TabsTrigger>
          </TabsList>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Different button styles and states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">⚙️</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Event Card</CardTitle>
                  <CardDescription>Computer Science Lecture</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="default">CS101</Badge>
                    <p className="text-sm">9:00 AM - 10:30 AM</p>
                    <p className="text-sm text-muted-foreground">Room: Building A - 101</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Details</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exam Schedule</CardTitle>
                  <CardDescription>Mathematics Final Exam</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="destructive">EXAM</Badge>
                    <p className="text-sm">2:00 PM - 4:00 PM</p>
                    <p className="text-sm text-muted-foreground">Room: Building B - 205</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full">Navigate</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Group</CardTitle>
                  <CardDescription>Physics Study Session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary">STUDY</Badge>
                    <p className="text-sm">7:00 PM - 9:00 PM</p>
                    <p className="text-sm text-muted-foreground">Library - Room 3</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">Join</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>Input fields and form elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student ID</label>
                    <Input placeholder="Enter your student ID" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" placeholder="Enter password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Courses</label>
                  <Input placeholder="Search for courses, rooms, or events..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Display Tab */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Display Components</CardTitle>
                <CardDescription>Avatars, badges, and scrollable content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Avatars</h4>
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/40?img=1" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/40?img=2" />
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>CD</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <Separator />

                {/* Badge Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Active</Badge>
                    <Badge variant="secondary">Scheduled</Badge>
                    <Badge variant="destructive">Cancelled</Badge>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                </div>

                <Separator />

                {/* Scroll Area Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Scrollable Content</h4>
                  <ScrollArea className="h-32 w-full rounded-md border p-4">
                    <div className="space-y-2">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="text-sm">
                          Scrollable item {i + 1} - This is a long text that demonstrates scrolling behavior
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Kiosk Mode Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Kiosk Mode Preview</CardTitle>
            <CardDescription>Full-screen kiosk interface preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Unimate Campus Kiosk</h2>
                <Badge variant="outline">RFID Ready</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="default" className="h-20 text-lg">
                  View My Timetable
                </Button>
                <Button variant="secondary" className="h-20 text-lg">
                  Campus Navigation
                </Button>
                <Button variant="outline" className="h-20 text-lg">
                  Emergency Info
                </Button>
              </div>
              <div className="text-center text-muted-foreground">
                <p>Tap your RFID card or use the buttons above</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
