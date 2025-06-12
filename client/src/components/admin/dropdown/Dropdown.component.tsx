import { useState } from 'react';
import { ArrowDownIcon } from '../../../assets/svg';
import { DropdownTypes } from './Dropdown.type';
import classes from './Dropdown.module.css';

const Dropdown = ({
  label = '',
  options = [],
  id = '',
  style,
  children,
  handleOption = () => '',
  isDropdown = true,
  initialValue = '',
  dropItemsStyle
}: DropdownTypes) => {
  const [dropdown, setDropdown] = useState(false);
  const [value, setValue] = useState('');
  const [color, setColor] = useState('');
  return (
    <>
      {isDropdown ? (
        <div className={classes.container} style={style}>
          {label && (
            <span style={{ marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>
              {label}
            </span>
          )}
          <div className={classes.dropdownContainer}>
            <div
              className={classes.dropdownHeader}
              onClick={() => setDropdown(!dropdown)}
              style={{ color }}
            >
              {value || initialValue }
              <ArrowDownIcon width='10' height='7' color={color} />
            </div>
            {dropdown && (
              <div className={classes.dropdownItems} style={dropItemsStyle}>
                {options.map((item: any) => (
                  <div
                    key={item.id}
                    className={classes.dropdownItem}
                    onClick={() => {
                      setValue(item[id]);
                      setColor(item.iconColor);
                      setDropdown(false);
                      handleOption(item[id]);
                    }}
                  >
                    <span style={{ color: item.iconColor }}>{item[id]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.container} style={style}>
          {label && (
            <span style={{ marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>
              {label}
            </span>
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
          </div>
        </div>
      )}
    </>
  );
};

export default Dropdown;
