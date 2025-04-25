import React, { useState, useEffect, useContext } from 'react';
import { Tooltip, Badge, Calendar, Typography, Card, List, Tag, Divider, Button, Modal, DatePicker, Input, message, Spin } from 'antd';
import { Splitter, Flex } from 'antd';
import { getTemplates, assignTemplate, getAssignments } from '../api'; // Assuming getAssignments fetches user assignments
import dayjs from 'dayjs';
import { UserContext } from '../Auth/UserContext';
import { SmileOutlined, ClockCircleOutlined } from '@ant-design/icons';
import '../styles/home.css';

const { Title, Text } = Typography;

const Home = () => {
    const [templates, setTemplates] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isUseModalOpen, setIsUseModalOpen] = useState(false);
    const [hoursPerWeek, setHoursPerWeek] = useState('');
    const [startDate, setStartDate] = useState(null);
    const { loggedInUser } = useContext(UserContext);

    // Fetch templates and assignments when component mounts
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [templateData, assignmentData] = await Promise.all([getTemplates(), getAssignments()]);
                setTemplates(Array.isArray(templateData) ? templateData.slice(0, 4) : []);
                setAssignments(Array.isArray(assignmentData) ? assignmentData : []);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Schedule tasks over days
    const enhancedAssignments = assignments
        .map(assignment => {
            const template = templates.find(t => t.id === assignment.templateId);
            if (!template) return null;

            const tasks = (template.tasks || []).map(task => ({
                ...task,
                time: Number(task.time) || 0,
                originalTime: Number(task.time) || 0,
                isComplete: Boolean(task.isComplete)
            })).filter(t => t.time > 0);

            return {
                ...assignment,
                tasks,
                startDate: assignment.startDate || dayjs().format('YYYY-MM-DD'),
                hoursPerWeek: Math.max(1, Number(assignment.hoursPerWeek) || 1)
            };
        })
        .filter(Boolean);

    const scheduledEvents = enhancedAssignments.flatMap(assignment => {
        const events = [];
        const dailyHours = assignment.hoursPerWeek / 5;
        let currentDate = dayjs(assignment.startDate);
        let taskIndex = 0;
        let dayHoursUsed = 0;
        const tasksCopy = [...assignment.tasks];

        while (taskIndex < tasksCopy.length) {
            const task = tasksCopy[taskIndex];
            if (!task || task.time <= 0) {
                taskIndex++;
                continue;
            }

            // Skip weekends
            while (currentDate.day() === 0 || currentDate.day() === 6) {
                currentDate = currentDate.add(1, 'day');
            }

            const available = dailyHours - dayHoursUsed;
            const assignHours = Math.min(available, task.time);

            if (assignHours > 0) {
                events.push({
                    date: currentDate.format('YYYY-MM-DD'),
                    task: {
                        ...task,
                        hours: assignHours,
                    },
                    isComplete: task.isComplete,
                    assignmentId: assignment.id
                });

                task.time -= assignHours;
                dayHoursUsed += assignHours;
            }

            if (dayHoursUsed >= dailyHours - 0.01) {
                currentDate = currentDate.add(1, 'day');
                dayHoursUsed = 0;
            }

            if (task.time <= 0) {
                taskIndex++;
            }
        }

        return events;
    });

    // Filter today's tasks
    const todaysTasks = scheduledEvents
        .filter((event) => dayjs(event.date).isSame(dayjs(), 'day'))
        .map((event) => ({
            ...event.task,
            isComplete: event.isComplete,
            assignmentId: event.assignmentId,
        }));

    // Calendar cell rendering
    const cellRender = (date) => {
        const dateStr = date.format('YYYY-MM-DD');
        const dayEvents = scheduledEvents.filter(e => e.date === dateStr);
      
        return (
          <div style={{ padding: 4 }}>
            {dayEvents.map((event, idx) => (
              <Tooltip title={`${event.task.name} - ${event.task.hours}h`} key={idx}>
                <Badge
                  status={event.isComplete ? 'default' : 'processing'}
                  text={`${event.task.name} (${event.task.hours}h)`}
                />
              </Tooltip>
            ))}
          </div>
        );
      };
      

    // Template assignment functions
    const handleUseTemplate = (template) => {
        setSelectedTemplate(template);
        setIsUseModalOpen(true);
    };

    const resetModalState = () => {
        setHoursPerWeek('');
        setStartDate(null);
    };

    const handleUseModalClose = () => {
        setIsUseModalOpen(false);
        resetModalState();
    };

    const handleUseTemplateSubmit = async () => {
        if (!startDate) {
            message.error('Please select a start date');
            return;
        }

        if (!hoursPerWeek || isNaN(hoursPerWeek)) {
            message.error('Please enter valid hours per week');
            return;
        }

        try {
            const result = await assignTemplate({
                templateId: selectedTemplate.id,
                startDate: dayjs(startDate).format('YYYY-MM-DD'),
                hoursPerWeek: parseInt(hoursPerWeek),
            });

            if (result.success) {
                message.success('Template assigned successfully!');
                handleUseModalClose();
            } else {
                message.error(result.error || 'Failed to assign template');
            }
        } catch (error) {
            message.error('Failed to assign template');
            console.error('Assignment error:', error);
        }
    };

    return (
        <>
            <Splitter
                layout="vertical"
                style={{
                    height: '100vh',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Top Panel - Reduced height */}
                <Splitter.Panel
                    minSize={200}
                    maxSize={400}
                    style={{
                        flex: '0 0 auto',
                        height: '40%',
                        maxHeight: '400px',
                    }}
                >
                    <Splitter layout="horizontal">
                        <Splitter.Panel>
                            <Flex vertical justify="center" align="center" style={{ height: '100%', padding: '20px' }}>
                                <Title level={3}>Today's Tasks</Title>
                                {loading ? (
                                    <Spin />
                                ) : (
                                    <List
    dataSource={todaysTasks}
    renderItem={(task) => (
        <List.Item
            style={{
                padding: '12px 16px',
                margin: '8px 0',
                borderRadius: '8px',
                backgroundColor: '#fafafa',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
                ':hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)'
                }
            }}
        >
            <List.Item.Meta
                avatar={
                    <Badge
                        status={task.isComplete ? 'success' : 'processing'}
                        style={{ marginTop: '6px' }}
                    />
                }
                title={
                    <Text 
                        strong 
                        style={{ 
                            fontSize: '16px',
                            textDecoration: task.isComplete ? 'line-through' : 'none',
                            color: task.isComplete ? '#8c8c8c' : 'inherit'
                        }}
                    >
                        {task.name}
                    </Text>
                }
                description={
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                        <Text type="secondary" style={{ marginRight: '16px' }}>
                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                            {task.time}h
                        </Text>
                        {!task.isComplete && (
                            <Button 
                                type="primary" 
                                size="small" 
                                onClick={() => markTaskComplete(task)}
                                style={{ marginLeft: 'auto' }}
                            >
                                Complete
                            </Button>
                        )}
                    </div>
                }
            />
        </List.Item>
    )}
    style={{ width: '100%' }}
    locale={{ emptyText: (
        <div style={{ textAlign: 'center', padding: '24px' }}>
            <SmileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <p style={{ marginTop: '8px' }}>No tasks scheduled for today!</p>
        </div>
    ) }}
/>
                                   


                                )}
                            </Flex>
                        </Splitter.Panel>
                        <Splitter.Panel>
                            <div
                                style={{
                                    padding: '20px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '40%',
                                }}
                            >
                                <Title level={3} style={{ marginBottom: '16px' }}>
                                    Featured Templates
                                </Title>
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <List
                                        grid={{ gutter: 16, xs: 1, sm: 2 }}
                                        dataSource={templates}
                                        loading={loading}
                                        renderItem={(template) => (
                                            <List.Item>
                                                <Card
                                                    title={<Text strong>{template.name}</Text>}
                                                    extra={
                                                        <Tag color="blue">
                                                            {Array.isArray(template.tasks) ? template.tasks.length : 0} tasks
                                                        </Tag>
                                                    }
                                                    style={{ height: '100%', borderRadius: '8px' }}
                                                    actions={[
                                                        loggedInUser && (
                                                            <Button
                                                                type="primary"
                                                                onClick={() => handleUseTemplate(template)}
                                                            >
                                                                Use
                                                            </Button>
                                                        ),
                                                    ]}
                                                    styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
                                                >
                                                    {/* ... (keep existing card content) ... */}
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                        </Splitter.Panel>
                    </Splitter>
                </Splitter.Panel>

                {/* Bottom Panel - Calendar (takes remaining space) */}
                <Splitter.Panel
                    collapsible
                    style={{
                        flex: 1,
                        minHeight: '70%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        <Calendar
                            cellRender={cellRender}
                            style={{
                                height: '100%',
                                padding: '16px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                </Splitter.Panel>
            </Splitter>

            {/* Modal moved outside of Splitter */}
            <Modal
                title={`Use Template: ${selectedTemplate?.name}`}
                open={isUseModalOpen}
                onCancel={handleUseModalClose}
                footer={[
                    <Button key="cancel" onClick={handleUseModalClose}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUseTemplateSubmit}
                        disabled={!hoursPerWeek || !startDate}
                    >
                        Confirm Assignment
                    </Button>,
                ]}
                width={600}
            >
                {selectedTemplate && (
                    <div>
                        <div style={{ marginBottom: '24px' }}>
                            <Text>You are about to assign the template:</Text>
                            <Title level={4} style={{ marginTop: '8px' }}>
                                {selectedTemplate.name}
                            </Title>
                            <Text type="secondary" style={{ display: 'block' }}>
                                Created by: {selectedTemplate.createdBy || 'Unknown user'}
                            </Text>
                        </div>

                        <Divider orientation="left">Tasks Summary</Divider>

                        <div style={{ marginBottom: '24px' }}>
                            {Array.isArray(selectedTemplate.tasks) && (
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        <Text strong>Total Tasks:</Text>
                                        <Text>{selectedTemplate.tasks.length}</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>Total Hours:</Text>
                                        <Text>
                                            {selectedTemplate.tasks.reduce(
                                                (sum, task) => sum + parseFloat(task.time || 0),
                                                0
                                            )}{' '}
                                            hours
                                        </Text>
                                    </div>
                                </>
                            )}
                        </div>

                        <Divider orientation="left">Assignment Details</Divider>

                        <div style={{ margin: '16px 0' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                    Start Date
                                </Text>
                                <DatePicker
                                    value={startDate}
                                    onChange={setStartDate}
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                    Weekly Commitment (Max 36)
                                </Text>
                                <Input
                                    type="number"
                                    placeholder="Enter hours per week"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(e.target.value)}
                                    style={{ width: '200px' }}
                                    min={1}
                                    max={35}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Home;