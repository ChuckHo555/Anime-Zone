"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function VerifyUser() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const verifyUser = async () => {
      if (!isSignedIn || !user) {
        console.log("User not signed in or user object is unavailable.");
        return;
      }

      try {
        const token = await getToken();
        console.log("Session token:", token);

        const response = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            profilePicUrl: user.imageUrl,
            username:user.username,
          }),
        });

        console.log("API Call Response:", response);

        if (!response.ok) {
          console.error("Error from API:", await response.text());
        } else {
          const data = await response.json();
          console.log("User verification successful:", data);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      }
    };

    verifyUser();
  }, [isSignedIn, user]);

  return <div className=' flex font-semibold size-9'>
    Welcome,&nbsp;<span className="text-purle-50">{ user?.username || "Guest"}
      </span>!</div>;
}
