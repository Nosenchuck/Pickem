import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
const API_KEY = import.meta.env.VITE_APP_API_KEY;
import { Link } from "react-router-dom";
import GameBoxScore from './Components/GameBoxScore';


//review lab 5 and 6. will need to make components to pass
//props like team image icon, game id to match game scores/results for
//each week. need multiple api calls.

function App() {
  //const [teams, setTeams] = useState([]);
  const [week, setWeek] = useState('1');
  const [season_type, setSeason_type] = useState('reg');
  const [season, setSeason] = useState('2024');
  //const [maxWeek, setMaxWeek] = useState(17);
  const [games, setGames] = useState([]);
  //const [gameScores, setGameScores] = useState([]);

  const [team_img, setTeam_img] = useState([]);
  const [wins, setWins] = useState([]);
  const [losses, setLosses] = useState([]);
  const [tie, setTie] = useState([]);

//team select
const [selectedTeams, setSelectedTeams] = useState({});
  

  //create route where user can select team to view team stats, current streak, ect
  

  const toggleTeamSelection = (gameID, teamType, teamID) => {
    setSelectedTeams((prevSelectedTeams) => {
      const newSelectedTeams = { ...prevSelectedTeams };
      if (newSelectedTeams[gameID]?.type === teamType && newSelectedTeams[gameID]?.id === teamID) {
        delete newSelectedTeams[gameID];
      } else {
        newSelectedTeams[gameID] = { type: teamType, id: teamID };
      }
      return newSelectedTeams;
    });
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(
      parseInt(dateString.substring(0, 4)), // Year
      parseInt(dateString.substring(4, 6)) - 1, // Month (0-based index)
      parseInt(dateString.substring(6, 8)) // Day
    );
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
  };

  const formatDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${month}-${day}-${year}`;
  };

  //fetch weekly schedule for every season, week, and season type
  useEffect(() => {
    const fetchSchedule = async () => {
      const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLGamesForWeek?week=${week}&seasonType=${season_type}&season=${season}`;
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
  }, [week, season_type, season]); // Empty dependency array means this effect runs once on mount

  //fetch team logos for each team
  // use this api to also get win loss records for each team
  useEffect(() => {
    const fetchTeams = async () => {
      const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeams?sortBy=standings&rosters=false&schedules=false&topPerformers=false&teamStats=true&teamStatsSeason=${season}`;
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
        const winsMapping = result.body.reduce((acc1, team1) => {
          acc1[team1.teamID] = team1.wins;
          return acc1;
        }, {});
        const lossesMapping = result.body.reduce((acc2, team2) => {
          acc2[team2.teamID] = team2.loss;
          return acc2;
        }, {});
        const tieMapping = result.body.reduce((acc3, team3) => {
          acc3[team3.teamID] = team3.tie;
          return acc3;
        }, {});
        setTeam_img(teamMapping); // Store the mapping instead of the array
        setWins(winsMapping);
        setLosses(lossesMapping);
        setTie(tieMapping);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchTeams();
  }, [season]);

  

  

 //edit so for pre season, only 4 weeks are available
 //for post season, weeks change to wild card, divisonal, conference, and super bowl

  return (
    <>
    <div className="whole-page">
      <div className="card">

        {/* select week */}
        <label htmlFor="week-select">Choose a week:</label>
        <select id="week-select" value={week} onChange={(e) => setWeek(e.target.value)}>
          {Array.from({ length: 18 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Week {i + 1}
            </option>
          ))}
        </select>

         {/* select season type */}
        <label htmlFor="season-type-select">Choose a season type:</label>
        <select id="season-type-select" value={season_type} onChange={(e) => setSeason_type(e.target.value)}>
          <option value="pre">Preseason</option>
          <option value="reg">Regular Season</option>
          <option value="post">Postseason</option>
        </select>

         {/* select season */}
        <label htmlFor="season-select">Choose a season:</label>
        <select id="season-select" value={season} onChange={(e) => setSeason(e.target.value)}>
          {Array.from({ length: 1 }, (_, i) => (
            <option key={2024 + i} value={2024 + i}>
              {2024 + i}
            </option>
          ))}
        </select>
      </div>
      <div>
          {games.map((game, index) => {
             const currentEpoch = Math.floor(Date.now() / 1000); // Get current epoch time in seconds
             const isGameTimePassed = currentEpoch >= parseFloat(game.gameTime_epoch);
            return (

            <div key={index} className="game">
              {/* Display team logos next to names if available */}
              <div className="game">
                <div className="game-time">
                  {
                    <p>{game.gameTime}, {getDayOfWeek(game.gameDate)}, {formatDate(game.gameDate)} </p>
                  }

                </div>
                {/* ----- use this to test keeping track of selected teams and showing record for correct picks
                <div
          className={`away-team ${selectedTeams[game.gameID]?.type === 'away' && selectedTeams[game.gameID]?.id === game.teamIDAway ? 'selected' : ''}`}
          onClick={() => toggleTeamSelection(game.gameID, 'away', game.teamIDAway)}
        >
                */}

                {/* -----use this so cant select pass game epoch time
                <div
                    className={`away-team ${selectedTeams[game.gameID]?.type === 'away' && selectedTeams[game.gameID]?.id === game.teamIDAway ? 'selected' : ''}`}
                    onClick={!isGameTimePassed ? () => toggleTeamSelection(game.gameID, 'away', game.teamIDAway) : null}
                    style={{ pointerEvents: isGameTimePassed ? 'none' : 'auto', opacity: isGameTimePassed ? 0.5 : 1 }}
                  >
                
                */}
                <div
                    className={`away-team ${selectedTeams[game.gameID]?.type === 'away' && selectedTeams[game.gameID]?.id === game.teamIDAway ? 'selected' : ''}`}
                    onClick={!isGameTimePassed ? () => toggleTeamSelection(game.gameID, 'away', game.teamIDAway) : null}
                    style={{ pointerEvents: isGameTimePassed ? 'none' : 'auto', opacity: isGameTimePassed ? 0.5 : 1 }}
                  >
                  <img src={team_img[game.teamIDAway]} alt="Away Team Logo" style={{ width: '50px' }} />
                  <p>{game.away}</p>
                  
                  <div className='record'>
                    <p>(</p>
                    <p>{wins[game.teamIDAway]}</p><p>-</p>
                    <p>{losses[game.teamIDAway]}</p><p>-</p>
                    <p>{tie[game.teamIDAway]}</p>
                    <p>)</p>
                  </div>
                  <div className = "away-score">
                    <GameBoxScore 
                      week={week} 
                      season_type={season_type} 
                      season={season}
                      gameID={game.gameID}
                      teamID={game.teamIDAway}
                      
                      />
                  </div>

                  
                  
                  
                </div>
                {/* if epoch time has passed, game info opacity is reduced. 
                possible change for styling purposes*/}

                {/* ----test for record tracking

                <div
          className={`home-team ${selectedTeams[game.gameID]?.type === 'home' && selectedTeams[game.gameID]?.id === game.teamIDHome ? 'selected' : ''}`}
          onClick={() => toggleTeamSelection(game.gameID, 'home', game.teamIDHome)}
        >
                
                */}

                {/* ----use this so cant select pass game epoch time
                <div
                    className={`home-team ${selectedTeams[game.gameID]?.type === 'home' && selectedTeams[game.gameID]?.id === game.teamIDHome ? 'selected' : ''}`}
                    onClick={!isGameTimePassed ? () => toggleTeamSelection(game.gameID, 'home', game.teamIDHome) : null}
                    style={{ pointerEvents: isGameTimePassed ? 'none' : 'auto', opacity: isGameTimePassed ? 0.5 : 1 }}
                  >
                
                */}
                <div
                    className={`home-team ${selectedTeams[game.gameID]?.type === 'home' && selectedTeams[game.gameID]?.id === game.teamIDHome ? 'selected' : ''}`}
                    onClick={!isGameTimePassed ? () => toggleTeamSelection(game.gameID, 'home', game.teamIDHome) : null}
                    style={{ pointerEvents: isGameTimePassed ? 'none' : 'auto', opacity: isGameTimePassed ? 0.5 : 1 }}
                  >
                  <img src={team_img[game.teamIDHome]} alt="Home Team Logo" style={{ width: '50px' }} />
                  <p>{game.home}</p>
                  <div className='record'>
                    <p>(</p>
                    <p>{wins[game.teamIDHome]}</p><p>-</p>
                    <p>{losses[game.teamIDHome]}</p><p>-</p>
                    <p>{tie[game.teamIDHome]}</p>
                    <p>)</p>
                  </div>
                  <div className = "away-score">
                    <GameBoxScore 
                      week={week} 
                      season_type={season_type} 
                      season={season}
                      gameID={game.gameID}
                      teamID={game.teamIDHome}
                      
                      />
                  </div>
                  
                </div>
                <div className="game-status">
                  <p>Status: {game.gameStatus}</p>
                  <a href={game.espnLink} target="_blank" rel="noopener noreferrer">ESPN Link</a>
                </div>
              </div>
             
              
              </div>
            );
          })}
        </div>
      </div>
  </>
  );
}

export default App;