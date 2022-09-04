import React, { useState } from "react";

const INITIAL_GAME_STATE: number[] = [];
const URLapi = "https://tennis-wecount.herokuapp.com/game-result";

function App() {
  const [namePlayer1, setNamePlayer1] = useState("");
  const [levelPlayer1, setLevelPlayer1] = useState(1);
  const [namePlayer2, setNamePlayer2] = useState("");
  const [levelPlayer2, setLevelPlayer2] = useState(1);
  const [results, setResults] = useState([]);

  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);

  const preventDefault = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const updateNamePlayer1 = (e: any) => {
    setNamePlayer1(e.target.value);
  };

  const updateNamePlayer2 = (e: any) => {
    setNamePlayer2(e.target.value);
  };

  const updateLevelPlayer1 = (e: any) => {
    setLevelPlayer1(Number(e.target.value));
  };

  const updateLevelPlayer2 = (e: any) => {
    setLevelPlayer2(Number(e.target.value));
  };

  const generatePoints = () => {
    const arrayGame = Array(150).fill(0);
    arrayGame.forEach((el, i) => {
      arrayGame[i] = returnWinner();
    });
    setGameState(arrayGame);
  };

  const getResults = () => {
    fetch(URLapi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameState),
    })
      .then((response) => response.json())
      .then((response) => setResults(response));
  };

  const returnWinner = () => {
    let max;

    if (levelPlayer1 !== levelPlayer2) {
      max = levelPlayer1 > levelPlayer2 ? levelPlayer1 : levelPlayer2;
    } else {
      return Math.floor(Math.random() * 2) + 1;
    }

    const min = levelPlayer1 < levelPlayer2 ? levelPlayer1 : levelPlayer2;

    let result = Math.floor(Math.random() * (max - min + 1)) + min;

    if (max - min >= 3 && result > min) {
      result = result - 1;
    } else if (max - min >= 6 && result > min) {
      result = result - 2;
    } else if (max - min === 1) {
      result = Math.floor(Math.random() * 7) + 1;

      if (result > 3 && max === levelPlayer1) {
        return 1;
      }

      if (result <= 3 && max === levelPlayer2) {
        return 1;
      }

      if (result > 3 && max === levelPlayer2) {
        console.log(result);
        return 2;
      }

      if (result <= 3 && max === levelPlayer1) {
        return 2;
      }
    }

    if (max === levelPlayer1 && result > levelPlayer2) {
      return 1;
    }

    if (max === levelPlayer2 && result === levelPlayer1) {
      return 1;
    }

    if (max === levelPlayer2 && result > levelPlayer1) {
      return 2;
    }

    if (max === levelPlayer1 && result === levelPlayer2) {
      return 2;
    }
  };

  const displayWinner = () => {
    if (results[0] === 0) {
      return <p>Le match est encore en cours...</p>;
    }

    if (results[0] === 1) {
      return <p>Le grand gagnant est {namePlayer1}</p>;
    }

    if (results[0] === 2) {
      return <p>Le grand gagnant est {namePlayer2}</p>;
    }
  };

  const displayScores = () => {
    const data: any[] = [...results[1]];
    return (
      <div className="sets-container">
        {data.map((_, i) => (
          <div key={i}>
            <p>Set {i + 1}</p>
            <p>
              {namePlayer1} : {data[i].player1}
            </p>
            <p>
              {namePlayer2} : {data[i].player2}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="form-container">
        <form action="" onSubmit={(e) => preventDefault(e)}>
          <label htmlFor="name-player-1">Nom du joueur 1</label>
          <input
            type="text"
            name="name-player-1"
            value={namePlayer1}
            onChange={updateNamePlayer1}
          />

          <label htmlFor="level-player-1">Niveau du joueur 1</label>
          <select
            name="level-player-1"
            value={levelPlayer1}
            onChange={updateLevelPlayer1}
          >
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
          </select>

          <label htmlFor="name-player-2">Nom du joueur 2</label>
          <input
            type="text"
            name="name-player-2"
            value={namePlayer2}
            onChange={updateNamePlayer2}
          />

          <label htmlFor="level-player-2">Niveau du joueur 2</label>
          <select
            name="level-player-2"
            value={levelPlayer2}
            onChange={updateLevelPlayer2}
          >
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
          </select>
        </form>
      </div>

      {/* Si les noms des joueurs sont inscrits, on peut générer les points */}
      {namePlayer1 && namePlayer2 ? (
        <div className="game-generator">
          <button onClick={generatePoints}>Générer les points</button>

          {gameState.length > 1 ? (
            <div className="points-container">
              {gameState.map((winner: number, index) => (
                <p key={index + 1}>
                  Point {index + 1}: Remporté par
                  {winner === 1 ? (
                    <span> {namePlayer1}</span>
                  ) : (
                    <span> {namePlayer2}</span>
                  )}
                </p>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {/* Récupération des résultats finaux qui s'affiche uniquement si l'on a déjà lancé la partie */}
      {gameState.length > 1 ? (
        <button onClick={getResults}>Récupérer les résultats</button>
      ) : (
        ""
      )}

      {results.length > 1 && namePlayer1 && namePlayer2 ? (
        <div>{displayWinner()}</div>
      ) : (
        ""
      )}
      {results.length > 1 && namePlayer1 && namePlayer2 ? (
        <div className="sets-results">{displayScores()}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
