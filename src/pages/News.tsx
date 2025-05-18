
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NewsArticleCard } from '../components/NewsArticleCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNews, NewsArticleWithRequiredId } from '@/hooks/useNews';

const News = () => {
  const navigate = useNavigate();
  const { newsArticles, loading, error, selectedArticle, openArticle, closeArticle } = useNews();
  
  const handleModeChange = (mode: string) => {
    if (mode === 'overall') {
      navigate('/');
    } else {
      navigate(`/${mode.toLowerCase()}`);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall" 
        onSelectMode={handleModeChange} 
        navigate={navigate}
        activePage="news"
      />
      
      <main className="flex-grow">
        <div className="content-container py-6 md:py-8">
          <motion.h1 
            className="section-heading mb-6 md:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            News & Announcements
          </motion.h1>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse">Loading news articles...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">
              Error loading news: {error}
            </div>
          ) : newsArticles.length === 0 ? (
            <div className="text-center text-white/60 py-12">
              No news articles available at this time.
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {newsArticles.map((article) => (
                <NewsArticleCard 
                  key={article.id} 
                  article={article as NewsArticleWithRequiredId} 
                  onClick={() => openArticle(article as NewsArticleWithRequiredId)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
