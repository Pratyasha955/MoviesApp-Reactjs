// App.js
import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import MovieForm from './components/MovieForm';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: '',
    openingText: '',
    releaseDate: '',
  });

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://react-http-movie-cd0cf-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = async () => {
    try {
      const response = await fetch('https://react-http-movie-cd0cf-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(newMovie),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the movie to the database.');
      }

      const data = await response.json();

      setMovies((prevMovies) => [
        ...prevMovies,
        {
          id: data.name,
          ...newMovie,
        },
      ]);

      setNewMovie({
        title: '',
        openingText: '',
        releaseDate: '',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteMovieHandler = async (movieId) => {
    try {
      const response = await fetch(`https://react-http-movie-cd0cf-default-rtdb.firebaseio.com/movies/${movieId}.json`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the movie from the database.');
      }

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const inputChangeHandler = useCallback((event, propertyName) => {
    const { value } = event.target;
    setNewMovie((prevMovie) => ({
      ...prevMovie,
      [propertyName]: value,
    }));
  }, []);

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <MovieForm
          newMovie={newMovie}
          onInputChange={inputChangeHandler}
          onAddMovie={addMovieHandler}
        />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
