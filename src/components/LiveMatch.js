import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import {
  getFirstBattingTeam,
  getNonTournamentMatchesFromLocalStorage,
  setNonTournamentMatchesInLocalStorage,
} from "./helper";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import PlayingBatsman from "./PlayingBatsmans";
import { matchStatus, playerStatus } from "../../config";

const LiveMatch = () => {
  const [batsmanName, setBatsmanName] = useState("");
  const [matchData, setMatchData] = useState({});
  const [firstBattingTeam, setFirstBattingTeam] = useState({});
  const [playingBatsman, setPlayingBatsman] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { index } = useParams();

  useEffect(() => {
    const matches = getNonTournamentMatchesFromLocalStorage();
    const match = matches[index];
    match.status = matchStatus.active;
    setMatchData(match);
    const firstBatting = getFirstBattingTeam(match);
    setFirstBattingTeam(firstBatting);
    let batsmans = [];
    firstBatting.batsman.forEach((player) => {
      if (player.status === playerStatus.not_out) {
        batsmans.push(player);
      }
    });
    setPlayingBatsman(batsmans);

    return () => {
      match.status = matchStatus.pending;
      matches[index] = match;
      setNonTournamentMatchesInLocalStorage(matches);
    };
  }, []);

  const AddBatsman = () => {
    const batsman = firstBattingTeam.batsman;
    const playerObj = {
      name: batsmanName,
      balls: 0,
      runs: 0,
      sr: 0,
      fours: 0,
      sixes: 0,
      status: playerStatus.not_out,
    };
    batsman.push(playerObj);
    const batsmanToAdd = { ...firstBattingTeam, batsman };
    setFirstBattingTeam({ ...batsmanToAdd });

    const matches = getNonTournamentMatchesFromLocalStorage();

    if ((matches[index].team_1.name = firstBattingTeam.name)) {
      matches[index].team_1 = firstBattingTeam;
      setMatchData({ ...matchData, team_1: { ...batsmanToAdd } });
    } else {
      matches[index].team_2 = firstBattingTeam;
      setMatchData({ ...matchData, team_2: { ...batsmanToAdd } });
    }
    setNonTournamentMatchesInLocalStorage(matches);

    const batsmans = [...playingBatsman];
    batsmans.push(playerObj);
    setPlayingBatsman(batsmans);
    setBatsmanName("");
    handleClose();
  };

  const AddBaller = () => {};

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand className="container d-flex mx-auto">
          <div>
            {matchData.team_1?.name?.toUpperCase()} vs{" "}
            {matchData.team_2?.name?.toUpperCase()}
          </div>
        </Navbar.Brand>
      </Navbar>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Batsman Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Batsman Name: </label>
          <input
            type="text"
            value={batsmanName}
            onChange={(e) => setBatsmanName(e.target.value)}
            className="w-100"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={AddBatsman}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container mt-2">
        <div>
          <b>
            {`${firstBattingTeam.name?.toUpperCase()} - ${
              firstBattingTeam.totalScore
            }${
              firstBattingTeam.wickets === 0
                ? ""
                : `/${firstBattingTeam.wickets}`
            } (${firstBattingTeam.overs})`}
          </b>
        </div>
        <small className="text-secondary">CRR:</small>
        <PlayingBatsman
          playingBatsman={playingBatsman}
          index={index}
          firstBattingTeam={firstBattingTeam}
          setFirstBattingTeam={setFirstBattingTeam}
          matchData={matchData}
          setMatchData={setMatchData}
        />
        <div>
          <div className="text-secondary mt-3 d-flex justify-content-between">
            <small>Bowling</small>
            <small>O</small>
            <small>M</small>
            <small>R</small>
            <small>W</small>
            <small>Select</small>
          </div>
        </div>
        {playingBatsman.length < 2 && firstBattingTeam.wickets < 11 ? (
          <Button className="btn-info mr-2" onClick={handleShow}>
            Add Batsman
          </Button>
        ) : (
          ""
        )}
        <Button className="btn-success" onClick={AddBaller}>
          Add Baller
        </Button>
      </div>
    </div>
  );
};
export default LiveMatch;
