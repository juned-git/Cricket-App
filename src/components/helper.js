import {NON_TOURNAMENT_LOCAL_KEY} from "../../config";

export const getFirstBattingTeamName = (match) => {
  return (match.toss?.choose === "Bat"
      ? match.toss.team
      : match.toss?.team !== match.team_1.name
      ? match.team_1.name
      : match.team_2.name);
};

export const getFirstBattingTeam = (match) =>{
    const battingTeam = getFirstBattingTeamName(match);
      if(match.team_1.name === battingTeam){
        return match.team_1;
      }else{
        return match.team_2;
      }
}

export const AddTeamValidation = (modelData) => {
    let validation = true;
    let message = ''
    const {team_1_name,team_2_name,toss} = modelData;
    if(team_1_name === ''){
        validation = false;
        message = 'please Enter Team 1 Name';
    }else if(team_2_name === ''){
        validation = false;
        message = 'please Enter Team 2 Name';
    }else if(toss.team === ''){
        validation = false;
        message = 'please select Toss winning Team';
    }else if(toss.choose === ''){
        validation = false;
        message = 'please select Batting or Balling'
    }
    return {validation,message}
}

export const setTossWinner = (e,modelData,setModelData) => {
    const toss = {team:e.target.value,...modelData.toss.choose}
    setModelData({...modelData,toss})
}

export const setTossSelection = (e,modelData,setModelData) => {
    const value = e.target.value;
    const toss = {...modelData.toss,choose:value};
    setModelData({...modelData,toss});
}

export const setNonTournamentMatchesInLocalStorage = (matches) => {
    localStorage.setItem(NON_TOURNAMENT_LOCAL_KEY, JSON.stringify(matches))
}
export const getNonTournamentMatchesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(NON_TOURNAMENT_LOCAL_KEY));
}