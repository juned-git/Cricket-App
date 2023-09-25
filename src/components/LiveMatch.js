import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {getBattingTeam,getOvers} from "./helper";

const LiveMatch = () => {
  const [matchData, setMatchData] = useState({});
  const [battingTeam,setBattingTeam] =useState();
  const [overs,setOvers] = useState(0);
  const { index } = useParams();
  useEffect(() => {
    const matches = JSON.parse(localStorage.getItem("non-tournement-matches"));
    const match = matches[index];
    setBattingTeam(getBattingTeam(match))
    setOvers(getOvers(index,matches));
    setMatchData(match);
  }, []);
  return (
    <div>
      <h3>Batting : {battingTeam} {overs}</h3>
    </div>
  );
};
export default LiveMatch;
