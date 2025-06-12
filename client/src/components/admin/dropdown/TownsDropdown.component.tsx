import { useState } from 'react';
import { ArrowDownIcon } from '../../../assets/svg';
import { DropdownTypes } from './Dropdown.type';
import classes from './Dropdown.module.css';

const TownsDropdown = ({
  label = '',
  options = [],
  id = '',
  style,
  children,
  handleOption = () => '',
  region,
  initialValue = '',
}: DropdownTypes) => {
  const [dropdown, setDropdown] = useState(false);
  const [value, setValue] = useState('');
  const [color, setColor] = useState('');
  return (
    <div className={classes.container} style={style}>
      {label && (
        <span style={{ marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>{label}</span>
      )}
      <div className={classes.dropdownContainer}>
        <div
          className={classes.dropdownHeader}
          onClick={() => setDropdown(!dropdown)}
          style={{ color }}
        >
            {value || initialValue}
          <ArrowDownIcon width='15' height='7' color={color} />
        </div>
        {dropdown && (
          <div className={classes.dropdownItems}>
            {options.map(
              (item: any) =>
                item.region === region &&
                item.towns.map((town: any, index: number) => (
                  <div
                    key={`${town} ${index}`}
                    className={classes.dropdownItem}
                    onClick={() => {
                      setValue(town);
                      setDropdown(false);
                      handleOption(town);
                    }}
                  >
                    <span style={{ color: item.iconColor }}>{town}</span>
                  </div>
                )),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TownsDropdown;
