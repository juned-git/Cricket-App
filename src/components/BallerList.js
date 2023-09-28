const BallerList = (props) => {
  const { baller } = props;
  return (
    <div>
      <div className="text-secondary mt-3 d-flex justify-content-between">
        <small>Bowling{baller ? <div className="text-primary">{baller.name?.toUpperCase()}</div>:''}</small>
        <small>O{baller ? <div className="text-dark">{baller.overs}</div>:''}</small>
        <small>M{baller ? <div className="text-dark">{baller.medain}</div>:''}</small>
        <small>R{baller ? <div>{baller.runs}</div>:''}</small>
        <small>W{baller ? <div>{baller.wickets}</div> :''}</small>
      </div>
    </div>
  );
};
export default BallerList;
