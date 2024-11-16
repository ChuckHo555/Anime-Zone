import Link from 'next/link';

export default function AuthPage() {
  return (
    <section className="auth-container">
      <div className="auth-wrapper">
        <h1 className="text-4xl font-bold mb-4">Welcome to Anime Zone!</h1>
        <p>Please choose an option to continue:</p>
        <div className="auth-buttons">
          <Link href="/sign-in">
            <button>Sign In</button>
          </Link>
          <Link href="/sign-up">
            <button>Sign Up</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
