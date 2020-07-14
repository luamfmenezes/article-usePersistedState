import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

// interface Repositories = {

// }
import {
  Container,
  SpotLights,
  SpotLightItem,
  AddRepository,
  AddRepositoryItem,
} from "./styles";

interface IRepository {
  id: string;
  full_name: string;
  owner: {
    avatar_url: string;
    login: string;
  };
}

const App: React.FC = () => {
  const [search, setSearch] = useState("");
  const [spotLights, setSpotLights] = useState<IRepository[]>([]);
  const [repositories, setRepositories] = useState<IRepository[]>([]);

  useEffect(() => {
    const loadRepositories = async () => {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${search}&per_page=5`
      );
      setRepositories(response.data.items);
    };
    if (search.length > 3) {
      loadRepositories();
    } else {
      setRepositories([]);
    }
  }, [search]);

  const handleAdd = useCallback(
    (repository) => {
      setSpotLights((oldSpotLights) => [...oldSpotLights, repository]);
    },
    [setSpotLights]
  );

  const handleChangeSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleRemove = useCallback((id) => {
    setSpotLights((oldSpotLights) =>
      oldSpotLights.filter((spotLight) => spotLight.id !== id)
    );
  }, []);

  const repositoriesWithSpotlightLabel = useMemo(
    () =>
      repositories.map((respository) => ({
        ...respository,
        spotlight: spotLights.find(
          (spotLight) => spotLight.id === respository.id
        ),
      })),
    [repositories, spotLights]
  );

  return (
    <Container>
      <h1>SpotLight Repositories</h1>
      <SpotLights>
        {spotLights.map((repository) => (
          <SpotLightItem key={repository.id}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <h1>{repository.full_name}</h1>
            <button onClick={() => handleRemove(repository.id)}>Remove</button>
          </SpotLightItem>
        ))}
      </SpotLights>
      <AddRepository>
        <header>
          <h1>Search repository</h1>
          <input value={search} onChange={handleChangeSearch} />
        </header>
        {repositoriesWithSpotlightLabel.map((repository) => (
          <AddRepositoryItem key={repository.id}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <h1>{repository.full_name}</h1>
            {!repository.spotlight && (
              <button onClick={() => handleAdd(repository)}>Add</button>
            )}
          </AddRepositoryItem>
        ))}
      </AddRepository>
    </Container>
  );
};

export default App;
