import express from 'express';
import { fetchMovieDetails, fetchPopularMovies } from '../services/movie.service';
import { generateMoviesPDF, generatePDF } from '../services/pdf.service';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const pageParam = req.query.page as string;
      const page = pageParam ? parseInt(pageParam, 10) : 1;

      if (isNaN(page)) {
        return res.status(400).send("Invalid page number");
    }
      const moviesData = await fetchPopularMovies(page);
      if(!moviesData) {
        return res.status(404).send('No movies found.');
      }

      // movies.results.total_pages responce is invalid and (in API documentation mentioned limit for movies page is 500)
      const pdfBuffer = await generateMoviesPDF(moviesData.results, page, 500);

      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      res.status(500).send('Failed to generate PDF');
    }
  });

  router.get('/:id', async (req, res) => {
    try {
    const movie = await fetchMovieDetails(req.params.id);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    const pdfBuffer = await generatePDF(movie);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Failed to generate or send PDF:', error);
    res.status(500).send('Internal Server Error');
  }
  });

  export { router as movieController };
  