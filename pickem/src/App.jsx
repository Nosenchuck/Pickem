import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
const API_KEY = import.meta.env.VITE_APP_API_KEY;

//review lab 5 and 6. will need to make components to pass
//props like team image icon, game id to match game scores/results for
//each week. need multiple api calls.

function App() {
  //const [teams, setTeams] = useState([]);
  const [week, setWeek] = useState('1');
  const [games, setGames] = useState([]);
  const [team_img, setTeam_img] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLGamesForWeek?week=${week}&seasonType=reg&season=2023`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json(); // Assuming the API returns JSON
        console.log(result);
        setGames(result.body);// Update your state or process the result here
      } catch (error) {
        console.error(error);
      }
    };

    fetchSchedule();
  }, [week]); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const fetchTeams = async () => {
      const url = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeams?sortBy=standings&rosters=false&schedules=false&topPerformers=false&teamStats=false&teamStatsSeason=false';
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
        const teamMapping = result.body.reduce((acc, team) => {
          acc[team.teamID] = team.espnLogo1;
          return acc;
        }, {});
        setTeam_img(teamMapping); // Store the mapping instead of the array
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchTeams();
  }, []);

  

 

  return (
    <>
    <div className="whole-page">
      <div className="card">
        <label htmlFor="week-select">Choose a week:</label>
        <select id="week-select" value={week} onChange={(e) => setWeek(e.target.value)}>
          {Array.from({ length: 17 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Week {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div>
          {games.map((game, index) => (
            <div key={index} className="game">
              {/* Display team logos next to names if available */}
              <div className="game">
                <img src={team_img[game.teamIDAway]} alt="Away Team Logo" style={{ width: '50px' }} />
                <p>{game.away} @ {game.home}</p>
                <img src={team_img[game.teamIDHome]} alt="Home Team Logo" style={{ width: '50px' }} />
                <p>Status: {game.gameStatus}</p>
                <a href={game.espnLink} target="_blank" rel="noopener noreferrer">ESPN Link</a>
              </div>
              {/* Add more game details as needed */}
            </div>
          ))}
        </div>
    </div>
  </>
  );
}

export default App;