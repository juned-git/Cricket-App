import { NON_TOURNAMENT_LOCAL_KEY, playerStatus } from "../../config";

export const getFirstBattingTeamName = (match) => {
  return match.toss?.choose === "Bat"
    ? match.toss.team
    : match.toss?.team !== match.team_1.name
    ? match.team_1.name
    : match.team_2.name;
};

export const getFirstBattingTeam = (match) => {
  const battingTeam = getFirstBattingTeamName(match);
  if (match.team_1.name === battingTeam) {
    return match.team_1;
  } else {
    return match.team_2;
  }
};

export const AddTeamValidation = (modelData) => {
  let validation = true;
  let message = "";
  const { team_1_name, team_2_name, toss } = modelData;
  if (team_1_name === "") {
    validation = false;
    message = "please Enter Team 1 Name";
  } else if (team_2_name === "") {
    validation = false;
    message = "please Enter Team 2 Name";
  } else if (toss.team === "") {
    validation = false;
    message = "please select Toss winning Team";
  } else if (toss.choose === "") {
    validation = false;
    message = "please select Batting or Balling";
  }
  return { validation, message };
};

export const setTossWinner = (e, modelData, setModelData) => {
  const toss = { team: e.target.value, ...modelData.toss.choose };
  setModelData({ ...modelData, toss });
};

export const setTossSelection = (e, modelData, setModelData) => {
  const value = e.target.value;
  const toss = { ...modelData.toss, choose: value };
  setModelData({ ...modelData, toss });
};

export const setNonTournamentMatchesInLocalStorage = (matches) => {
  localStorage.setItem(NON_TOURNAMENT_LOCAL_KEY, JSON.stringify(matches));
};
export const getNonTournamentMatchesFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(NON_TOURNAMENT_LOCAL_KEY));
};

export const startOverChecks = (
  firstBattingTeam,
  matchData,
  selectedBaller,
  playingBatsman,
  batsmanOnStrike
) => {
  if (firstBattingTeam.wikets === 10) {
    return { message: "All Out", stopPlay: true };
  } else if (firstBattingTeam.overs === matchData.overs) {
    return { message: "Overs End", stopPlay: true };
  } else if (!selectedBaller.name) {
    return { message: "Please select a baller", stopPlay: true };
  } else if (playingBatsman.length !== 2) {
    return { message: "Please Add a Batsman", stopPlay: true };
  } else if (!batsmanOnStrike.name) {
    return { message: "Please Select a Batsman on Strike", stopPlay: true };
  } else {
    return { message: "", stopPlay: false };
  }
};

export const setWickets = (matches) => {
  matches.forEach((match, index) => {
    let wickets_team_1 = 0;
    let wickets_team_2 = 0;
    match.team_1.batsman.forEach((player, i) => {
      if (player.status === playerStatus.out) {
        wickets_team_1 = wickets_team_1 + 1;
      }
      if (match.team_1.batsman.length - 1 === i) {
        matches[index].team_1.wickets = wickets_team_1;
      }
    });
    match.team_2.batsman.forEach((player, i) => {
      if (player.status === playerStatus.out) {
        wickets_team_2 += 1;
      }
      if (match.team_1.batsman.length - 1 === i) {
        matches[index].team_2.wickets = wickets_team_2;
      }
    });
  });
  return matches;
};

const sumPlayerRuns = (team) => {
  let total = 0;
  team.batsman.forEach((player) => {
    total = player.runs + total;
  });
  return total;
};

const countTotalOvers = (team) => {
  let overs = 0;
  team.baller.forEach((player) => {
    overs = overs + player.overs;
  });
  return overs;
};

export const setTeamTotalAndOvers = (matches) => {
  matches.forEach((match, index) => {
    const team1Total = sumPlayerRuns(match.team_1);
    const team2Total = sumPlayerRuns(match.team_2);
    const team1Overs = countTotalOvers(match.team_1);
    const team2Overs = countTotalOvers(match.team_2);
    matches[index].team_1.totalScore = team1Total;
    matches[index].team_2.totalScore = team2Total;
    matches[index].team_1.overs = team1Overs;
    matches[index].team_2.overs = team2Overs;
  });
  return matches;
};

