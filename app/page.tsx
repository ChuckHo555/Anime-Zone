import Link from 'next/link';
import {routes} from '@/util/constants';



export default function WelcomePage() {


  return (
    <div className="welcome-container ">
       <div className={`title-container `}>
        <h1 className="title">Anime Zone</h1>
        </div>
        <p className={`text-4xl font-bold `} >Tech Nerds Save the World</p>
        <p className="subtext">
          Discover, track, and save your favorite anime with ease
        </p>
        <Link href={routes.auth.path} className="btn-container">
        <button className="btn">Get Started</button>
        </Link>
      
    </div>
  );
}
