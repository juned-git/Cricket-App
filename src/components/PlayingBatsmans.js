import { playerStatus } from "../../config";
import { getNonTournamentMatchesFromLocalStorage, setNonTournamentMatchesInLocalStorage } from "./helper";

const PlayingBatsman = (props) => {
  const { playingBatsman, index, firstBattingTeam,setFirstBattingTeam, matchData, setMatchData } = props;
  const out = (i) =>{
    const battingTeam = {...firstBattingTeam};
    battingTeam.batsman[i].status = playerStatus.out;
    battingTeam.wickets = battingTeam.wickets + 1;
    setFirstBattingTeam({...battingTeam});

    const currentMatch = {...matchData}
    if(matchData.team_1.name === firstBattingTeam.name){
        currentMatch.team_1.batsman[i].status = playerStatus.out;
        currentMatch.team_1.wickets = matchData.team_1.wickets + 1 ;
    }else{
        console.log(matchData.team_2);
        currentMatch.team_2.batsman[i].status = playerStatus.out; 
        currentMatch.team_2.wickets = matchData.team_2.wickets + 1 ;
    }
    setMatchData(currentMatch);
    playingBatsman[i].status = playerStatus.out;
    const matches = getNonTournamentMatchesFromLocalStorage();
    matches[index] = {...currentMatch};
    setNonTournamentMatchesInLocalStorage(matches);

    playingBatsman.splice(i,1);
  }
  console.log("playingBatsman", playingBatsman);
  return (
    <div>
            <div className="d-flex justify-content-between mt-2 text-secondary">
              <small>
                Batting
                {playingBatsman[0] ? <div className="text-primary mt-1">{playingBatsman[0].name.toUpperCase()}</div> : ''}
                {playingBatsman[1] ? <div className="text-primary mt-1">{playingBatsman[1].name.toUpperCase()}</div> : ''}
              </small>
              <small>
                R(B)
                {playingBatsman[0] ? <div className="text-dark mt-1">{`${playingBatsman[0].runs}(${playingBatsman[0].balls})`}</div>:''}
                {playingBatsman[1] ? <div className="text-dark mt-1">{`${playingBatsman[1].runs}(${playingBatsman[0].balls})`}</div>:''}
              </small>
              <small>
               4s
                {playingBatsman[0] ? <div className="text-dark mt-1">{playingBatsman[0].fours}</div>:''}
                {playingBatsman[1] ? <div className="text-dark mt-1">{playingBatsman[1].fours}</div>:''}
              </small>
              <small>
               6s
                {playingBatsman[0] ? <div className="text-dark mt-1">{playingBatsman[0].sixes}</div>:''}
                {playingBatsman[1] ? <div className="text-dark mt-1">{playingBatsman[1].sixes}</div>:''}
              </small>
              <small>
                 SR
                {playingBatsman[0] ? <div className="text-dark mt-1">{playingBatsman[0].sr}</div>:''}
                {playingBatsman[1] ? <div className="text-dark mt-1">{playingBatsman[1].sr}</div>:''}
              </small>
              <small>
                Action
                <div>
                  {playingBatsman[0] ? <div><button className="bg-danger mt-1" onClick={()=>{out(0)}}>Out</button></div> :''}
                  {playingBatsman[1] ? <div><button className="bg-danger mt-1" onClick={()=>{out(1)}}>Out</button></div> : ''}
                </div>
              </small>
            </div>
    </div>
  );
};
export default PlayingBatsman;
