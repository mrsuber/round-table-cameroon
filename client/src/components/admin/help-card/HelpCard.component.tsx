import Button from '../button/Button.component';
import classes from './HelpCard.module.css';

const HelpCard = () => {
  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <div className={classes.helpIcon}>
          <div className={classes.helpIconInset}>?</div>
        </div>
        <div className={classes.texts}>
          <h5>Help Center</h5>
          <p>Having Trouble in understanding?. Please contact us for more questions.</p>
        </div>
        <Button
          text='Help Center'
          bgColor='#fff'
          color='#00262A'
          textStyle={{ fontSize: '10px' }}
          padding='7px'
          width='90%'
        />
      </div>
    </div>
  );
};

export default HelpCard;
