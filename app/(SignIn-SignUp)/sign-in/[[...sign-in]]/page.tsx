import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <div className="auth-container">
    <SignIn  forceRedirectUrl="/protected/HomePage" />
    </div>
}