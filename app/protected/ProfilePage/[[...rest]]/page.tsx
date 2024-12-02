import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return  <div className="flex flex-col justify-center items-center">
    <UserProfile routing="path" path="/protected/ProfilePage" />
 
    </div>
}
