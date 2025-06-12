import { useState } from 'react';
import { ArrowDownIcon } from '../../../assets/svg';
import classes from './Dropdown.module.css';
import { DropdownTypes } from '../dropdown/Dropdown.type';

const DashDropdown = ({
  label = '',
  options = [],
  id = '',
  style,
  handleOption = () => '',
}: DropdownTypes) => {
  const [dropdown, setDropdown] = useState(false);
  const [value, setValue] = useState('');
  return (
    <div className={classes.container} style={style}>
      {label && (
        <span style={{ marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>{label}</span>
      )}
      <div className={classes.dropdownContainer}>
        <div className={classes.dropdownHeader} onClick={() => setDropdown(!dropdown)}>
          {value || options[0][id]}
          <ArrowDownIcon width='15' height='7' />
        </div>
        {dropdown && (
          <div className={classes.dropdownItems}>
            {options.map((item: any) => (
              <div
                key={item.id}
                className={classes.dropdownItem}
                onClick={() => {
                  setValue(item[id]);
                  setDropdown(false);
                  handleOption(item[id]);
                }}
              >
                {item[id]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashDropdown;
