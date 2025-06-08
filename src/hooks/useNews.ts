
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  description?: string;
  author: string;
  category: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const articlesWithDescription = (data || []).map(article => ({
        ...article,
        description: article.description || article.content.substring(0, 150) + '...'
      }));

      setArticles(articlesWithDescription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  return { articles, loading, error, refetch: fetchNews };
}
