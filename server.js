const express = require("express"); // Importer Express
const cors = require("cors"); // Pour contourner le CORS POLICY

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // CORS POLICY

app.post("/game-result", (req, res) => {
  const results = getResults(req.body);
  res.json(results);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const getResults = (data) => {
  let weHaveAWinner = 0;
  let setsResult = [];
  const POINTS = [0, 15, 30, 40, "ADV"];

  let currentGame = {
    pointsScore: [0, 0],
    setScore: [0, 0],
    currentSet: 0,
    gameScore: [0, 0],
  };

  for (let i = 0; i < data.length; i++) {
    const player = data[i];
    // PLAYER 1 CONDITIONS

    // EN CAS DE DRAW 40 / 40
    if (
      player === 1 &&
      currentGame.pointsScore[0] === 40 &&
      currentGame.pointsScore[1] === 40
    ) {
      currentGame.pointsScore[0] =
        POINTS[POINTS.indexOf(currentGame.pointsScore[0]) + 1];
    }

    // EN CAS DE DRAW 40 / ADV
    if (
      player === 1 &&
      currentGame.pointsScore[0] === 40 &&
      currentGame.pointsScore[1] !== 40 &&
      currentGame.pointsScore[1] === "ADV"
    ) {
      currentGame.pointsScore[0] = "ADV";
      currentGame.pointsScore[1] = 40;
    }

    // EN CAS DE DRAW ADV / 40 ou EN CAS DE 40 / inférieur à 40 ou différent d'ADV
    if (
      (player === 1 &&
        currentGame.pointsScore[0] === "ADV" &&
        currentGame.pointsScore[1] === 40) ||
      (player === 1 &&
        currentGame.pointsScore[0] === 40 &&
        currentGame.pointsScore[1] < 40 &&
        currentGame.pointsScore[1] !== "ADV") ||
      (player === 1 &&
        currentGame.pointsScore[0] === "ADV" &&
        currentGame.pointsScore[1] < 40 &&
        currentGame.pointsScore[1] !== "ADV")
    ) {
      // REMISE A NIVEAU DES SCORES
      currentGame.pointsScore[0] = 0;
      currentGame.pointsScore[1] = 0;
      currentGame.setScore[0] = currentGame.setScore[0] + 1;

      // EN CAS DE SCORE A 6 et SI DIFFERENTIEL DE 2 POINTS
      if (
        currentGame.setScore[0] >= 6 &&
        currentGame.setScore[0] - currentGame.setScore[1] >= 2
      ) {
        currentGame.gameScore[0] = currentGame.gameScore[0] + 1;
        setsResult.push({
          player1: currentGame.setScore[0],
          player2: currentGame.setScore[1],
        });

        // REMISE A ZERO DES SETS
        currentGame.setScore[0] = 0;
        currentGame.setScore[1] = 0;
      }

      // SI ON ARRIVE A 3 SETS GAGNES ON BREAK
      if (currentGame.gameScore[0] === 3) {
        weHaveAWinner = 1;
        break;
      }
    }

    // SIMPLE AUGMENTATION DE POINTS
    if (
      player === 1 &&
      currentGame.pointsScore[0] < 40 &&
      currentGame.pointsScore[1] !== "ADV" &&
      currentGame.pointsScore[1] < 40
    ) {
      currentGame.pointsScore[0] =
        POINTS[POINTS.indexOf(currentGame.pointsScore[0]) + 1];
    }

    // PLAYER 2 CONDITIONS

    // EN CAS DE DRAW 40 / 40
    if (
      player === 2 &&
      currentGame.pointsScore[1] === 40 &&
      currentGame.pointsScore[0] === 40
    ) {
      currentGame.pointsScore[1] =
        POINTS[POINTS.indexOf(currentGame.pointsScore[1]) + 1];
    }

    // EN CAS DE DRAW 40 / ADV
    if (
      player === 2 &&
      currentGame.pointsScore[1] === 40 &&
      currentGame.pointsScore[0] !== 40 &&
      currentGame.pointsScore[0] === "ADV"
    ) {
      currentGame.pointsScore[1] = "ADV";
      currentGame.pointsScore[0] = 40;
    }

    // EN CAS DE VICTOIRE ADV / 40, ou 40 / inférieur à 40 ou différent d'ADV
    if (
      (player === 2 &&
        currentGame.pointsScore[1] === "ADV" &&
        currentGame.pointsScore[0] === 40) ||
      (player === 2 &&
        currentGame.pointsScore[1] === 40 &&
        currentGame.pointsScore[0] < 40 &&
        currentGame.pointsScore[0] !== "ADV") ||
      (player === 2 &&
        currentGame.pointsScore[1] === "ADV" &&
        currentGame.pointsScore[0] < 40 &&
        currentGame.pointsScore[0] !== "ADV")
    ) {
      // REMISE A NIVEAU DES SCORES
      currentGame.pointsScore[0] = 0;
      currentGame.pointsScore[1] = 0;
      currentGame.setScore[1] = currentGame.setScore[1] + 1;

      // EN CAS DE SCORE A 6 et SI DIFFERENTIEL DE 2 POINTS
      if (
        currentGame.setScore[1] >= 6 &&
        currentGame.setScore[1] - currentGame.setScore[0] >= 2
      ) {
        currentGame.gameScore[1] = currentGame.gameScore[1] + 1;
        setsResult.push({
          player1: currentGame.setScore[0],
          player2: currentGame.setScore[1],
        });

        // REMISE A ZERO DES SETS
        currentGame.setScore[0] = 0;
        currentGame.setScore[1] = 0;
      }

      // SI ON ARRIVE A 3 SETS GAGNES ON BREAK
      if (currentGame.gameScore[1] === 3) {
        weHaveAWinner = 2;
        break;
      }
    }

    // SIMPLE AUGMENTATION DE POINTS
    if (
      player === 2 &&
      currentGame.pointsScore[1] < 40 &&
      currentGame.pointsScore[0] !== "ADV" &&
      currentGame.pointsScore[0] < 40
    ) {
      currentGame.pointsScore[1] =
        POINTS[POINTS.indexOf(currentGame.pointsScore[1]) + 1];
    }
  }

  if (weHaveAWinner === 0) {
    setsResult.push({
      player1: currentGame.setScore[0],
      player2: currentGame.setScore[1],
    });
  }

  const finalResult = [weHaveAWinner, setsResult];

  return finalResult;
};
