import { useEffect, useState } from "react";
import { BsFillTrashFill, BsFillCaretRightSquareFill } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import {
  AddTeamValidation,
  setTossWinner,
  setTossSelection,
  setNonTournamentMatchesInLocalStorage,
  getNonTournamentMatchesFromLocalStorage,
} from "./helper";
import { INITIAL_MODEL_DATA } from "../../config";

const Home = () => {
  const [nonTournamentMatches, setNonTournamentMatches] = useState([]);
  const [modelData, setModelData] = useState(INITIAL_MODEL_DATA);
  const [show, setShow] = useState(false);
  const [valData, setValData] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const matches = getNonTournamentMatchesFromLocalStorage();
    if (!matches) {
      setNonTournamentMatchesInLocalStorage([]);
    } else {
      setNonTournamentMatches(matches);
    }
  }, []);

  const setTeamNamesTossAndOver = () => {
    const validationData = AddTeamValidation(modelData);
    setValData(validationData);

    if (validationData.validation) {
      const matches = [...nonTournamentMatches];
      const match = {
        overs: 0,
        toss: {
          team: "",
          choose: "",
        },
        team_1: {
          name: "Team 1",
          batsman: [],
          baller:[],
          totalScore: 0,
          wickets: 0,
          overs:0
        },
        team_2: {
          name: "Team 2",
          batsman: [],
          baller:[],
          totalScore: 0,
          wickets: 0,
          overs:0
        },
      };
      match.team_1.name = modelData.team_1_name;
      match.team_2.name = modelData.team_2_name;
      if (modelData.toss.team === "1") {
        match.toss = { ...modelData.toss, team: match.team_1.name };
      } else {
        match.toss = { ...modelData.toss, team: match.team_2.name };
      }
      matches.push(match);
      setNonTournamentMatches(matches);
      setNonTournamentMatchesInLocalStorage(matches);
      handleClose();
      setModelData(INITIAL_MODEL_DATA);
    }
  };
  const AddNewMatch = () => handleShow();

  const handleDeleteMatch = (index) => {
    const matches = [...nonTournamentMatches];
    matches.splice(index, 1);
    setNonTournamentMatches(matches);
    setNonTournamentMatchesInLocalStorage(matches);
  };
  return (
    <div className="container">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Teams Name and Toss</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">{valData.message}</p>
          <label>Team 1 :</label>
          <input
            type="text"
            value={modelData.team_1_name}
            onChange={(e) => {
              const team_1_name = e.target.value;
              setModelData({ ...modelData, team_1_name });
            }}
            className="w-100"
          />
          <label className="mt-2">Team 2 :</label>
          <input
            type="text"
            value={modelData.team_2_name}
            onChange={(e) => {
              const team_2_name = e.target.value;
              setModelData({ ...modelData, team_2_name });
            }}
            className="w-100 "
          />
          <b className="mt-2">Toss Winner</b>
          <div className="d-flex">
            <Form.Check
              label={"Team 1"}
              name="group1"
              type="radio"
              value="1"
              onClick={(e) => setTossWinner(e, modelData, setModelData)}
            />
            <Form.Check
              label={"Team 2"}
              name="group1"
              type="radio"
              value="2"
              className="mx-3"
              onClick={(e) => setTossWinner(e, modelData, setModelData)}
            />
          </div>

          <b className="mt-2">Choose</b>
          <div className="d-flex">
            <Form.Check
              label="Batting"
              name="group2"
              type="radio"
              value="Bat"
              onClick={(e) => setTossSelection(e, modelData, setModelData)}
            />
            <Form.Check
              label="Balling"
              name="group2"
              type="radio"
              className="mx-3"
              value="Ball"
              onClick={(e) => setTossSelection(e, modelData, setModelData)}
            />
          </div>
          <label className="mt-2">Overs</label>
          <input
            type="number"
            min="1"
            max="20"
            value={modelData.overs}
            onChange={(e) => {
              setModelData({ ...modelData, overs: e.target.value });
            }}
            className="w-100 "
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={setTeamNamesTossAndOver}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="mt-3 d-flex  justify-content-between">
        <h3>
          <b>New Match</b>
        </h3>
        <button
          type="button"
          className="btn btn-success font-weight-bold"
          onClick={AddNewMatch}
        >
          +
        </button>
      </div>
      <hr />

      <div className="mt-3">
        {nonTournamentMatches.map((match, index) => {
          return (
            <div key={index} className="mt-2">
              <div className="mx-3 d-flex justify-content-between">
                <span>
                  <b>{index + 1}</b>
                  {match.toss.team !== "" ? (
                    <span className="text-primary mx-2">
                      <small>
                        <mark>{match.toss.team}</mark> won the toss and elected
                        to <mark>{match.toss.choose}</mark> first
                      </small>
                    </span>
                  ) : (
                    ""
                  )}
                </span>
                <BsFillTrashFill
                  className="ml-2 mt-1"
                  onClick={() => handleDeleteMatch(index)}
                />
              </div>
              <div className="mx-5">
                <div>
                  <span>
                    <b>{match.team_1.name.toUpperCase()}</b>
                  </span>
                  <span>
                    {`
                    ${match.team_1.totalScore}
                    ${
                      match.team_1.wickets !== 0
                        ? `/ ${match.team_1.wickets}`
                        : ""
                    }
                    (${match.overs})`}
                  </span>
                </div>
                <div>
                  <span>
                    <b>{match.team_2.name.toUpperCase()}</b>
                  </span>
                  <span>
                    {`
                    ${match.team_2.totalScore}
                    ${
                      match.team_2.wickets !== 0
                        ? `/ ${match.team_2.wickets}`
                        : ""
                    } (${match.overs})`}
                  </span>
                </div>
              </div>

              <Link to={`/live/match/${index}`} className="mx-5">
                Start Match <BsFillCaretRightSquareFill />
              </Link>

              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Home;
