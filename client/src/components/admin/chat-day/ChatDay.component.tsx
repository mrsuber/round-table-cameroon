import classes from './ChatDay.module.css';

interface dayProps {
  day?: string;
}

const ChatDay = ({ day }: dayProps) => {
  return <div className={classes.container}>{day}</div>;
};

export default ChatDay;
