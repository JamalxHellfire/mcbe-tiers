
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define the NewsArticle type here since it was removed from useAdminPanel
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  tags: string[];
}

export const NewsArticleCard: React.FC<{
  article: NewsArticle;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  isAdmin?: boolean;
}> = ({ article, onEditClick, onDeleteClick, isAdmin = false }) => {
  return (
    <Card className="overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">{article.title}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User size={14} />
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {article.publishDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {article.readTime}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="prose prose-sm dark:prose-invert">
          <p className="line-clamp-3">{article.content}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-1">
          {article.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" className="text-primary">
          Read More
        </Button>
        {isAdmin && (
          <div className="flex gap-2">
            {onEditClick && (
              <Button onClick={onEditClick} variant="outline" size="sm">
                Edit
              </Button>
            )}
            {onDeleteClick && (
              <Button onClick={onDeleteClick} variant="destructive" size="sm">
                Delete
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
