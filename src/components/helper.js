export const getBattingTeam = (match) => {
  return (match.toss?.choose === "Bat"
      ? match.toss.team
      : match.toss?.team !== match.team_1.name
      ? match.team_1.name
      : match.team_2.name);
};
export const getOvers = (index,matches) => {
    let overs = matches[index].overs;
    if(overs > 0){
        return overs;
    }
    overs = prompt("Enter Overs", 10);
    overs = Number(overs);
    if(isNaN(overs) || overs <=0 ){
        overs = prompt("Enter Overs", 10);
    }
    matches[index].overs = overs;
    localStorage.setItem("non-tournement-matches",JSON.stringify(matches));
    return overs;
}

export const AddTeamValidation = (obj) => {
    let validation = true;
    let message = ''
    const {team_1_Name,team_2_Name,toss} = obj;
    if(team_1_Name === ''){
        validation = false;
        message = 'please Enter Team 1 Name';
    }else if(team_2_Name === ''){
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