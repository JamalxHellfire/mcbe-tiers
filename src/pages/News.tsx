
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NewsArticleCard } from '../components/NewsArticleCard';
import { useNews } from '@/hooks/useNews';

const News = () => {
  const navigate = useNavigate();
  const { newsArticles, loading, error } = useNews();
  
  // Page is created but disabled - redirect to home
  React.useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall"
        onSelectMode={() => {}}
        navigate={navigate}
      />
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <motion.h1 
            className="section-heading mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Latest News
          </motion.h1>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Loading news articles...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">
              Error loading news: {error}
            </div>
          ) : newsArticles && newsArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NewsArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/60">
              No news articles available at the moment.
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
