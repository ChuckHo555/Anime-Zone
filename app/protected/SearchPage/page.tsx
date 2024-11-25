import SearchBar from "@/app/components/SearchBar";

export default function SearchPage() {
  return (
    <div className="search-page-container bg-gray-900 text-white min-h-screen flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-6">Search Anime</h1>

      <SearchBar placeholder="Search your anime..." />
    </div>
  );
}
