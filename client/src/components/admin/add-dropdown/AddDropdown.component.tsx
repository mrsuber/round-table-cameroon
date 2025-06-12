import React, { useState } from 'react';
import { DropdownTypes } from '../dropdown/Dropdown.type';
import classes from './AddDropdown.module.css';

const AddDropdown = ({
  options = [],
  id = '',
  id2 = '',
  style,
  handleOption = () => '',
  renderIconLeft,
  renderIconRight,
  text,
  nullCheckValue = true,
  headerStyle,
  textStyle,
  errorText,
  headerRef,
  onHeaderClick,
  dropdownItemsStyle,
}: DropdownTypes) => {
  const [dropdown, setDropdown] = useState(false);
  const [value, setValue] = useState(text);
  return (
    <div className={classes.container} style={style}>
      <div className={classes.dropdownContainer}>
        <div
          className={classes.dropdownHeader}
          ref={headerRef}
          style={headerStyle}
          onClick={() => {
            setDropdown(!dropdown);
            onHeaderClick?.();
          }}
        >
          {renderIconLeft && renderIconLeft?.()}
          <span style={textStyle}>{nullCheckValue ? value ?? text : text ?? value}</span>
          {errorText && <span style={{ color: 'red',  marginLeft: '6px' }}>{errorText}</span>}
          {renderIconRight && renderIconRight?.()}
        </div>
        {dropdown && (
          <div className={classes.dropdownItems} style={dropdownItemsStyle}>
            {options?.map((item: any) => (
              <div
                key={item._id}
                className={classes.dropdownItem}
                onClick={() => {
                  setValue(`${item[id]} ${item[id2]}`);
                  setDropdown(false);
                  handleOption(item);
                }}
              >
                {`${item[id]} ${item[id2]}`}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDropdown;
