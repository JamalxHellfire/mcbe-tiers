
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  author: string;
  created_at: string;
}

export function useNews() {
  const {
    data: newsArticles = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching news:', error);
          throw new Error('Failed to load news articles');
        }
        
        return data || [];
      } catch (err: any) {
        console.error('Error in news query:', err);
        throw new Error(err.message || 'Failed to load news articles');
      }
    },
    staleTime: 60000, // 1 minute
  });
  
  return {
    newsArticles,
    loading,
    error: error ? (error as Error).message : null
  };
}
