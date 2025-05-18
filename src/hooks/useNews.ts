
import { useState } from 'react';
import { useQuery, RefetchOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/integrations/supabase/client';

export function useNews() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  const { 
    data: newsArticles = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw new Error(error.message);
        }
        
        return data as NewsArticle[];
      } catch (err) {
        console.error('Error fetching news:', err);
        throw err;
      }
    },
    staleTime: 60000 // 1 minute
  });
  
  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
  };
  
  const closeArticle = () => {
    setSelectedArticle(null);
  };
  
  return {
    newsArticles,
    loading,
    error: error ? (error as Error).message : null,
    selectedArticle,
    openArticle,
    closeArticle,
    refetch
  };
}
