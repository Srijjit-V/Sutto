/** Independent answer keys, one per challenge. The challenge test runs each
 * against real SQLite (sql.js) and compares with `expectedRows`, so an edit
 * to a dataset or an expected value cannot silently break a challenge. */
export const answers: Record<string, string> = {
  "ch1-q1": "SELECT * FROM snacks",
  "ch1-q2": "SELECT name, price FROM snacks WHERE price < 3",
  "ch1-q3": "SELECT name, price FROM snacks ORDER BY price DESC",
  "ch1-q4": "SELECT DISTINCT category FROM snacks",
  "ch2-q1": "SELECT name FROM snacks WHERE category = 'salty' AND in_stock = 1",
  "ch2-q2": "SELECT name, category FROM snacks WHERE category = 'drink' OR category = 'sweet'",
  "ch2-q3": "SELECT name, price FROM snacks WHERE price BETWEEN 2 AND 4",
  "ch2-q4": "SELECT name FROM snacks WHERE name LIKE '%e%' ORDER BY name",
  "ch3-q1": "SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id",
  "ch3-q2":
    "SELECT tracks.name, artists.name FROM tracks JOIN albums ON tracks.album_id = albums.id JOIN artists ON albums.artist_id = artists.id",
  "ch3-q3":
    "SELECT tracks.name, invoice_items.quantity FROM invoice_items JOIN tracks ON invoice_items.track_id = tracks.id WHERE invoice_items.invoice_id = 4",
  "ch3-q4": "SELECT first_name, last_name, country FROM customers ORDER BY country",
  "ch4-q1":
    "SELECT categories.name, COUNT(*) AS product_count FROM products JOIN categories ON products.category_id = categories.id GROUP BY categories.name",
  "ch4-q2":
    "SELECT products.name, SUM(order_items.quantity) AS total_qty FROM order_items JOIN products ON order_items.product_id = products.id GROUP BY products.name HAVING SUM(order_items.quantity) > 15 ORDER BY total_qty DESC",
  "ch4-q3":
    "SELECT order_id, SUM(unit_price * quantity) AS total FROM order_items GROUP BY order_id ORDER BY total DESC",
  "ch4-q4":
    "SELECT first_name || ' ' || last_name AS employee, COUNT(*) AS order_count FROM orders JOIN employees ON orders.employee_id = employees.id GROUP BY employee HAVING COUNT(*) > 2",
  "ch5-q1": "SELECT title FROM books WHERE id NOT IN (SELECT book_id FROM loans)",
  "ch5-q2":
    "SELECT name FROM authors WHERE id IN (SELECT author_id FROM books GROUP BY author_id HAVING COUNT(*) > 2)",
  "ch5-q3":
    "WITH unreturned AS (SELECT member_id FROM loans WHERE returned = 0) SELECT name FROM members WHERE id IN (SELECT member_id FROM unreturned)",
  "ch5-q4":
    "SELECT title, (SELECT COUNT(*) FROM loans WHERE loans.book_id = books.id) AS times_loaned FROM books ORDER BY title",
  "ch6-q1":
    "SELECT players.name, scores.score, RANK() OVER (ORDER BY scores.score DESC) AS rank FROM scores JOIN players ON players.id = scores.player_id WHERE scores.game = 'Comet Dash' ORDER BY scores.score DESC",
  "ch6-q2":
    "WITH ranked AS (SELECT players.name, scores.score, ROW_NUMBER() OVER (PARTITION BY scores.player_id ORDER BY scores.score DESC) AS rn FROM scores JOIN players ON players.id = scores.player_id) SELECT name, score FROM ranked WHERE rn = 1",
  "ch6-q3":
    "SELECT played_on, score, SUM(score) OVER (ORDER BY played_on) AS running_total FROM scores WHERE player_id = 1 ORDER BY played_on",
  "ch6-q4":
    "SELECT game, score, AVG(score) OVER (PARTITION BY game) AS game_avg FROM scores ORDER BY game, score",
  "ch7-q1":
    "SELECT customers.company_name, SUM(order_items.unit_price * order_items.quantity) AS total_spent FROM order_items JOIN orders ON order_items.order_id = orders.id JOIN customers ON orders.customer_id = customers.id GROUP BY customers.company_name ORDER BY total_spent DESC",
  "ch7-q2":
    "WITH customer_totals AS (SELECT customers.company_name AS name, SUM(order_items.unit_price * order_items.quantity) AS total FROM order_items JOIN orders ON order_items.order_id = orders.id JOIN customers ON orders.customer_id = customers.id GROUP BY customers.company_name) SELECT name FROM customer_totals WHERE total > (SELECT AVG(total) FROM customer_totals)",
  "ch7-q3":
    "WITH customer_totals AS (SELECT customers.company_name AS name, SUM(order_items.unit_price * order_items.quantity) AS total FROM order_items JOIN orders ON order_items.order_id = orders.id JOIN customers ON orders.customer_id = customers.id GROUP BY customers.company_name), ranked AS (SELECT name, total, RANK() OVER (ORDER BY total DESC) AS rnk FROM customer_totals) SELECT name, total, rnk FROM ranked WHERE rnk <= 2",
};
