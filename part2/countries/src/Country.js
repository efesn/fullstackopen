import React from 'react';

const Country = ({ name, capital, population, flag }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Capital: {capital}</p>
      <p>Population: {population}</p>
      <img src={flag} alt={name} style={{ height: '100px' }} />
    </div>
  );
};

export default Country;