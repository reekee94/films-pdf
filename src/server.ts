import dotenv from 'dotenv';
import express from 'express';
import { movieController } from './controllers/movies';


dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use('/movies', movieController);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

