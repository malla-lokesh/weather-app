const CalculateTime = ({ DateTimeStamp }) => {
  const timeStamp = new Date(DateTimeStamp);

  // extract time components
  const hours = timeStamp.getHours();
  const minutes = timeStamp.getMinutes();

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  // for time which has single digit, we convert to string and add one zero infront of it.

  return <span>{formattedTime}</span>;
};

export default CalculateTime;
