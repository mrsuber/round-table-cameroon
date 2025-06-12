import { useState } from 'react';
import { genders } from '../../../assets/data/genders';
import { CheckedIcon, UnCheckedIcon } from '../../../assets/svg';
import classes from './Gender.module.css';

interface genderTypes {
  handleOption?: (item: string) => void;
}

const Gender = ({ handleOption = () => '' }: genderTypes) => {
  const [active, setActive] = useState<string>('Male');
  return (
    <div className={classes.container}>
      <span
        style={{
          marginBottom: '10px',
          fontWeight: '600',
          fontSize: '14px',
          textAlign: 'left',
        }}
      >
        Sex
      </span>
      <div className={classes.genders}>
        {genders?.map((g: any, index) => (
          <div
            className={classes.genderItem}
            style={{ margin: index === 0 ? '0 8px 0 0' : '0 0 0 8px' }}
            key={g.id}
            onClick={() => {
              setActive(g.gender);
              handleOption(g.gender);
            }}
          >
            {g.gender}
            {g.gender === active ? (
              <CheckedIcon size='15' style={{ marginLeft: '10px' }} />
            ) : (
              <UnCheckedIcon size='15' style={{ marginLeft: '10px' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gender;
