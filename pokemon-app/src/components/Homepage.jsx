import { useEffect, useState } from "react";
import './Homepage.css'; // CSS per la homepage
import Navbar from './Navbar'; // Importa il componente Navbar
import Footer from './Footer'; // Importa il componente Footer
import '/src/App.css'

const Homepage = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [types, setTypes] = useState([]); // Stato per i tipi di Pokémon
  const [filter, setFilter] = useState(""); // Stato per il filtro dei tipi di Pokémon
  const [sortCriteria, setSortCriteria] = useState(""); // Stato per l'ordinamento
  const [error, setError] = useState(null); // Stato per la gestione degli errori

  // Mappa dei colori in base al tipo di Pokémon
  const typeColors = {
    fire: 'red',
    water: 'lightblue',
    grass: 'green',
    electric: 'goldenrod',
    ground: 'brown',
    rock: 'gray',
    fairy: 'pink',
    poison: 'purple',
    bug: 'olive',
    dragon: 'orange',
    psychic: 'magenta',
    flying: 'skyblue',
    fighting: 'darkred',
    normal: 'black',
    ghost: 'indigo',
    ice: 'lightblue',
    dark: 'black',
    steel: 'silver',
  };

  useEffect(() => {
    // Fetch per ottenere i tipi di Pokémon
    const fetchTypes = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        if (!response.ok) {
          throw new Error("Impossibile caricare i tipi di Pokémon");
        }
        const data = await response.json();
        setTypes(data.results); // Imposta i tipi di Pokémon nel nostro stato
      } catch (error) {
        setError(error.message);
      }
    };

    // Fetch per ottenere i Pokémon
    const fetchPokemon = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
        if (!response.ok) {
          throw new Error("Impossibile caricare i dati dei Pokémon");
        }
        const data = await response.json();

        // Mappa i dati ottenuti per ottenere le informazioni necessarie
        const pokemonList = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokemonDetail = await fetch(pokemon.url);
            return pokemonDetail.json();
          })
        );

        setPokemonData(pokemonList); // Imposta i dati dei Pokémon nel nostro stato
      } catch (error) {
        setError(error.message); // Imposta lo stato dell'errore
      }
    };

    fetchTypes();
    fetchPokemon();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  // Funzione per capitalizzare la prima lettera dei nomi
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Funzione per ordinare i Pokémon
  const sortPokemon = (pokemonList) => {
    if (sortCriteria === "name") {
      return pokemonList.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortCriteria === "height") {
      return pokemonList.sort((a, b) => a.height - b.height);
    }
    if (sortCriteria === "weight") {
      return pokemonList.sort((a, b) => a.weight - b.weight);
    }
    return pokemonList;
  };

  // Filtro per tipo di Pokémon
  const filteredPokemon = pokemonData.filter((pokemon) => {
    if (!filter) return true; // Se non c'è filtro, mostra tutti i Pokémon
    return pokemon.types.some((type) => type.type.name === filter); // Filtra per tipo
  });

  // Ordina i Pokémon dopo averli filtrati
  const sortedPokemon = sortPokemon(filteredPokemon);

  return (
    <div className="homepage">
      <Navbar /> {/* Utilizza il componente Navbar */}

      {/* Filtro e ordinamento */}
      <div className="filter-container">
        <select
          className="form-select"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="">Tutti</option>
          {types.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>

        {/* Dropdown per l'ordinamento */}
        <select
          className="form-select"
          value={sortCriteria}
          onChange={handleSortChange}
        >
          <option value="">Ordina per</option>
          <option value="name">Ordine Alfabetico (A-Z)</option>
          <option value="height">Altezza</option>
          <option value="weight">Peso</option>
        </select>
      </div>

      {/* Gestione degli errori */}
      {error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <div className="pokemon-cards-container">
          {sortedPokemon.length > 0 ? (
            sortedPokemon.map((pokemon) => {
              const primaryType = pokemon.types[0].type.name; // Prendi il primo tipo
              const nameColor = typeColors[primaryType] || "black"; // Se non c'è il tipo, usa il nero

              return (
                <div key={pokemon.id} className="pokemon-card">
                  <img
                    src={pokemon.sprites.other["official-artwork"].front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                  />
                  <h2 style={{ color: nameColor }}>
                    {capitalizeFirstLetter(pokemon.name)}
                  </h2>
                  <p>Tipo: {pokemon.types.map((type) => type.type.name).join(", ")}</p>
                  <p>Altezza: {pokemon.height}m</p>
                  <p>Peso: {pokemon.weight}kg</p>
                </div>
              );
            })
          ) : (
            <div className="alert alert-info text-center">
              Nessun Pokémon trovato.
            </div>
          )}
        </div>
      )}

      <Footer /> {/* Aggiungi il footer */}
    </div>
  );
};

export default Homepage;
