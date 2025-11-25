import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>403 - Unauthorized</h1>
        <p className='mt-4 text-gray-600'>
          You don&apos;t have permission to access this page.
        </p>
        <Button asChild className='mt-6'>
          <Link href='/login'>Go to Login page</Link>
        </Button>
      </div>
    </div>
  );
}
