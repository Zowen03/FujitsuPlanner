import React, { useState, useEffect, useContext } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, theme } from 'antd';
import Home from './pages/Home.jsx';
import RegLog from './Auth/RegLog.jsx';
import CreateTemplate from './pages/CreateTemplate.jsx';
import TemplateList from './Pages/viewTemplate.jsx';
import { UserContext, UserProvider } from './Auth/UserContext.tsx';
import { getAssignments } from './api';

const { Header, Content, Sider } = Layout;

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  
  interface Assignment {
    id: string;
    templateName?: string;
    startDate: string;
    hoursPerWeek: number;
    status?: string;
  }

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { loggedInUser } = useContext(UserContext);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchAssignments = async () => {
      if (loggedInUser) {
        try {
          const data = await getAssignments();
          setAssignments(data);
        } catch (error) {
          console.error('Failed to fetch assignments:', error);
        }
      } else {
        setAssignments([]);
      }
    };
    fetchAssignments();
  }, [loggedInUser]);

  const items1: MenuProps['items'] = [
    {
      key: 'head2',
      label: <RegLog />,
    },
    {
      key: 'head1',
      label: 'Fujitsu Growth',
    },
  ];

  const items2: MenuProps['items'] = [
    {
      key: 'sub1',
      icon: <UserOutlined />,
      label: 'My Plans',
      children: assignments.length > 0 
        ? assignments.map(assignment => ({
            key: `assignment-${assignment.id}`,
            label: assignment.templateName || `Plan ${assignment.id.slice(0, 4)}...`,
            icon: <LaptopOutlined />,
          }))
        : [{
            key: 'no-assignments',
            label: 'No plans available',
            disabled: true,
          }],
    },
    {
      key: 'sub2',
      icon: <LaptopOutlined />,
      label: 'View Templates',
    },
    {
      key: 'sub3',
      icon: <NotificationOutlined />,
      label: 'Create Template',
    },
  ];

  const renderContent = () => {
    switch (selectedContent) {
      case 'home':
        return <Home />;
      case 'create-template':
        return <CreateTemplate />;
      case 'view-templates':
        return <TemplateList onAssignmentCreated={refreshAssignments} />;
      case 'assignment':
        return (
          <div style={{ padding: '24px' }}>
            <h2>Assignment Details</h2>
            {/* Add assignment details rendering logic here */}
          </div>
        );
      default:
        return (
          <div style={{ padding: '24px' }}>
            <h2>Welcome to Fujitsu Growth</h2>
            <p>Select an option from the menu to get started</p>
          </div>
        );
    }
  };

  const handleMenuClick = (key: string) => {
    if (key === 'head1') {
      setSelectedContent('home');
    } else if (key === 'sub3') {
      setSelectedContent('create-template');
    } else if (key === 'sub2') {
      setSelectedContent('view-templates');
    } else if (key.startsWith('assignment-')) {
      setSelectedContent('assignment');
      // Add logic to handle assignment-specific details if needed
    }
  };

  const refreshAssignments = async () => {
    if (loggedInUser) {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
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
          onClick={(e) => handleMenuClick(e.key)}
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
            key={assignments.length}
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
            onClick={(e) => handleMenuClick(e.key)}
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
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;