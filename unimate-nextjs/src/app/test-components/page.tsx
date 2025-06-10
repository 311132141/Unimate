'use client';

import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Modal,
    ModalTrigger,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalFooter,
    ModalClose,
    Input,
    Badge,
    LoadingSpinner,
    StatusMessage
} from '@/components/ui';
import { useState } from 'react';

export default function ComponentTestPage() {
    const [showStatus, setShowStatus] = useState(false);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold text-foreground mb-8">
                    Step 1: Core UI Components Test
                </h1>

                {/* Card Component Test */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Card Components</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card >
                            <CardHeader>
                                <CardTitle>Default Card</CardTitle>
                                <CardDescription>This is a default card variant</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Card content goes here.</p>
                            </CardContent>
                        </Card>

                        <Card >
                            <CardHeader>
                                <CardTitle>Bordered Card</CardTitle>
                                <CardDescription>This is a bordered card variant</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Card content with border.</p>
                            </CardContent>
                        </Card>

                        <Card >
                            <CardHeader>
                                <CardTitle>Elevated Card</CardTitle>
                                <CardDescription>This is an elevated card variant</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Card content with shadow.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Modal Component Test */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Modal Component</h2>
                    <Modal>
                        <ModalTrigger asChild>
                            <Button>Open Modal</Button>
                        </ModalTrigger>
                        <ModalContent>
                            <ModalHeader>
                                <ModalTitle>Test Modal</ModalTitle>
                                <ModalDescription>
                                    This is a test modal to verify the Modal component is working correctly.
                                </ModalDescription>
                            </ModalHeader>
                            <div className="py-4">
                                <p>Modal content goes here.</p>
                            </div>
                            <ModalFooter>
                                <ModalClose asChild>
                                    <Button >Cancel</Button>
                                </ModalClose>
                                <ModalClose asChild>
                                    <Button>Confirm</Button>
                                </ModalClose>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </section>

                {/* Input Component Test */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Input Component</h2>
                    <div className="max-w-md space-y-4">
                        <Input placeholder="Enter text here..." />
                        <Input type="email" placeholder="Enter email..." />
                        <Input type="password" placeholder="Enter password..." />
                        <Input disabled placeholder="Disabled input..." />
                    </div>
                </section>

                {/* Badge Component Test */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Badge Components</h2>
                    <div className="flex flex-wrap gap-2">
                        <Badge >Default</Badge>
                        <Badge >Secondary</Badge>
                        <Badge >Destructive</Badge>
                        <Badge >Outline</Badge>
                        <Badge >Class</Badge>
                        <Badge >Exam</Badge>
                        <Badge >Urgent</Badge>
                    </div>
                </section>

                {/* Loading Spinner Test */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Loading Spinner Components</h2>
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <LoadingSpinner size="sm" />
                            <p className="mt-2 text-sm">Small</p>
                        </div>
                        <div className="text-center">
                            <LoadingSpinner size="md" />
                            <p className="mt-2 text-sm">Medium</p>
                        </div>
                        <div className="text-center">
                            <LoadingSpinner size="lg" />
                            <p className="mt-2 text-sm">Large</p>
                        </div>
                    </div>
                </section>

                {/* Status Message Test */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Status Message Components</h2>
                    <div className="space-y-4 max-w-md">
                        <StatusMessage type="success" message="Success message example" />
                        <StatusMessage type="error" message="Error message example" />
                        <StatusMessage type="info" message="Info message example" />
                        <StatusMessage type="warning" message="Warning message example" />

                        <Button
                            onClick={() => setShowStatus(true)}
                            disabled={showStatus}
                        >
                            Show Auto-Dismiss Message
                        </Button>

                        {showStatus && (
                            <StatusMessage
                                type="info"
                                message="This message will auto-dismiss in 3 seconds"
                                onClose={() => setShowStatus(false)}
                            />
                        )}
                    </div>
                </section>

                {/* Integration Test */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Component Integration Test</h2>
                    <Card >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Complex Component Integration
                                <Badge >New</Badge>
                            </CardTitle>
                            <CardDescription>
                                Testing multiple components working together
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Search events..." />
                            <div className="flex gap-2">
                                <Button size="sm">
                                    Search
                                </Button>
                                <Button size="sm">
                                    Clear
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" />
                                <span className="text-sm text-muted-foreground">Loading...</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
