import { useState, useEffect } from 'react';
const API_KEY = import.meta.env.VITE_APP_API_KEY;
import { Link } from "react-router-dom";

const GameBoxScore = ({ week, season_type, season, gameID, teamID }) => {
    const [gameScores, setGameScores] = useState(null);
    const [teamPts, setTeamPts] = useState(null);
    const [opponentPts, setOpponentPts] = useState(null);

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
                    // Store the game scores in state
                    setGameScores(result.body);
                } else {
                    console.error('Unexpected data structure for result.body:', result.body);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchGameScores();
    }, [week, season, season_type]);

    useEffect(() => {
        if (gameScores) {
            // Convert the object to an array of values
            const gamesArray = Object.values(gameScores);

            // Find the game data for the given gameID
            const gameData = gamesArray.find(game => game.gameID === gameID);

            if (gameData) {
                console.log('Game Data:', gameData);
                console.log('Team ID:', teamID);

                const awayPoints = gameData.awayPts;
                const homePoints = gameData.homePts;

                // Update state based on teamID
                if (gameData.teamIDAway === teamID) {
                    setTeamPts(awayPoints);
                    setOpponentPts(homePoints);
                } else if (gameData.teamIDHome === teamID) {
                    setTeamPts(homePoints);
                    setOpponentPts(awayPoints);
                } else {
                    console.error('Team ID not found in game data:', teamID);
                }
                console.log(`Team Points: ${teamPts}`);
            } else {
                console.error('Game data not found for gameID:', gameID);
            }
        }
    }, [gameScores, gameID, teamID]);

    const isTeamWinning = teamPts !== null && opponentPts !== null && teamPts > opponentPts;
    const isTeamLosing = teamPts !== null && opponentPts !== null && teamPts < opponentPts;

    return (
      <div className="scores">
          <p className={isTeamWinning ? 'highlight-green' : isTeamLosing ? 'highlight-red' : ''}>
              Points Scored: {teamPts !== null ? teamPts : 'Loading...'}
          </p>
      </div>
  );
};

export default GameBoxScore;