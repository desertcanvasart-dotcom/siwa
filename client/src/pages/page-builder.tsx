import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { PageBuilder } from '@/components/page-builder/page-builder';

export default function PageBuilderPage() {
  const [location, setLocation] = useLocation();
  
  // Extract page ID from URL path
  const pageId = parseInt(location.split('/').pop() || '0');
  
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
      return;
    }
    
    // Validate page ID
    if (!pageId || pageId <= 0) {
      setLocation('/admin/dashboard');
      return;
    }
  }, [pageId, setLocation]);

  if (!pageId || pageId <= 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid Page ID</h2>
          <p className="text-gray-600">Please select a valid page to edit.</p>
        </div>
      </div>
    );
  }

  return <PageBuilder pageId={pageId} />;
}