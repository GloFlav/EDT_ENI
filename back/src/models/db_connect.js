import { createConnection } from 'mysql2';

import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'localsql',
  password: process.env.DB_PASSWORD || 'localsql',
  database: process.env.DB_DATABASE || 'timetable_db',
  port: process.env.DB_PORT || 8889,
  // connectTimeout: 30000,
};

export const connection = createConnection(dbConfig);

console.log("Connexion en cours...");

connection.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à MySQL :', err);
  } else {
    console.log('Connecté à MySQL');
  }
});


