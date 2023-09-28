export const NON_TOURNAMENT_LOCAL_KEY = "non-tournement-matches";
export const match = {
  toss: {
    team: "",
    choose: "",
  },
  team_1: {
    name: "Team 1",
    players: [],
    TotalScore: 0,
    wickets: 0,
    overs: 0,
  },
  team_2: {
    name: "Team 2",
    players: [],
    TotalScore: 0,
    wickets: 0,
    overs: 0,
  },
};
export const INITIAL_MODEL_DATA = {
  team_1_name: "Team 1",
  team_2_name: "Team 2",
  toss: { team: "", choose: "" },
  overs: 1,
};
export const matchStatus = {
  pending: "pending",
  active: "active",
  done: "done",
};

export const playerStatus = {
  not_out: "Not Out",
  out: "out",
};

export const delivery = {
  w:'W',
  nb: "Nb",
  wd: "Wd",
  lb: "lb",
  bye: "bye",
  legel: "legel",
};
