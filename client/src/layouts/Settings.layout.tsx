import React, { useState } from 'react';
import SettingsSidebar from '../components/admin/settings-sidebar/SettingsSidebar.component';
import AdminLayout from './Admin.layout';
import { LayoutTypes } from './Layout.type';
import SettingsMobileNavs from '../components/admin/settings-mobile-navs/SettingsMobileNavs.component';
import classes from './Layout.module.css';

const SettingsLayout = ({ children, padding = '', inlineWidth = '' }: LayoutTypes) => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <AdminLayout title='Settings' childBackground='#fff' bgColor='#fff'>
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <SettingsSidebar />
        </div>
        <div className={classes.content} style={{ padding }}>
          <div className={classes.childrenContent} style={{ width: inlineWidth }}>
            {children}
          </div>
        </div>
      </div>
      <div className={classes.mobileNavs}>
        <SettingsMobileNavs showSidebar={showSidebar} onClick={() => setShowSidebar(false)} />
      </div>
    </AdminLayout>
  );
};

export default SettingsLayout;
