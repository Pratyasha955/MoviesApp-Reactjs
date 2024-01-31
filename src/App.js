import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      setError('Something went wrong. Retrying...');
      setRetryCount((prevRetryCount) => prevRetryCount + 1);
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setMovies, setRetryCount]);

  const cancelRetryHandler = useCallback(() => {
    setRetryCount(0);
    setError(null);
  }, [setRetryCount, setError]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  useEffect(() => {
    if (retryCount > 0) {
      const timerId = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000);

      return () => clearTimeout(timerId);
    }
  }, [retryCount, fetchMoviesHandler]);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>
          Fetch Movies
        </button>
        {retryCount > 0 && (
          <button onClick={cancelRetryHandler} disabled={isLoading}>
            Cancel Retry
          </button>
        )}
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>{error || 'Found no movies.'}</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
