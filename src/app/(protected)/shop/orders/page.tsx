import { serverAuth } from '@/lib/server-auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/shop/orders");
  }
  return (
    <div>page</div>
  )
}

export default page