import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { Drawer, Button, Icon } from 'antd';
import './Sections/Navbar.css';

function NavBar() {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <nav className="menu" mode="vertical" id="grid_NavBar2">
      <div className="menu__logo">
        <a href="/">WebGrus</a>
      </div>
      <div className="menu__container" id="grid_NavBar1">
        <div className="menu_left">
          <LeftMenu mode="vertical" />
        </div>
        <div className="menu_rigth">
          <RightMenu mode="vertical" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          style={{ width: '100px', borderRadius: '4px'}}
          onClick={showDrawer}
        >
        <Icon type="align-right" />
        </Button>
        <Drawer
          title=""
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  )
}

export default NavBar
