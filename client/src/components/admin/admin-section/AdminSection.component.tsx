import { AdminSectionTypes } from './AdminSection.type';
import { ArrowLeftIcon, ChevronRightIcon } from '../../../assets/svg';
import classes from './AdminSection.module.css';

const AdminSection = ({
  title,
  onNext,
  onPrevious,
  children,
  showNavigation = true,
  style,
  nextDisabled,
  previousDisabled
}: AdminSectionTypes) => {
  return (
    <div className={classes.mainContainer} style={style}>
      <div className={classes.container}>
        <h3 className={classes.title}>{title}</h3>
        {showNavigation && (
          <div style={{ display: 'flex', paddingRight: '12px' }}>
            <ArrowLeftIcon
              onClick={onPrevious}
              className={classes.arrow}
              color={previousDisabled ? '#b7b7b7' : '#000000'}
            />
            <ChevronRightIcon
              onClick={onNext}
              className={`${classes.arrow} ${classes.arrowRight}`}
              color={nextDisabled ? '#b7b7b7' : '#000000'}
            />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default AdminSection;
