const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'charani',
  port: 5432,
});

app.use(bodyParser.json());

// Create 50 dummy records in the database
const createDummyData = async () => {
  try {
    for (let i = 0; i < 50; i++) {
      const query = `
        INSERT INTO records(customer_name, age, phone, location, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const values = [
        `Customer ${i + 1}`, // Corrected template literal syntax
        Math.floor(Math.random() * 50) + 18, // Random age between 18 and 67
        `123-456-${i.toString().padStart(2, '0')}`, // Corrected template literal syntax
        `Location ${Math.floor(Math.random() * 5) + 1}`, // Corrected template literal syntax
        new Date().toISOString(),
      ];
      await pool.query(query, values);
    }
    console.log('Dummy data created successfully');
  } catch (error) {
    console.error('Error creating dummy data:', error);
  }
};

createDummyData();

// Get paginated data with search and sorting
app.get('/api/data', async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'ASC', search = '' } = req.query;
    const offset = (page - 1) * limit;
    const query = `
      SELECT *, TO_CHAR(created_at, 'YYYY-MM-DD') AS date, TO_CHAR(created_at, 'HH24:MI:SS') AS time
      FROM records
      WHERE customer_name ILIKE $1 OR location ILIKE $1
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [`%${search}%`, limit, offset]); // Corrected template literal syntax
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Corrected template literal syntax
});