export const calculateOver = (baller) => {
  let balls = baller.balls;
  if (balls < 6) {
    return Number(`.${balls}`);
  } else {
    const over = parseInt(balls / 6);
    const ball = balls % 6;
    return ball === 0 ? over : Number(`${over}.${ball}`);
  }
};

export const maiden = (baller) => {
  if (baller.over % 6 === 0) {
    return (baller.maiden += 1);
  }
};
export const switchStriker = (
  batsmanOnStrike,
  playingBatsman,
  setBatsmanOnStrike
) => {
  if (batsmanOnStrike.index === playingBatsman[0].index) {
    setBatsmanOnStrike({ ...playingBatsman[1] });
  } else {
    setBatsmanOnStrike({ ...playingBatsman[0] });
  }
};

export const getSecondBattingTeam = (battingTeam, match) => {
  if (battingTeam.name !== match.team_1?.name) {
    return match.team_1;
  } else {
    return match.team_2;
  }
};

const getBallsByOvers = (overs) => {
  return (parseInt(overs) * 6) + ((overs % 1).toFixed(1)*10)
}

export const calulateCrr = (battingTeam) => {
  console.log(battingTeam)
  let balls = getBallsByOvers(battingTeam.overs);
  console.log(balls);
  let crr = 0;
  if(balls !== 0 ){  
    crr = (battingTeam.totalScore / balls).toFixed(2)*6;
  }
  return crr;
}

const getRemainingBalls = (battingTeamOvers,totalOvers) =>{
  const ballsPlayed = getBallsByOvers(battingTeamOvers);
  const balls = getBallsByOvers(totalOvers);
  const remainingBalls = balls - ballsPlayed;
  return remainingBalls;
}

const getRemainingRuns = (battingTeam,firstBattingTeam,secondBattingTeam) =>{
  let scoreToChase = 0;
  if(battingTeam.name !== firstBattingTeam.name){
    scoreToChase = firstBattingTeam.totalScore;
  }else{
    scoreToChase = secondBattingTeam.totalScore;
  }
  return scoreToChase - battingTeam.totalScore;
}

export const calculateRr = (battingTeam,firstBattingTeam,secondBattingTeam,overs) => {
  const remainingBalls = getRemainingBalls(battingTeam.overs,overs);
  const remainingRuns = getRemainingRuns(battingTeam,firstBattingTeam,secondBattingTeam);
  let rr = 0;
  if(rr !== 0){
    rr = (remainingRuns / remainingBalls).toFixed(2)*6;
  }
  return rr;
}

export const getRemainingRunsAndBalls = (battingTeam,firstBattingTeam, secondBattingTeam,matchData) =>{
  const remainingBalls = getRemainingBalls(battingTeam.overs,matchData.overs);
  const remainingRuns = getRemainingRuns(battingTeam,firstBattingTeam,secondBattingTeam);
  return {runs:remainingRuns,balls:remainingBalls}
}

export const getMatchResult = (matchData,firstBattingTeam, secondBattingTeam) => {
  if (matchData.overs === battingTeam.overs) {
    if (firstBattingTeam.totalScore === secondBattingTeam.totalScore) {
     return "Match Tied!!!";
    } else if (firstBattingTeam.totalScore + 1 < secondBattingTeam.totalScore) {
      return `${secondBattingTeam.name} won by ${10 - secondBattingTeam.wickets} wickets`
    } else if (firstBattingTeam.totalScore + 1 > secondBattingTeam.totalScore) {
     return `${firstBattingTeam.name} won by ${firstBattingTeam.totalScore - secondBattingTeam.totalScore} runs`;
    }
  } else if (secondBattingTeam.wickets === 10) {
    return  `${firstBattingTeam.name} won by ${firstBattingTeam.totalScore - secondBattingTeam.totalScore} runs`;
  }else{
    return '';
  }
}