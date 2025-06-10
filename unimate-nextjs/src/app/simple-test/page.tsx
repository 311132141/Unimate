export default function SimpleTestPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Simple Test Page
                </h1>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p>This is a simple test to verify basic functionality.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Test Button
                    </button>
                </div>
            </div>
        </div>
    );
}
