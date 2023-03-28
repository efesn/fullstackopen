import { useState } from 'react'

const Display = props => <div>{props.value}</div>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ text, value }) => (
  <p>
    {text}: {value}
  </p>
);

const Statistics = (props) => {

  if (props.total === 0) {
    return <div>No feedback given</div>;
  }

  return (
    <table>
      
      <tbody>
        <tr>
          <td>Good</td>
          {/* || 'N/A' for the fix some warning*/}
          <td>{props.good || 'N/A'}</td>
        </tr>
        <tr>
          <td>Neutral</td>
          <td>{props.neutral || 'N/A'}</td>
        </tr>
        <tr>
          <td>Bad</td>
          <td>{props.bad || 'N/A'}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td>{props.total || 'N/A'}</td>
        </tr>
        <tr>
          <td>Average</td>
          <td>{props.average || 'N/A'}</td>
        </tr>
        <tr>
          <td>Good Average</td>
          <td>{props.positive || 'N/A'}</td>
        </tr>
      </tbody>
    </table>
  );
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1)
    incrementTotal();
    calculateAverage();
    calculatePositive();
  }
  
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    incrementTotal();
    calculateAverage();
    calculatePositive();
  }
  
  const handleBadClick = () => {
    setBad(bad + 1)
    incrementTotal();
    calculateAverage();
    calculatePositive();
  }

  const incrementTotal = () => {
    setTotal(total + 1)
  }

  const calculateAverage = () => {
    if (total > 0) {
      setAverage((good * 1 + bad * -1) / total);
    }
    else {
      setAverage(0);
    }
  };

  const calculatePositive = () => {
    setPositive((good / total) * 100);
  }

  return (
    <div>

      <h1>Give Feedback</h1>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
      
      <h1>Statistics</h1>
      <Statistics
        good={good}
        neutral={neutral} 
        bad={bad} 
        total={total} 
        average={average} 
        positive={positive} />
      
    </div>
  )
}
export default App