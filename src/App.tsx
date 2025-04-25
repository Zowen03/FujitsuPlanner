import React, { useState, useEffect, useContext } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, theme, Spin } from 'antd';
import Home from './pages/Home.jsx';
import RegLog from './Auth/RegLog.jsx';
import CreateTemplate from './pages/CreateTemplate.jsx';
import TemplateList from './Pages/viewTemplate.jsx';
import Calendar from './pages/Calendar.jsx';
import { UserContext, UserProvider } from './Auth/UserContext.tsx';
import { getAssignments, getTemplates } from './api.ts';

const { Header, Content, Sider } = Layout;

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  
  interface Assignment {
    id: string;
    templateId: string;
    templateName?: string;
    startDate: string;
    hoursPerWeek: number;
    status?: string;
  }

  interface Template {
    id: string;
    name: string;
    tasks: Array<{
      id: string;
      name: string;
      time: number;
    }>;
    createdAt: string;
    createdBy: string;
  }

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const { loggedInUser } = useContext(UserContext);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchData = async () => {
      if (!loggedInUser) {
        setAssignments([]);
        setTemplates([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [assignmentsData, templatesData] = await Promise.all([
          getAssignments(),
          getTemplates()
        ]);
        setAssignments(assignmentsData);
        setTemplates(templatesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            icon: <CalendarOutlined />,
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
    if (loading) {
      return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
    }

    switch (selectedContent) {
      case 'home':
        return <Home />;
      case 'create-template':
        return <CreateTemplate onTemplateCreated={refreshData} />;
      case 'view-templates':
        return <TemplateList templates={templates} onAssignmentCreated={refreshData} />;
      case 'calendar':
          return (
            <Calendar 
              assignments={selectedAssignmentId 
                ? assignments.filter(a => a.id === selectedAssignmentId) 
                : assignments}
              templates={templates} 
            />
          );
      case 'assignment':
        return (
          <div style={{ padding: '24px' }}>
            <h2>Assignment Details</h2>
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
      setSelectedAssignmentId(null);
    } else if (key === 'sub3') {
      setSelectedContent('create-template');
      setSelectedAssignmentId(null);
    } else if (key === 'sub2') {
      setSelectedContent('view-templates');
      setSelectedAssignmentId(null);
    } else if (key.startsWith('assignment-')) {
      const assignmentId = key.replace('assignment-', '');
      setSelectedAssignmentId(assignmentId);
      setSelectedContent('calendar');
    }
  };

  const refreshData = async () => {
    if (loggedInUser) {
      try {
        setLoading(true);
        const [assignmentsData, templatesData] = await Promise.all([
          getAssignments(),
          getTemplates()
        ]);
        setAssignments(assignmentsData);
        setTemplates(templatesData);
      } catch (error) {
        console.error('Failed to refresh data:', error);
      } finally {
        setLoading(false);
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