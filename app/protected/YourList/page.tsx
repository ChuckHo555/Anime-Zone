import YourListComponent from "@/app/components/YourLists";
import VerifyUser from "@/app/components/Auth/VerifyUser";

export default async function YourListPage() {
  return (
    <div className="your-list-page-container bg-gray-900 text-white min-h-screen flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-6">Your Anime List</h1>
      <VerifyUser /> 

      {/* Main Content */}
      <YourListComponent />
    </div>
  );
}
