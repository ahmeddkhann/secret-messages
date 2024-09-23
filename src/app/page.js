"use client"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-pink-500">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Secret Message App
        </h1>
        <p className="text-gray-600 mb-6">
          Send and receive encrypted messages with ease and security.
        </p>
        <a
          href="/send-message"
          className="inline-block px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Start Messaging
        </a>
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Your privacy is our priority.
          </p>
        </div>
      </div>
    </div>
  );
}

