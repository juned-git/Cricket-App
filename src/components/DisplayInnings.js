const DisplayInnings = (props) => {
    const {isSecondInnings} = props;
    return <div><small className="text-danger">{isSecondInnings ? 'Second innings' : 'First Innings'}</small></div>
}
export default DisplayInnings;