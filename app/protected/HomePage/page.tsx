import { SignOutButton } from "@clerk/nextjs"
import VerifyUser from "@/app/components/Auth/VerifyUser"
export default async function HomePage() {

return(
<div className='home-container'>
    <div className='user-header'>
        <VerifyUser/>
    </div>
    <div className='home-wrapper'>
        <SignOutButton/>
    </div>
</div>

);
}
