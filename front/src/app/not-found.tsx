export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <a href="/" className="px-6 py-3 bg-kgm-amber text-black rounded-lg hover:bg-kgm-amber/80 transition-colors">
        Go Home
      </a>
    </div>
  );
}

