
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNews } from '@/hooks/useNews';
import { NewsArticleCard } from '@/components/NewsArticleCard';

// Fix named imports
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const News = () => {
  const { newsArticles, loading, selectedArticle, openArticle, closeArticle } = useNews();
  const [visibleArticles, setVisibleArticles] = useState(10);
  
  // Create empty props for Navbar to satisfy TypeScript
  const navbarProps = {
    selectedMode: '',
    onSelectMode: () => {},
    navigate: () => {}
  };

  const loadMore = () => {
    setVisibleArticles(prev => prev + 10);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar {...navbarProps} />
      
      <div className="container mx-auto py-12 px-4">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Latest News
        </motion.h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : newsArticles.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {newsArticles.slice(0, visibleArticles).map((article, index) => (
              <NewsArticleCard
                key={article.id || index}
                article={article}
                onClick={() => openArticle(article)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No news articles available at this time.
          </motion.div>
        )}
        
        {newsArticles.length > visibleArticles && (
          <div className="flex justify-center mt-8">
            <Button onClick={loadMore} className="animate-fade">
              Load More
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
      
      <AnimatePresence>
        {selectedArticle && (
          <AlertDialog open={!!selectedArticle} onOpenChange={(open) => !open && closeArticle()}>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold">{selectedArticle.title}</AlertDialogTitle>
                <AlertDialogDescription className="text-base whitespace-pre-wrap">
                  {selectedArticle.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-4 text-sm text-muted-foreground flex justify-between items-center">
                <span>By: {selectedArticle.author}</span>
                <span>
                  {selectedArticle.created_at && new Date(selectedArticle.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={closeArticle}>Close</Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
