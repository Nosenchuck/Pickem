import { useState, useEffect } from 'react';
const API_KEY = import.meta.env.VITE_APP_API_KEY;

const GameBoxScore = ({week, season_type, season}) => {
    const [homePts, setHomePts] = useState([]);
    const [awayPts, setAwayPts] = useState([]);

    useEffect(() => {
        const fetchGameScores = async () => {
          const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLScoresOnly?gameWeek=${week}&season=${season}&seasonType=${season_type}`;
          const options = {
            method: 'GET',
            headers: {
              'x-rapidapi-key': API_KEY,
              'x-rapidapi-host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
            }
          };
      
          try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
    
            // Check if result.body exists and is an object
            if (result.body && typeof result.body === 'object') {
              // Process the game information
              //console.log(`Game ID: ${result.body.gameID}, Status: ${result.body.gameStatus}`);
            } else {
              console.error('Unexpected data structure for result.body:', result.body);
              // Handle the case where result.body is not as expected
              // For example, set an empty object or a default value
            }
           
            
          } catch (error) {
            console.error(error);
          }
        };
        fetchGameScores();
      }, [week, season, season_type]);

};