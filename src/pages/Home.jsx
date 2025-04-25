import React, { useState, useEffect, useContext } from 'react';
import { Badge, Calendar, Typography, Card, List, Tag, Divider, Button, Modal, DatePicker, Input, message } from 'antd';
import { Splitter, Flex } from 'antd';
import { getTemplates, assignTemplate } from '../api';
import dayjs from 'dayjs';
import { UserContext } from '../Auth/UserContext';
import '../styles/home.css';

const { Title, Text } = Typography;

const Home = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isUseModalOpen, setIsUseModalOpen] = useState(false);
    const [hoursPerWeek, setHoursPerWeek] = useState('');
    const [startDate, setStartDate] = useState(null);
    const { loggedInUser } = useContext(UserContext);

    // Fetch templates when component mounts
    useEffect(() => {
        const loadTemplates = async () => {
            setLoading(true);
            try {
                const data = await getTemplates();
                setTemplates(Array.isArray(data) ? data.slice(0, 4) : []);
            } catch (error) {
                console.error('Failed to load templates:', error);
            } finally {
                setLoading(false);
            }
        };
        loadTemplates();
    }, []);

    // Calendar rendering functions (keep your existing ones)
    const getListData = (value) => { /* ... */ };
    const getMonthData = (value) => { /* ... */ };
    const monthCellRender = (value) => { /* ... */ };
    const dateCellRender = (value) => { /* ... */ };
    const cellRender = (current, info) => { /* ... */ };

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
                    flexDirection: 'column'
                }}
            >
                {/* Top Panel - Reduced height */}
                <Splitter.Panel 
                    minSize={200} 
                    maxSize={400}
                    style={{ 
                        flex: '0 0 auto', 
                        height: '40%', 
                        maxHeight: '400px' 
                    }}
                >
                    <Splitter layout="horizontal">
                        <Splitter.Panel>
                            <Flex vertical justify="center" align="center" style={{ height: '100%', padding: '20px' }}>
                                <Title level={3}>Recent Activity</Title>
                                {/* Add your activity feed here */}
                            </Flex>
                        </Splitter.Panel>
                        <Splitter.Panel>
                            <div style={{ 
                                padding: '20px', 
                                overflowY: 'auto', 
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '40%',
                            }}>
                                <Title level={3} style={{ marginBottom: '16px' }}>Featured Templates</Title>
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <List
                                        grid={{ gutter: 16, xs: 1, sm: 2 }}
                                        dataSource={templates}
                                        loading={loading}
                                        renderItem={(template) => (
                                            <List.Item>
                                                <Card
                                                    title={<Text strong>{template.name}</Text>}
                                                    extra={<Tag color="blue">{Array.isArray(template.tasks) ? template.tasks.length : 0} tasks</Tag>}
                                                    style={{ height: '100%', borderRadius: '8px' }}
                                                    actions={[
                                                        loggedInUser && (
                                                            <Button 
                                                                type="primary" 
                                                                onClick={() => handleUseTemplate(template)}
                                                            >
                                                                Use
                                                            </Button>
                                                        )
                                                    ]}
                                                    headStyle={{ borderBottom: '1px solid #f0f0f0' }}
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
                        flexDirection: 'column'
                    }}
                >
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        <Calendar 
                            cellRender={cellRender} 
                            style={{ 
                                height: '100%',
                                padding: '16px',
                                boxSizing: 'border-box'
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
                    </Button>
                ]}
                width={600}
            >
                {selectedTemplate && (
                    <div>
                        <div style={{ marginBottom: '24px' }}>
                            <Text>You are about to assign the template:</Text>
                            <Title level={4} style={{ marginTop: '8px' }}>{selectedTemplate.name}</Title>
                            <Text type="secondary" style={{ display: 'block' }}>
                                Created by: {selectedTemplate.createdBy || 'Unknown user'}
                            </Text>
                        </div>

                        <Divider orientation="left">Tasks Summary</Divider>
                        
                        <div style={{ marginBottom: '24px' }}>
                            {Array.isArray(selectedTemplate.tasks) && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <Text strong>Total Tasks:</Text>
                                        <Text>{selectedTemplate.tasks.length}</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>Total Hours:</Text>
                                        <Text>
                                            {selectedTemplate.tasks.reduce((sum, task) => sum + parseFloat(task.time || 0), 0)} hours
                                        </Text>
                                    </div>
                                </>
                            )}
                        </div>

                        <Divider orientation="left">Assignment Details</Divider>
                        
                        <div style={{ margin: '16px 0' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Start Date</Text>
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