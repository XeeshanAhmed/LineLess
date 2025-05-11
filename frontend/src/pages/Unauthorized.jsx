export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="text-center p-6 bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-3xl font-semibold mb-2">403 - Unauthorized</h1>
        <p className="text-gray-400">
          You don’t have access to this page. Please contact the administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
