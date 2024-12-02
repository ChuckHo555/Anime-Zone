import Link from 'next/link';
import { routes } from '@/util/constants';


export default function AuthPage() {
  return (
    <div className="welcome-container">
      <div className="title-container">
        <h1 className="title">Anime Zone</h1>
      </div>
      <p className="text-4xl font-bold" >Tech Nerds Save the World</p>
      <p className="subtext">
        Discover, track, and save your favorite anime with ease
      </p>
      
      <div className="btn-container">
        <Link href={routes.signIn.path}>
          <button className="btn">Sign In</button>
        </Link>
        <Link href={routes.signUp.path}>
          <button className="btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
