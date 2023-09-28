import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import {
  getFirstBattingTeam,
  getNonTournamentMatchesFromLocalStorage,
  setNonTournamentMatchesInLocalStorage,
  startOverChecks,
  getSecondBattingTeam,
  getRemainingRunsAndBalls,
  getMatchResult
} from "./helper";
import Modal from "react-bootstrap/Modal";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Button } from "react-bootstrap";
import PlayingBatsman from "./PlayingBatsmans";
import BallerList from "./BallerList";
import { matchStatus, playerStatus } from "../../config";
import ModelBall from "./ModelBall";
import DisplayLiveTeamScore from "./DisplayLiveTeamScore";
import DisplayInnings from "./DisplayInnings";
import RRAndCRR from "./RRAndCRR";

const LiveMatch = () => {
  const [batsmanName, setBatsmanName] = useState("");
  const [ballerName, setBallerName] = useState("");
  const [matchData, setMatchData] = useState({});
  const [playingBatsman, setPlayingBatsman] = useState([]);
  const [selectedBaller, setBaller] = useState({});
  const [isBatsman, setIsBatsman] = useState(true);
  const [batsmanOnStrike, setBatsmanOnStrike] = useState({});
  const [ballingChecks, setballingChecks] = useState(false);
  const [isSecondInnings, setIsSecondInnings] = useState(false);

  const [battingTeam, setBattingTeam] = useState({});
  const [firstBattingTeam, setFirstBattingTeam] = useState({});
  const [secondBattingTeam, setSecondBattingTeam] = useState({});

  const [remainingRunsAndBalls, setRemainingRunsAndBalls] = useState({
    runs: 0,
    balls: 0,
  });
  const [result, setResult] = useState("");

  const [show, setShow] = useState(false);
  const [showBallModel, setShowBallModel] = useState(false);

  const { index } = useParams();

  const handleBallModelClose = () => setShowBallModel(false);
  const handleBallModelShow = () => setShowBallModel(true);

  const handleClose = () => {
    setShow(false);
    setIsBatsman(true);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (battingTeam.name === firstBattingTeam.name) {
      setFirstBattingTeam({ ...battingTeam });
    } else {
      setSecondBattingTeam({ ...battingTeam });
    }
  }, [battingTeam]);

  useEffect(() => {
    if (
      (battingTeam.overs === matchData.overs || battingTeam.wickets === 10) &&
      battingTeam.name === firstBattingTeam.name
    ) {
      const secondBattingTeam = getSecondBattingTeam(battingTeam, matchData);
      setBattingTeam({ ...secondBattingTeam });
      setBatsmanName("");
      setBallerName("");
      setPlayingBatsman([]);
      setBaller({});
      setIsBatsman(true);
      setBatsmanOnStrike({});
      setballingChecks(false);
    }
    if (isSecondInnings) {
      setRemainingRunsAndBalls(
        getRemainingRunsAndBalls(
          battingTeam,
          firstBattingTeam,
          secondBattingTeam,
          matchData
        )
      );
    }
   
    const res = getMatchResult(matchData,firstBattingTeam, secondBattingTeam);
    if(res === ''){
      const matches = getNonTournamentMatchesFromLocalStorage();
      const match = matches[index];
      match.status = matchStatus.done;
      setMatchData({...match});
      setNonTournamentMatchesInLocalStorage(matches);
    }
  }, [battingTeam]);

  useEffect(() => {
    const matches = getNonTournamentMatchesFromLocalStorage();
    const match = matches[index];
    match.status = matchStatus.active;
    setMatchData(match);

    let battingTeam = getFirstBattingTeam(match);
    if (battingTeam.overs === match.overs || battingTeam.wickets === 10) {
      battingTeam = getSecondBattingTeam(battingTeam, match);
      setIsSecondInnings(true);
    }
    setFirstBattingTeam({ ...battingTeam });
    setSecondBattingTeam(getSecondBattingTeam(battingTeam, match));
    setBattingTeam(battingTeam);

    let batsmans = [];
    battingTeam.batsman.forEach((player, i) => {
      if (player.status === playerStatus.not_out) {
        batsmans.push({
          team_name: battingTeam.name,
          index: i,
          ...player,
        });
      }
    });
    setPlayingBatsman(batsmans);

    return () => {
      match.status = matchStatus.pending;
      matches[index] = match;
      setNonTournamentMatchesInLocalStorage(matches);
    };
  }, []);

  const AddBaller = () => {
    if (ballerName === "") {
      return;
    }
    const ballers = battingTeam.baller;
    const baller = {
      name: ballerName,
      overs: 0,
      balls: 0,
      medain: 0,
      runs: 0,
      wickets: 0,
      isSelected: false,
    };
    ballers.push(baller);
    const updatedMatch = { ...battingTeam, baller: ballers };
    setBattingTeam(updatedMatch);

    const matches = getNonTournamentMatchesFromLocalStorage();

    if ((matches[index].team_1.name = battingTeam.name)) {
      matches[index].team_1.baller = [...ballers];
      setMatchData({ ...matches[index] });
    } else {
      matches[index].team_2.baller = [...ballers];
      setMatchData({ ...matches[index] });
    }
    setNonTournamentMatchesInLocalStorage(matches);
    setBallerName("");
    handleClose();
  };

  const selectABaller = (i) => {
    const baller = battingTeam.baller[i];
    setBaller({ ...baller, index: i, team_name: setBattingTeam.name });
  };

  const AddBatsman = () => {
    if (batsmanName === "") {
      return;
    }
    const batsman = battingTeam.batsman;
    const i = battingTeam.batsman.length;
    const playerObj = {
      team_name: battingTeam.name,
      name: batsmanName,
      balls: 0,
      runs: 0,
      sr: 0,
      fours: 0,
      sixes: 0,
      status: playerStatus.not_out,
      outDetail: { outBy: "", outType: "" },
      index: i,
    };
    batsman.push(playerObj);
    const batsmanToAdd = { ...battingTeam, batsman };
    setBattingTeam({ ...batsmanToAdd });

    const matches = getNonTournamentMatchesFromLocalStorage();

    if ((matches[index].team_1.name = battingTeam.name)) {
      matches[index].team_1 = battingTeam;
      setMatchData({ ...matchData, team_1: { ...batsmanToAdd } });
    } else {
      matches[index].team_2 = battingTeam;
      setMatchData({ ...matchData, team_2: { ...batsmanToAdd } });
    }
    setNonTournamentMatchesInLocalStorage(matches);

    const batsmans = [...playingBatsman];
    batsmans.push(playerObj);
    setPlayingBatsman(batsmans);
    setBatsmanName("");
    handleClose();
  };

  const startOver = () => {
    const res = startOverChecks(
      battingTeam,
      matchData,
      selectedBaller,
      playingBatsman,
      batsmanOnStrike
    );
    setballingChecks(res);
    if (!res.stopPlay) {
      handleBallModelShow();
    }
  };

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand className="container d-flex mx-auto">
          <div>
            {`${matchData.team_1?.name?.toUpperCase()} vs ${matchData.team_2?.name?.toUpperCase()} (${
              matchData.overs
            })`}
          </div>
        </Navbar.Brand>
      </Navbar>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isBatsman ? "Enter Batsman Name" : "Enter Baller Name"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>{isBatsman ? "Batsman Name: " : "Baller Name: "}</label>
          <input
            type="text"
            value={isBatsman ? batsmanName : ballerName}
            onChange={(e) =>
              isBatsman
                ? setBatsmanName(e.target.value)
                : setBallerName(e.target.value)
            }
            className="w-100"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={isBatsman ? AddBatsman : AddBaller}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container mt-2">
        <DisplayInnings isSecondInnings={isSecondInnings} />

        <div className="my-2">
          <small className="bg-danger text-white">
            <b>{ballingChecks.stopPlay ? ballingChecks.message : ""}</b>
          </small>
        </div>

        {isSecondInnings ? (
          <DisplayLiveTeamScore battingTeam={secondBattingTeam} />
        ) : (
          ""
        )}

        <DisplayLiveTeamScore battingTeam={firstBattingTeam} />

        {!result ? (
          <RRAndCRR
            isSecondInnings={isSecondInnings}
            battingTeam={battingTeam}
            firstBattingTeam={firstBattingTeam}
            secondBattingTeam={secondBattingTeam}
            matchData={matchData}
          />
        ) : (
          ""
        )}

        {isSecondInnings && !result ? (
          <div className="mb-2">
            <small>{`Require ${remainingRunsAndBalls.runs} runs in ${remainingRunsAndBalls.balls} ball`}</small>
          </div>
        ) : (
          ""
        )}

        {result ? (
          <div className="text-success">
            <b>{result.toUpperCase()}</b>
          </div>
        ) : (
          ""
        )}

        {!result ? (
          <>
            <PlayingBatsman
              playingBatsman={playingBatsman}
              setPlayingBatsman={setPlayingBatsman}
              index={index}
              battingTeam={battingTeam}
              setBattingTeam={setBattingTeam}
              matchData={matchData}
              setMatchData={setMatchData}
              batsmanOnStrike={batsmanOnStrike}
              setBatsmanOnStrike={setBatsmanOnStrike}
            />
            <BallerList baller={selectedBaller} />
            {playingBatsman.length < 2 && battingTeam.wickets < 10 ? (
              <Button className="btn-info mx-1 mt-2" onClick={handleShow}>
                Add Batsman
              </Button>
            ) : (
              ""
            )}
            <Button
              className="btn-warning mt-2"
              onClick={() => {
                handleShow();
                setIsBatsman(false);
              }}
            >
              Add Baller
            </Button>
            <DropdownButton
              as={ButtonGroup}
              key="Secondary"
              id={`dropdown-variants-Secondary`}
              variant="secondary"
              title={`Baller List - ${battingTeam.baller?.length} `}
              className="mt-2 mx-1"
            >
              {battingTeam.baller?.map((player, i) => {
                return (
                  <Dropdown.Item
                    eventKey="1"
                    key={i}
                    onClick={() => selectABaller(i)}
                  >
                    {player.name} - {player.overs}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            <Button variant="success" className="mt-2" onClick={startOver}>
              Start Over
            </Button>
            <ModelBall
              showBallModel={showBallModel}
              handleBallModelClose={handleBallModelClose}
              handleBallModelShow={handleBallModelShow}
              batsmanOnStrike={batsmanOnStrike}
              setBatsmanOnStrike={setBatsmanOnStrike}
              selectedBaller={selectedBaller}
              setBaller={setBaller}
              playingBatsman={playingBatsman}
              setPlayingBatsman={setPlayingBatsman}
              battingTeam={battingTeam}
              setBattingTeam={setBattingTeam}
              matchData={matchData}
              setMatchData={setMatchData}
              index={index}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default LiveMatch;
