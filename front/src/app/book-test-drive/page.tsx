import { Suspense } from 'react';
import Layout from '@/components/Layout';
import BookTestDrive from '@/components/BookTestDrive';

export default function BookTestDrivePage() {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
        <BookTestDrive />
      </Suspense>
    </Layout>
  );
}


