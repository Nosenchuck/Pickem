import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [count, setCount] = useState(0)
  const [resource, setResource] = useState('/search_all_teams.php?l=NFL')
  const [teams, setTeams] = useState([])

  useEffect(() => {
    fetch( `https://www.thesportsdb.com/api/v1/json/3/${resource}`)
      .then(response => response.json())
      .then(json => setTeams(json.teams))
      .then(json => console.log(json))
  }, [resource])

  /*function fetchJSONData() {
    fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NFL")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => 
              console.log(data))
        .catch((error) => 
               console.error("Unable to fetch data:", error));
}
fetchJSONData();*/

  return (
    <>
      <div className="whole-page">

        <div className="card">
          <button onClick={() => setResource(teams)}>Teams</button>
        </div>
        {teams.map(item => {
          return <div>{item.strTeam}</div>;
        })}
      </div>

    </>
  )
}

export default App
