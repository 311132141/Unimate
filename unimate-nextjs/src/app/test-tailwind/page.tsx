import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TailwindTestPage() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="container-responsive">
                <h1 className="text-4xl font-bold text-foreground mb-8">
                    Tailwind CSS Configuration Test
                </h1>

                {/* Theme Colors Test */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Primary Colors</CardTitle>
                            <CardDescription>Testing primary color scheme</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-primary text-primary-foreground p-4 rounded-md">
                                Primary Background
                            </div>
                            <Button variant="default">Primary Button</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>University Colors</CardTitle>
                            <CardDescription>
                                Testing custom university colors
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-university-600 text-white p-4 rounded-md">
                                University Primary
                            </div>
                            <div className="bg-university-100 text-university-900 p-4 rounded-md">
                                University Light
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Campus Colors</CardTitle>
                            <CardDescription>Testing custom campus colors</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-campus-600 text-white p-4 rounded-md">
                                Campus Primary
                            </div>
                            <div className="bg-campus-100 text-campus-900 p-4 rounded-md">
                                Campus Light
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Animations Test */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Animations Test</CardTitle>
                        <CardDescription>Testing custom animations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="animate-float bg-primary text-primary-foreground p-4 rounded-md">
                                Float Animation
                            </div>
                            <div className="animate-fadeIn bg-secondary text-secondary-foreground p-4 rounded-md">
                                Fade In Animation
                            </div>
                            <div className="animate-slideIn bg-accent text-accent-foreground p-4 rounded-md">
                                Slide In Animation
                            </div>
                            <div className="pulse-border bg-muted text-muted-foreground p-4 rounded-md">
                                Pulse Border
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dark Mode Test */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dark Mode Colors</CardTitle>
                        <CardDescription>Testing dark theme colors</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-dark-background text-white p-4 rounded-md">
                            Dark Background
                        </div>
                        <div className="bg-dark-secondary text-white p-4 rounded-md">
                            Dark Secondary
                        </div>
                        <div className="bg-dark-tertiary text-white p-4 rounded-md">
                            Dark Tertiary
                        </div>
                    </CardContent>
                </Card>

                {/* Event Colors Test */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Event Colors</CardTitle>
                        <CardDescription>Testing event-specific colors</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-event-class text-white p-4 rounded-md">
                                Class Event
                            </div>
                            <div className="bg-event-exam text-white p-4 rounded-md">
                                Exam Event
                            </div>
                            <div className="bg-event-urgent text-white p-4 rounded-md">
                                Urgent Event
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
