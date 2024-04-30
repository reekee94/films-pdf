import axios from 'axios';
import { MovieDetailsResponse, PopularMoviesResponse } from '../interfaces/movies.interface';


export const fetchPopularMovies = async (page: number = 1):Promise<PopularMoviesResponse | null> => {
  const url = `${process.env.BASE_URL}/movie/popular?page=${page}&api_key=${process.env.API_KEY}`;
  try {
    const response = await axios.get<PopularMoviesResponse>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return null;
  }
};

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetailsResponse | null> => {
    const url = `${process.env.BASE_URL}/movie/${movieId}?api_key=${process.env.API_KEY}`;
    try {
     const response = await axios.get<MovieDetailsResponse>(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie details for ID: ${movieId}`, error);
      return null;
    }
  };
