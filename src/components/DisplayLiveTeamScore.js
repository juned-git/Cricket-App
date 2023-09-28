
const DisplayLiveTeamScore = (props) => {
    const {battingTeam} = props;
    console.log('batt',props);
  return <div>
  <b>
    {`${battingTeam.name?.toUpperCase()} - ${
      battingTeam.totalScore
    }${
        battingTeam.wickets === 0
        ? ""
        : `/${battingTeam.wickets}`
    } (${battingTeam.overs})`}
  </b>
</div>;
}

export default DisplayLiveTeamScore;