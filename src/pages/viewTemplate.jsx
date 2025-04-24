import React, { useState, useEffect } from 'react';
import { List, Input, Button, Card, Tag, Space, Typography, Modal, Divider } from 'antd';
import { getTemplates } from '../api';

const { Search } = Input;
const { Title, Text } = Typography;

const TemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUseModalOpen, setIsUseModalOpen] = useState(false);
    const [hoursPerWeek, setHoursPerWeek] = useState('');

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const data = await getTemplates(searchText);
            setTemplates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load templates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, [searchText]);

    const handleViewTemplate = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleUseTemplate = (template) => {
        setSelectedTemplate(template);
        setIsUseModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleUseModalClose = () => {
        setIsUseModalOpen(false);
        setHoursPerWeek('');
    };

    const handleUseTemplateSubmit = () => {
        console.log(`Using template: ${selectedTemplate.name}, Hours per week: ${hoursPerWeek}`);
        handleUseModalClose();
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>Templates</Title>
            
            <div style={{ marginBottom: '24px' }}>
                <Search
                    placeholder="Search templates by name or creator"
                    allowClear
                    enterButton="Search"
                    size="large"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={loadTemplates}
                    style={{ maxWidth: '600px' }}
                />
            </div>

            <List
                grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
                dataSource={templates}
                loading={loading}
                renderItem={(template) => (
                    <List.Item>
                        <Card
                            title={<Text strong>{template.name}</Text>}
                            extra={<Tag color="blue">{Array.isArray(template.tasks) ? template.tasks.length : 0} tasks</Tag>}
                            style={{ height: '100%', borderRadius: '8px' }}
                            actions={[
                                <Button type="link" onClick={() => handleViewTemplate(template)}>Details</Button>,
                                <Button type="primary" onClick={() => handleUseTemplate(template)}>Use</Button>
                            ]}
                            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                        >
                            <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
                                Created: {new Date(template.createdAt).toLocaleDateString()}
                            </Text>
                            <Divider style={{ margin: '12px 0' }} />
                            <div style={{ maxHeight: '120px', overflow: 'auto' }}>
                                {Array.isArray(template.tasks) && template.tasks.slice(0, 4).map(task => (
                                    <div key={task.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                        <Text ellipsis style={{ maxWidth: '70%' }}>{task.name}</Text>
                                        <Text type="secondary">{task.time}h</Text>
                                    </div>
                                ))}
                                {Array.isArray(template.tasks) && template.tasks.length > 4 && (
                                    <Text type="secondary">+ {template.tasks.length - 4} more tasks</Text>
                                )}
                            </div>
                        </Card>
                    </List.Item>
                )}
            />

            {/* Template Details Modal */}
            <Modal
                title={<Title level={3} style={{ marginBottom: 0 }}>{selectedTemplate?.name}</Title>}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                    <Button 
                        key="use" 
                        type="primary" 
                        onClick={() => {
                            handleModalClose();
                            handleUseTemplate(selectedTemplate);
                        }}
                    >
                        Use This Template
                    </Button>
                ]}
                width={800}
            >
                {selectedTemplate && (
                    <div>
                        <Text strong>Created by: </Text>
                        <Text>{selectedTemplate.createdBy || 'Unknown user'}</Text>
                        <div>
                            <Text type="secondary">
                                Created on: {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                            </Text>
                        </div>

                        <Divider orientation="left">Tasks</Divider>
                        
                        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                            {Array.isArray(selectedTemplate.tasks) && selectedTemplate.tasks.map(task => (
                                <div key={task.id} style={{ 
                                    marginBottom: '12px', 
                                    padding: '12px', 
                                    backgroundColor: '#fafafa',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ display: 'block' }}>{task.name}</Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Added by: {task.createdBy || selectedTemplate.createdBy || 'Unknown user'}
                                        </Text>
                                    </div>
                                    <Tag color="blue" style={{ marginLeft: '12px' }}>{task.time} hours</Tag>
                                </div>
                            ))}
                            {(!selectedTemplate.tasks || selectedTemplate.tasks.length === 0) && (
                                <Text type="secondary">No tasks available</Text>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Use Template Modal */}
            <Modal
                title={<Title level={3} style={{ marginBottom: 0 }}>Use Template: {selectedTemplate?.name}</Title>}
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
                        disabled={!hoursPerWeek}
                    >
                        Confirm
                    </Button>
                ]}
                width={600}
            >
                {selectedTemplate && (
                    <div>
                        <div style={{ marginBottom: '24px' }}>
                            <Text>You are about to use the template:</Text>
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

                        <Divider orientation="left">Schedule</Divider>
                        
                        <div style={{ marginTop: '16px' }}>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                How many hours per week can you dedicate?
                            </Text>
                            <Input
                                type="number"
                                placeholder="Enter hours per week"
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(e.target.value)}
                                style={{ width: '200px' }}
                                min={1}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TemplateList;
