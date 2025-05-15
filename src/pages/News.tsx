
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNews } from '@/hooks/useNews';
import { NewsArticleCard } from '@/components/NewsArticleCard';
import { Loader2 } from 'lucide-react';

const News = () => {
  const { newsArticles, loading, error } = useNews();
  const [displayCount, setDisplayCount] = useState(6);
  
  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
  };
  
  const visibleArticles = newsArticles.slice(0, displayCount);
  const hasMoreArticles = displayCount < newsArticles.length;
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="flex-grow">
        <div className="content-container py-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-heading mb-8"
          >
            Latest News
          </motion.h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">
              <p>Error loading news: {error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : newsArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No news articles available at the moment.</p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleArticles.map((article) => (
                  <NewsArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              {hasMoreArticles && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex justify-center mt-10"
                >
                  <Button onClick={loadMore} size="lg">
                    Load More
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
