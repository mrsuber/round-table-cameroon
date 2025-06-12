import React, { useState } from 'react'
import Switch from 'react-switch'
import { NotificationItemTypes } from './NotificationItem.type'
import classes from './notificationItem.module.css'

const NotificationItem = ({ title, caption, onChange, ...props }: NotificationItemTypes) => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h4 style={{ margin: '0', fontSize: '14px' }}>{title}</h4>
        <Switch
          checked
          height={13}
          width={26}
          uncheckedIcon={false}
          checkedIcon={false}
          onHandleColor='#003B33'
          offHandleColor='#8A8A8A'
          onColor='#fff'
          offColor='#fff'
          className={classes.switch}
          activeBoxShadow='0px 0px 0px rgba(0,0,0,0.01)'
          onChange={onChange}
          {...props}
        />
      </div>
      <span style={{ fontWeight: '300', fontSize: '12px', marginTop: '8px' }}>{caption}</span>
    </div>
  )
}

export default NotificationItem
