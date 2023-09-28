import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { delivery } from "../../config";
import {
  calculateOver,
  getNonTournamentMatchesFromLocalStorage,
  setNonTournamentMatchesInLocalStorage,
  switchStriker,
} from "./helper";

const ModelBall = (props) => {
  const {
    showBallModel,
    handleBallModelClose,
    handleBallModelShow,
    batsmanOnStrike,
    setBatsmanOnStrike,
    selectedBaller,
    setBaller,
    playingBatsman,
    setPlayingBatsman,
    battingTeam,
    setBattingTeam,
    matchData,
    setMatchData,
    index,
  } = props;
  const [ballRes, setBallRes] = useState({ runs: 0, delivery: "legel", w: "" });

  const saveResult = () => {
    if (ballRes.delivery === delivery.legel) {
      // Updating Striker Batsman

      const striker = { ...batsmanOnStrike };
      striker.runs = batsmanOnStrike.runs + ballRes.runs;
      striker.balls += 1;
      if (ballRes.runs === 4) {
        striker.fours += 1;
      } else if (ballRes.runs === 6) {
        striker.sixes += 1;
      }
      striker.sr = parseInt((striker.runs / striker.balls) * 100);
      setBatsmanOnStrike(striker);

      // Updating Selected Baller

      const baller = { ...selectedBaller };
      baller.runs = selectedBaller.runs + ballRes.runs;
      baller.balls += 1;
      baller.overs = calculateOver(baller);
      setBaller({ ...baller });

      // Updating 2 Playing Batsmans

      playingBatsman.forEach((batsman, ind) => {
        if (batsman.index === batsmanOnStrike.index) {
          const playingPlayer = [...playingBatsman];
          playingPlayer[ind] = { ...striker };
          setPlayingBatsman(playingPlayer);
        }
      });
      if (ballRes.runs === 1 || ballRes.runs === 3) {
        switchStriker(batsmanOnStrike, playingBatsman, setBatsmanOnStrike);
      }

      if (baller.balls % 6 === 0) {
        switchStriker(batsmanOnStrike, playingBatsman, setBatsmanOnStrike);
      }

      // Update Current Team Object

      const currentTeam = { ...battingTeam };
      currentTeam.batsman[striker.index] = { ...striker };
      currentTeam.baller[baller.index] = { ...baller };

      let overs = 0;
      currentTeam.baller.forEach((player) => {
        overs = overs + player.overs;
      });

      let total = 0;
      currentTeam.batsman.forEach((player) => {
        total = total + player.runs;
      });

      currentTeam.overs = overs;
      currentTeam.totalScore = total;
      setBattingTeam({...currentTeam})
      // Updating Current Match Object

      const match = { ...matchData };
      if (match.team_1.name === currentTeam.name) {
        match.team_1 = { ...currentTeam };
      } else {
        match.team_2 = { ...currentTeam };
      }
      setMatchData(match);

      // Updating Local Storage

      const matches = getNonTournamentMatchesFromLocalStorage();
      matches[index] = { ...match };
      setNonTournamentMatchesInLocalStorage(matches);
      handleBallModelClose();
    }
  };

  const radioButtonHandler = (e) => {
    setBallRes({ ...ballRes, delivery: e.target.value });
  };
  return (
    <Modal show={showBallModel} onHide={handleBallModelClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Ball Result: </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between">
          <Form.Check
            label={delivery.legel}
            name="extra"
            type="radio"
            value={delivery.legel}
            onClick={radioButtonHandler}
          />
          <Form.Check
            label={delivery.wd}
            name="extra"
            type="radio"
            value={delivery.wd}
            onClick={radioButtonHandler}
          />
          <Form.Check
            label={delivery.nb}
            name="extra"
            type="radio"
            value={delivery.nb}
            onClick={radioButtonHandler}
          />
          <Form.Check
            label={delivery.lb}
            name="extra"
            type="radio"
            value={delivery.lb}
            onClick={radioButtonHandler}
          />
          <Form.Check
            label={delivery.bye}
            name="extra"
            type="radio"
            value={delivery.bye}
            onClick={radioButtonHandler}
          />

          <Form.Check
            label={delivery.w}
            type="checkbox"
            value={delivery.w}
            onClick={(e) => {
              if (e.target.checked) {
                setBallRes({ ...ballRes, w: delivery.w });
              } else {
                setBallRes({ ...ballRes, w: "" });
              }
            }}
          />
        </div>
        <label>Enter Runs: </label>
        <input
          type="number"
          step="1"
          value={ballRes.runs}
          min="0"
          onChange={(e) => {
            const runs = Number(parseInt(e.target.value));
            setBallRes({ ...ballRes, runs });
          }}
          className="w-100"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleBallModelClose}>
          Close
        </Button>
        <Button variant="primary" onClick={saveResult}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModelBall;
