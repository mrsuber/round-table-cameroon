import { ButtonTypes } from './Button.type';
import classes from './Button.module.css';
import Spinner from '../../loaders/spinner/Spinner';

const Button = ({
  onClick,
  text,
  color = '#fff',
  bgColor = '#003B33',
  width,
  height,
  borderRadius = '5px',
  padding = '',
  fontSize = '12px',
  border = 'none',
  renderIcon,
  iconAfter = false,
  style,
  children,
  margin,
  textMargin = '0px 6px',
  boxShadow = 'none',
  textStyle,
  loading,
  spinnerSize,
  fillColor,
  strokeColor,
  disabled,
  ...props
}: ButtonTypes) => (
  <>
    <div
      style={{
        backgroundColor: bgColor,
        color,
        padding,
        margin,
        border,
        width,
        height,
        borderRadius,
        boxShadow,
        boxSizing: 'border-box',
        opacity: disabled ? 0.2 : 1,
        ...style,
      }}
      onClick={!disabled ? onClick : () => null}
      className={classes.container}
      {...props}
    >
      {renderIcon && !iconAfter ? renderIcon() : null}
      {text && (
        <span className={classes.texts} style={{ fontSize, margin: textMargin, ...textStyle }}>
          {text}
        </span>
      )}
      {renderIcon && iconAfter ? renderIcon() : null}
      {children}
      {loading && (
        <Spinner size={spinnerSize ?? '13px'} fillColor={fillColor} strokeColor={strokeColor} />
      )}
    </div>
  </>
);

export default Button;
