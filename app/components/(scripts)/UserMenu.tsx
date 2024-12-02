'use client';

import { UserButton } from '@clerk/nextjs';

export default function UserProfileMenu() {
  return (
    <div className="relative">
      {/* UserButton Component */}
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: 'w-12 h-12', // Adjust size as needed
          },
        }}
        afterSignOutUrl="/"
      />
    </div>
  );
}
