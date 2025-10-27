export default function SearchBar() {
  return (
    <input
      type="text"
      placeholder="Search player or team..."
      className="px-4 py-2 bg-gray-700 text-white rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
