import { Card, CardContent, Typography, CardActions, Button, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

const HUMAN_SPECIES_URL = "https://swapi.dev/api/species/1/";

export default function StarWarsCard({ name, homeworldurl, speciesurls,personurl }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate(); // Hook para navegar entre as páginas

  const fontSize = isSmallScreen ? '1rem' : isMediumScreen ? '1.5rem' : '1.8rem';

  const [homeworld, setHomeworld] = useState("");
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    getHomeworld();
    getSpecies();
  }, []);

  const getHomeworld = () => {
    axios
      .get(homeworldurl)
      .then((response) => {
        setHomeworld(response.data.name);
        setLoading(false); 
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); 
      });
  };

  const getSpecies = () => {
    const urls = speciesurls.length > 0 ? speciesurls : [HUMAN_SPECIES_URL];
    Promise.all(urls.map(url => axios.get(url)))
      .then((responses) => {
        setSpecies(responses.map(response => response.data.name));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLearnMoreClick = () => {
    navigate('/profile', { state: { personurl} });
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.05)', 
        }
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ fontSize }}
        >
          {name}
        </Typography>

        {loading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography
            gutterBottom
            variant="caption"
            component="div"
          >
            {"Birthplace: " + homeworld}
          </Typography>
        )}
        
        {loading ? (
          <Skeleton variant="text" />
        ) : (
          species.map((speciesName, index) => (
            <Typography
              key={index}
              gutterBottom
              variant="caption"
            >
              {"Specie: " + speciesName}
            </Typography>
          ))
        )}
      </CardContent>
      <CardActions>
        <Button 
          variant="outlined" 
          size="small" 
          color="primary" 
          sx={{
            color: 'black',
            borderColor: 'blue',
            '&:hover': {
              opacity: 0.8,
            },
          }}
          onClick={handleLearnMoreClick}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
