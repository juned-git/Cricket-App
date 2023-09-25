import { useEffect, useState } from "react";
import { BsFillTrashFill, BsFillCaretRightSquareFill } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { AddTeamValidation } from "./helper";

const Home = () => {
  const [nonTournamentMatches, setNonTournamentMatches] = useState([]);
  const [team_1_Name, setTeam_1_Name] = useState("Team 1");
  const [team_2_Name, setTeam_2_Name] = useState("Team 2");
  const [toss, setToss] = useState({ team: "", choose: "" });
  const [show, setShow] = useState(false);
  const [valData, setValData] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const matches = localStorage.getItem("non-tournement-matches");
    console.log(matches);
    if (!matches) {
      localStorage.setItem("non-tournement-matches", JSON.stringify([]));
    } else {
      setNonTournamentMatches(JSON.parse(matches));
    }
  }, []);

  const setTeamNamesAndToss = () => {
    const validationData = AddTeamValidation({
      team_1_Name,
      team_2_Name,
      toss,
    });
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
          players: [],
          TotalScore: 0,
          wickets: 0,
        },
        team_2: {
          name: "Team 2",
          players: [],
          TotalScore: 0,
          wickets: 0,
        },
      };
      match.team_1.name = team_1_Name;
      match.team_2.name = team_2_Name;
      match.toss = { ...toss };
      matches.push(match);
      setNonTournamentMatches(matches);
      localStorage.setItem("non-tournement-matches", JSON.stringify(matches));
      handleClose();
      setTeam_1_Name("Team 1");
      setTeam_2_Name("Team 2");
      setToss({ team: "", choose: "" });
    }
  };
  const AddNewMatch = () => handleShow();

  const handleDeleteMatch = (index) => {
    const matches = [...nonTournamentMatches];
    matches.splice(index, 1);
    setNonTournamentMatches(matches);
    localStorage.setItem("non-tournement-matches", JSON.stringify(matches));
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
            required
            type="text"
            value={team_1_Name}
            onChange={(e) => setTeam_1_Name(e.target.value)}
            className="w-100"
          />
          <label className="mt-2">Team 2 :</label>
          <input
            required
            type="text"
            value={team_2_Name}
            onChange={(e) => setTeam_2_Name(e.target.value)}
            className="w-100 "
          />
          <b className="mt-2">Toss Winner</b>
          <div className="d-flex">
            <Form.Check
              required
              label={team_1_Name}
              name="group1"
              type="radio"
              value={team_1_Name}
              onClick={(e) => setToss({ ...toss, team: e.target.value })}
            />
            <Form.Check
              required
              label={team_2_Name}
              name="group1"
              type="radio"
              value={team_2_Name}
              className="mx-3"
              onClick={(e) => setToss({ ...toss, team: e.target.value })}
            />
          </div>

          <b className="mt-2">Choose</b>
          <div className="d-flex">
            <Form.Check
              required
              label="Batting"
              name="group2"
              type="radio"
              value="Bat"
              onClick={(e) => setToss({ ...toss, choose: e.target.value })}
            />
            <Form.Check
              required
              label="Balling"
              name="group2"
              type="radio"
              className="mx-3"
              value="Ball"
              onClick={(e) => setToss({ ...toss, choose: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={setTeamNamesAndToss}>
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
                    <b>{match.team_1.name}</b>
                  </span>
                  <span>
                    {`
                    ${match.team_1.TotalScore}
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
                    <b>{match.team_2.name}</b>
                  </span>
                  <span>
                    {`
                    ${match.team_2.TotalScore}
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
