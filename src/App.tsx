import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, theme } from 'antd';
import Home from './pages/Home.jsx'; // Import Home component
import RegLog from './Auth/RegLog.jsx'; // Import RegLog component

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = [
  {
    key: '2',
    label: <RegLog />, // Use the label property to render the RegLog component
  },
  {
    key: '1',
    label: 'Fujitsu Growth',
  },

  
];

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: Array.from({ length: 4 }).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedContent, setSelectedContent] = useState<React.ReactNode>(''); // State for selected content
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

   const handleMenuClick = (key: string) => {
     if (key === '1') {
       setSelectedContent(<Home />); // Render Home component when "Fujitsu Growth" is clicked
     }
   };

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
           onClick={(e) => handleMenuClick(e.key)} // Handle menu click
        />
      </Header>
      <Layout style={{ paddingBottom: '48px' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={200}
          style={{ background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: '100%',
              height: 48,
              padding: 24,
              background: 'transparent',
              border: 'none',
            }}
          />
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: '24px 24px 24px 24px' }}>
          <Content
            style={{
              padding: 0,
              margin: 0,
              minHeight: '100vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {selectedContent || 'Content'} {/* Render selected content or default text */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
