import { SearchIcon } from '../../../assets/svg';
import CategoryIcon from '../../../assets/svg/CategoryIcon';
import Button from '../button/Button.component';
import Input from '../input/Input.component';
import classes from './AdminHeader.module.css';

const AdminHeader = () => {
  return (
    <div className={classes.container}>
      <Input placeholder='search member' width='70%' renderIcon={() => <SearchIcon size='16' />} />
      <div className={classes.actions}>
        <Button
          text='Category'
          border='1px solid #F5F5F7'
          renderIcon={() => <CategoryIcon size='18' />}
          bgColor='transparent'
          color='#000'
          textStyle={{ fontStyle: 'normal', fontWeight: '600', fontSize: '12px' }}
        />
        <Button
          text='Sort By: Deadline'
          border='1px solid #F5F5F7'
          renderIcon={() => <CategoryIcon size='18' />}
          margin='0 0px 0 20px'
          bgColor='transparent'
          color='#000'
          textStyle={{ fontStyle: 'normal', fontWeight: '600', fontSize: '12px' }}
        />
      </div>
    </div>
  );
};

export default AdminHeader;
