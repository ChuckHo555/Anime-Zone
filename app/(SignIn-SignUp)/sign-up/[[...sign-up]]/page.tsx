import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return <div className="auth-container">
    <SignUp  afterSignInUrl="/protected/HomePage" />
    </div>
}