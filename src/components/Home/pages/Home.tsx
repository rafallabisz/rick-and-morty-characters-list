import Alert from 'common/Alert';
import ErrorAlert from 'common/ErrorAlert/ErrorAlert';
import LoadingIndicator from 'common/LoadingIndicator/LoadingIndicator';
import Card from 'components/Home/components/Card';
import CharacterStatusFilters from 'components/Home/components/CharacterStatusFilters';
import { getTotalCountItem } from 'components/Home/functions/funtions';
import { ICharacter } from 'components/Home/models/home.models';
import homeService from 'components/Home/services/home.service';
import { useContextState } from 'contexts/GlobalContext';
import MainLayout from 'layouts/MainLayout';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useQuery } from 'react-query';
import { IGenericResponse } from 'utils/commonModels';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const defaultPage = 1;
  const [page, setPage] = useState(defaultPage);
  const [hasMore, setHasMore] = useState(true);
  const [fetchCharacters, setFetchCharacters] = useState<ICharacter[]>([]);
  const { stateContext } = useContextState();

  const searchName = useMemo(() => stateContext.search, [stateContext.search]);
  const characterStatus = useMemo(() => stateContext.characterStatus, [stateContext.characterStatus]);

  const { data: characters, isError, error } = useQuery<IGenericResponse<ICharacter>, Error>(
    ['characters', page, searchName, characterStatus],
    () => homeService.getCharactersList(page, searchName, characterStatus),
    {
      onSuccess: response => {
        handleFetchCharacters(response);
      },
      onError: () => {
        //if not found elements, for example by search, api should response empty results in status 200 and alert show not found results. Now is error 404.
        resetFetchCharacters();
      },
    },
  );

  const handleHasMore = useCallback((characters: IGenericResponse<ICharacter>, fetchCharacters: ICharacter[]) => {
    if (characters) {
      const totalCountItem = getTotalCountItem(characters);
      if (fetchCharacters?.length >= totalCountItem) {
        setHasMore(false);
        return;
      }
    }
  }, []);

  const handleFetchCharacters = useCallback(
    (characters: IGenericResponse<ICharacter>) => {
      const results = characters.results;
      handleHasMore(characters, results);
      if (page === defaultPage) {
        return setFetchCharacters(results);
      }
      setFetchCharacters(prevFetchCharacters => prevFetchCharacters?.concat(results));
    },
    [handleHasMore, page],
  );

  //reset if active filters
  const resetFetchCharacters = useCallback(() => {
    setFetchCharacters([]);
    setPage(defaultPage);
    setHasMore(true);
  }, []);

  const fetchMoreData = useCallback(() => {
    if (characters) {
      handleHasMore(characters, fetchCharacters);
      const totalCountItem = getTotalCountItem(characters);
      if (fetchCharacters?.length < totalCountItem) {
        setPage(prevPage => prevPage + 1);
      }
    }
  }, [characters, fetchCharacters, handleHasMore]);

  //reset state if change filter search
  useEffect(() => {
    resetFetchCharacters();
  }, [resetFetchCharacters, searchName, characterStatus]);

  return (
    <MainLayout>
      <CharacterStatusFilters />
      <ErrorAlert error={error} isError={isError} />
      <InfiniteScroll
        dataLength={fetchCharacters.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<LoadingIndicator isLoading={!isError} />}
        endMessage={<Alert>All items loaded!</Alert>}
      >
        <div className="justify-center flex">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 p-5">
            {fetchCharacters?.map((character, index) => (
              <Card character={character} key={index} />
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </MainLayout>
  );
};

export default Home;
