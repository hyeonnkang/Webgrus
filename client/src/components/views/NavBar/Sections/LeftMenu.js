import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu style={{ width: 256 }} selectedKeys="Selected" mode="vertical">
    <Menu.Item>
      <a href="/">Introduce</a>
    </Menu.Item>
    <Menu.Item>
      <a href="/">Notifications</a>
    </Menu.Item>
    <Menu.Item>
      <a href="/lectures">Lectures</a>
    </Menu.Item>
    <Menu.Item>
      <a href="/">Study Groups</a>
    </Menu.Item>
    <Menu.Item>
      <a href="/">Contest Info</a>
    </Menu.Item>
    </Menu>
  )
}

export default LeftMenu
