import { useState } from 'react';
import { timeFormat } from '../../../assets/data/timeFormat';
import { CircleGreenIcon } from '../../../assets/svg';
import CircleGreyIcon from '../../../assets/svg/CircleGreyIcon';
import classes from './TimeZone.module.css';

interface timeZoneTypes {
  handleOption?: (item: string) => void;
}

const TimeZone = ({ handleOption = () => '' }: timeZoneTypes) => {
  const [active, setActive] = useState<string>('24 Hours');
  return (
    <div className={classes.container}>
      <span style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '13px' }}>
        Time Format
      </span>
      <div className={classes.formats}>
        {timeFormat?.map((f: any, index) => (
          <div
            className={
              f.format === active
                ? `${classes.formatItem} ${classes.formatItemActive}`
                : `${classes.formatItem}`
            }
            style={{ margin: index === 0 ? '0 8px 0 0' : '0 0 0 8px' }}
            key={f.id}
            onClick={() => {
              setActive(f.format);
              handleOption(f.format);
            }}
          >
            <span style={{ marginRight: '8px' }}>{f.format}</span>
            {f.format === active ? <CircleGreenIcon size='16' /> : <CircleGreyIcon size='16' />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeZone;
