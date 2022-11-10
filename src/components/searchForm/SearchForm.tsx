import React, { useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import { useSearchedDataDispatch } from 'hooks/useSearch';
import { useApi } from 'hooks/useApi';
import { useSearchParams } from 'react-router-dom';
import S from './styles';

const DELAY_TIME = 200;

type SearchFormProps = {
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
};
const SearchForm = ({ setIsSearching }: SearchFormProps) => {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const dispatch = useSearchedDataDispatch();
  const navigate = useNavigate();
  const getResponse = useApi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const keyword = value.replace(/ /g, '+');
    navigate(`/search?q=${keyword}`);
  };

  const handleFocus = () => {
    setIsSearching(true);
  };
  const handleBlur = () => {
    if (!query) {
      setIsSearching(false);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const cachedItem = sessionStorage.getItem(query);
    if (query) {
      if (cachedItem) {
        const data = JSON.parse(cachedItem);
        dispatch({ type: 'SET_DATA', data });
      } else {
        const debounce = setTimeout(() => {
          getResponse();
        }, DELAY_TIME);
        return () => clearTimeout(debounce);
      }
    }
  }, [query]);

  return (
    <S.Form onSubmit={handleSubmit}>
      <BsSearch />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button type="button">검색</button>
    </S.Form>
  );
};

export default SearchForm;
