import React from 'react';
import './MovieForm.css';

const MovieForm = ({ newMovie, onInputChange, onAddMovie }) => {
  const { title, openingText, releaseDate } = newMovie || {};

  return (
    <form className="movie-form">
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        name="title"
        value={title || ''}
        onChange={(e) => onInputChange(e, 'title')}
      />

      <label htmlFor="openingText">Opening Text:</label>
      <textarea
        id="openingText"
        name="openingText"
        value={openingText || ''}
        onChange={(e) => onInputChange(e, 'openingText')}
      />

      <label htmlFor="releaseDate">Release Date:</label>
      <input
        type="text"
        id="releaseDate"
        name="releaseDate"
        value={releaseDate || ''}
        onChange={(e) => onInputChange(e, 'releaseDate')}
      />

      <button type="button" className="custom-button" onClick={onAddMovie}>
        Add Movie
      </button>
    </form>
  );
};

export default MovieForm;