import React, { useEffect, useState } from 'react'
import NavBar from '../components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Button,
} from '@mui/material';

export const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const personurl = location.state.personurl;
  const [personData, setPersonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(personurl);
        const data = response.data;
        let species = [];
        if (data.species.length === 0) {
          const speciesResponse = await axios.get("https://swapi.dev/api/species/1/");
          species.push(speciesResponse.data.name);
        } else {
          species = await Promise.all(data.species.map(async (url) => {
            const res = await axios.get(url);
            return res.data.name;
          }));
        }

        const films = await Promise.all(data.films.map(async (url) => {
          const res = await axios.get(url);
          return res.data.title;
        }));
        const homeworldRes = await axios.get(data.homeworld);
        const homeworld = homeworldRes.data.name;
        
        setPersonData({ ...data, species, films, homeworld });
      } catch (error) {
        console.log(error);
      }
    };

    if (personurl) {
      fetchData();
    }
  }, [personurl]);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <>
      <NavBar hideSearch />
      <div style={{ margin: '20px' }}>
        <Card>
          <CardContent>
            <Button
              onClick={handleGoBack}
              variant="outlined"
              style={{ float: 'right'}} 
              size="large" 
              color="primary" 
              sx={{
                color: 'black',
                borderColor: 'blue',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
            >
              Go back
            </Button>
            {personData ? (
              <>
                <Typography variant="h5">{personData.name}</Typography>
                <Divider />
                <Typography variant="subtitle1">Personal Information</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary={`Height: ${personData.height}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Mass: ${personData.mass}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Hair Color: ${personData.hair_color}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Skin Color: ${personData.skin_color}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Eye Color: ${personData.eye_color}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Birth Year: ${personData.birth_year}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Gender: ${personData.gender}`} />
                  </ListItem>
                </List>
                <Divider />
                <Typography variant="subtitle1">Species</Typography>
                <List>
                  {personData.species.map((species, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={species} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <Typography variant="subtitle1">Films</Typography>
                <List>
                  {personData.films.map((film, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={film} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <Typography variant="subtitle1">Homeworld</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary={personData.homeworld} />
                  </ListItem>
                </List>
              </>
            ) : (
              <>
                <Skeleton variant="text" width={600} height={100} />
                <Skeleton variant="text" width={600} height={100} />
                <Skeleton variant="text" width={600} height={100} />
                <Skeleton variant="text" width={600} height={100} />
                <Skeleton variant="text" width={600} height={100} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};