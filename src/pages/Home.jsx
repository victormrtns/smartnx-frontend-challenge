import React, { useEffect, useState } from 'react'
import StarWarsCard from '../components/StarWarsCard'
import NavBar from '../components/Navbar'
import { Container, Grid, Skeleton,Pagination,Box} from '@mui/material'
import axios from 'axios'

export const Home = () => {
  const [people, setPeople] = useState([]);
  const [allPeople, setAllPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPeopleForPage(page);
  }, [page]);

  const getPeopleForPage = (page) => {
    setLoading(true);
    axios
      .get(`https://swapi.dev/api/people/?page=${page}`)
      .then((response) => {
        setPeople(response.data.results);
        setAllPeople(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const peopleFilter = (name) => {
    if (name === "") {
      getPeopleForPage(page);
    } else {
      const filteredPeople = allPeople.filter(person =>
        person.name.toLowerCase().includes(name.toLowerCase())
      );
      setPeople(filteredPeople);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <NavBar peopleFilter={peopleFilter} />
      <Container maxWidth="false">
        <Grid container spacing={4}>
          {loading ? (
            Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rect" height={150} />
                <Skeleton />
                <Skeleton width="60%" />
              </Grid>
            ))
          ) : (
            people.map((person,key) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                <StarWarsCard name={person.name} homeworldurl={person.homeworld} speciesurls={person.species} personurl={person.url} />
              </Grid>
            ))
          )}
        </Grid>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={9}
            page={page}
            onChange={handlePageChange}
            size='small'
            sx={ {gap: '8px',margin: '16px 0'}}
          />
        </Box>
      </Container>
    </div>
  );
};