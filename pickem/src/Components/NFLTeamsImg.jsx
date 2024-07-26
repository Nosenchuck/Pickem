{/*import { useState, useEffect } from 'react';
const API_KEY = import.meta.env.VITE_APP_API_KEY;
import { Link } from "react-router-dom";

const NFLTeamsImg = ({ teamID }) => {
  const [teamData, setTeamData] = useState({});

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
        const teamMapping = result.body.reduce((acc, team) => {
          acc[team.teamID] = {
            logo: team.espnLogo1,
            wins: team.wins,
            losses: team.loss,
            tie: team.tie
          };
          return acc;
        }, {});
        setTeamData(teamMapping);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeams();
  }, []);

  const team = teamData[teamID];

  if (!team) {
    return null;
  }

  return (
    <div className="team">
      <Link>
        <img src={team.logo} alt={`${teamID} Logo`} style={{ width: '50px' }} />
        <div>Wins: {team.wins}</div>
        <div>Losses: {team.losses}</div>
        <div>Ties: {team.tie}</div>
      </Link>
    </div>
  );
};

export default NFLTeamsImg;*/}