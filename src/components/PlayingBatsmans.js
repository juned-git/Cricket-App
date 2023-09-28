import { useEffect } from "react";
import { playerStatus } from "../../config";
import { getNonTournamentMatchesFromLocalStorage, setNonTournamentMatchesInLocalStorage } from "./helper";

const PlayingBatsman = (props) => {
  const { playingBatsman,setPlayingBatsman, index, firstBattingTeam,setFirstBattingTeam, matchData, setMatchData, batsmanOnStrike,setBatsmanOnStrike } = props;
  useEffect(()=>{
    if(!batsmanOnStrike){
      setBatsmanOnStrike({...playingBatsman[0]});
    }
  },[]);
  const out = (i) =>{
    if(playingBatsman.length !== 2){
       return
    }
    const battingTeam = {...firstBattingTeam};
    battingTeam.batsman[i].status = playerStatus.out;
    battingTeam.wickets = battingTeam.wickets + 1;
    setFirstBattingTeam({...battingTeam});

    const currentMatch = {...matchData}
    if(matchData.team_1.name === firstBattingTeam.name){
        currentMatch.team_1.batsman[i].status = playerStatus.out;
        currentMatch.team_1.wickets = matchData.team_1.wickets + 1 ;
    }else{
        currentMatch.team_2.batsman[i].status = playerStatus.out; 
        currentMatch.team_2.wickets = matchData.team_2.wickets + 1 ;
    }
    setMatchData(currentMatch);

    playingBatsman[i].status = playerStatus.out;
    const matches = getNonTournamentMatchesFromLocalStorage();
    matches[index] = {...currentMatch};
    setNonTournamentMatchesInLocalStorage(matches);

    const batsmans = playingBatsman
    batsmans.splice(i,1);
    setPlayingBatsman(batsmans);
    setBatsmanOnStrike({});
  }

  const setBatsmanStrike = (i) => {
    setBatsmanOnStrike(playingBatsman[i])
  } 
  return (
    <div>
            <div className="d-flex justify-content-between mt-2 text-secondary">
              <small>
                Batting
                {playingBatsman[0] ? <div className="text-primary mt-1" onClick={()=>setBatsmanStrike(0)}>{playingBatsman[0].name?.toUpperCase()}{batsmanOnStrike.name === playingBatsman[0].name?'*':''}</div> : ''}
                {playingBatsman[1] ? <div className="text-primary mt-1" onClick={()=>setBatsmanStrike(1)}>{playingBatsman[1].name?.toUpperCase()}{batsmanOnStrike.name === playingBatsman[1].name?'*':''}</div> : ''}
              </small>
              <small>
                R(B)
                {playingBatsman[0] ? <div className="text-dark mt-1">{`${playingBatsman[0].runs}(${playingBatsman[0].balls})`}</div>:''}
                {playingBatsman[1] ? <div className="text-dark mt-1">{`${playingBatsman[1].runs}(${playingBatsman[1].balls})`}</div>:''}
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
            </div>
    </div>
  );
};
export default PlayingBatsman;
