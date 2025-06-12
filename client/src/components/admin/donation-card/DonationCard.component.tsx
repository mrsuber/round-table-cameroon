import { DonationCardTypes } from './MemberCard.type';
import classes from './DonationCard.module.css';
import { months } from '../../../assets/data/months';

const dateMonthIn = new Date().getMonth();
const dateNow = new Date().getDate() + ' ' + months[dateMonthIn] + ' ' + new Date().getFullYear();

const DonationCard = ({
  name = '',
  description,
  amount,
  width,
  height,
  date = dateNow,
  state,
}: DonationCardTypes) => {
  const dateMonth = new Date(date);
  return (
    <div className={classes.container} style={{ width, height }}>
      <div className={classes.top}>
        <h5 className={classes.amount}>{amount}</h5>
        <div className={classes.amount}>XAF</div>
      </div>
      <div style={{ margin: '17px 0' }}>
        <p className={classes.name}>{name}</p>
        <p className={classes.messageText}>{description}</p>
      </div>
      <div className={classes.bottom}>
        <p className={classes.date}>{dateMonth.toDateString()}</p>
        <p className={classes.state} style={{ color: state === 'PENDING' ? '#FDBF47' : '#0ACF83' }}>
          {state}
        </p>
      </div>
    </div>
  );
};

export default DonationCard;
