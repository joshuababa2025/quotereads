import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const TestCategoryImages = () => {
  const [result, setResult] = useState<any>(null);

  const testCategoryImages = async () => {
    try {
      // Test if category_images table exists and has data
      const { data: tableData, error: tableError } = await supabase
        .from('category_images')
        .select('*')
        .limit(5);
      
      console.log('Table data:', tableData, tableError);

      // Test the RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_random_category_image', {
        category_name: 'Love'
      });
      
      console.log('RPC data:', rpcData, rpcError);

      setResult({
        tableData,
        tableError,
        rpcData,
        rpcError
      });
    } catch (error) {
      console.error('Test error:', error);
      setResult({ error: error.message });
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>Test Category Images</h3>
      <Button onClick={testCategoryImages}>Test Category Images System</Button>
      {result && (
        <pre className="mt-4 p-2 bg-gray-100 text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};