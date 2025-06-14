export default function HomePage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary">Welcome to Unimate</h1>
                <p className="text-muted-foreground text-lg">
                    Campus Navigation and Timetable System
                </p>
                <div className="flex gap-4 justify-center">
                    <a
                        href="/kiosk"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Open Kiosk Mode
                    </a>
                    <a
                        href="/dashboard"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
