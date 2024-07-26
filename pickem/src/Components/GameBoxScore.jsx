import { useState, useEffect } from 'react';
const API_KEY = import.meta.env.VITE_APP_API_KEY;
import { Link } from "react-router-dom";

const GameBoxScore = ({ week, season_type, season, gameID }) => {
    const [gameScores, setGameScores] = useState(null);
    const [homePts, setHomePts] = useState(null);
    const [awayPts, setAwayPts] = useState(null);

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
                const awayPoints = gameData.awayPts;
                const homePoints = gameData.homePts;

                // Update state
                setAwayPts(awayPoints);
                setHomePts(homePoints);
                console.log(`Away Points: ${awayPoints}, Home Points: ${homePoints}`);
            } else {
                console.error('Game data not found for gameID:', gameID);
            }
        }
    }, [gameScores, gameID]);

    return (
        <div>
            <Link>
                <div>( {awayPts !== null ? awayPts : 'Loading...'} - {homePts !== null ? homePts : 'Loading...'} )</div>
                {/*<div>Home: {homePts !== null ? homePts : 'Loading...'}</div>*/}
                
            </Link>
        </div>
    );
};

export default GameBoxScore;