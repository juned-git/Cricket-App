import { useEffect, useState } from "react";
import {calulateCrr,calculateRr} from "./helper"

const RRAndCRR = (props) => {
    const {isSecondInnings,battingTeam, firstBattingTeam, secondBattingTeam, matchData} = props;
    const [Crr,setCrr] = useState(0);
    const [rr,setRr] = useState(0);
    useEffect(()=>{
        setCrr(calulateCrr(battingTeam));
        setRr(calculateRr(battingTeam,firstBattingTeam, secondBattingTeam,matchData.overs));
    },[battingTeam]);

    return <>
    <div><small className="text-secondary">CRR: {Crr}</small></div>
    <div>{isSecondInnings ? <small className="text-secondary">{`RR: ${rr}`}</small>: ''}</div>
    </>
}
export default RRAndCRR;