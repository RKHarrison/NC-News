\c nc_news_test

 SELECT     a.created_at, 
            a.article_id, 
            a.author, 
            title, 
            topic, 
            a.votes, 
            a.article_id, 
            COUNT(comment_id) AS comment_count
 FROM articles a
 LEFT JOIN comments c ON a.article_id = c.article_id
 GROUP BY   a.title,
            a.created_at, 
            a.article_id, 
            a.author, 
            a.title, 
            a.topic, 
            a.votes
 ORDER BY   a.created_at DESC;

--  select * from comments
    