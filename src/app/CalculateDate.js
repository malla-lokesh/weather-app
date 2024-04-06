const CalculateDate = ({ DateTimeStamp }) => {
  const timeStamp = new Date(DateTimeStamp);

  // extract date components
  const year = timeStamp.getFullYear();
  const month = timeStamp.getMonth() + 1; // as it is 0-indexed
  const day = timeStamp.getDate();

  const formattedDate = `${day.toString().padStart(2, "0")}-${month
    .toString()
    .padStart(2, "0")}-${year}`;
  // for months which has single digit, we convert to string and add one zero infront of it.

  return <span>{formattedDate}</span>;
};

export default CalculateDate;
