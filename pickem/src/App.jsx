import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  //const [teams, setTeams] = useState([]);
  const [week, setWeek] = useState('1');

  useEffect(() => {
    const fetchTeams = async () => {
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
        // Update your state or process the result here
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeams();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <div className="whole-page">
        <div className="card">
          <button>Week</button>
          <button>Season</button>
        </div>
        {/* Render your teams here */}
      </div>
    </>
  );
}

export default App;