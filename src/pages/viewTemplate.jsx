import React, { useState, useEffect } from 'react';
import { List, Input, Button, Card, Tag, Space, Typography, Modal } from 'antd';
import { getTemplates } from '../api';

const { Search } = Input;
const { Title, Text } = Typography;

const TemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template
    const [isModalOpen, setIsModalOpen] = useState(false); // State for view modal visibility
    const [isUseModalOpen, setIsUseModalOpen] = useState(false); // State for use template modal visibility
    const [hoursPerWeek, setHoursPerWeek] = useState(''); // State for hours input

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
        setSelectedTemplate(null);
        setIsModalOpen(false);
    };

    const handleUseModalClose = () => {
        setSelectedTemplate(null);
        setIsUseModalOpen(false);
        setHoursPerWeek('');
    };

    const handleUseTemplateSubmit = () => {
        console.log(`Using template: ${selectedTemplate.name}, Hours per week: ${hoursPerWeek}`);
        // Add your logic for using the template here
        handleUseModalClose();
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={1}>Templates</Title>
            
            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
                <Search
                    placeholder="Search templates or tasks"
                    allowClear
                    enterButton
                    size="large"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={loadTemplates}
                />
            </Space>

            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                dataSource={templates}
                loading={loading}
                renderItem={(template) => (
                    <List.Item>
                        <Card
                            title={template.name}
                            extra={<Tag color="blue">{Array.isArray(template.tasks) ? template.tasks.length : 0} tasks</Tag>}
                            style={{ height: '100%' }}
                            actions={[
                                <Button type="link" onClick={() => handleViewTemplate(template)}>View</Button>,
                                <Button type="link" onClick={() => handleUseTemplate(template)}>Use Template</Button>
                            ]}
                        >
                            <Text type="secondary">Created: {new Date(template.createdAt).toLocaleDateString()}</Text>
                            <div style={{ marginTop: 12 }}>
                                {Array.isArray(template.tasks) && template.tasks.slice(0, 3).map(task => (
                                    <div key={task.id} style={{ marginBottom: 4 }}>
                                        <Text>{task.name}</Text> - <Text type="secondary">{task.time} hours</Text>
                                    </div>
                                ))}
                                {Array.isArray(template.tasks) && template.tasks.length > 3 && (
                                    <Text type="secondary">+ {template.tasks.length - 3} more tasks</Text>
                                )}
                            </div>
                        </Card>
                    </List.Item>
                )}
            />

            {/* Modal for viewing template details */}
            <Modal
                title={selectedTemplate?.name}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>
                ]}
            >
                {selectedTemplate && (
                    <div>
                        <Text type="secondary">Created: {new Date(selectedTemplate.createdAt).toLocaleDateString()}</Text>
                        <div style={{ marginTop: 12 }}>
                            <Title level={4}>Tasks</Title>
                            {Array.isArray(selectedTemplate.tasks) && selectedTemplate.tasks.map(task => (
                                <div key={task.id} style={{ marginBottom: 8 }}>
                                    <Text strong>{task.name}</Text> - <Text type="secondary">{task.time} hours</Text>
                                </div>
                            ))}
                            {(!selectedTemplate.tasks || selectedTemplate.tasks.length === 0) && (
                                <Text type="secondary">No tasks available</Text>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal for using template */}
            <Modal
                title={`Use Template: ${selectedTemplate?.name}`}
                open={isUseModalOpen}
                onCancel={handleUseModalClose}
                footer={[
                    <Button key="cancel" onClick={handleUseModalClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleUseTemplateSubmit}>
                        Submit
                    </Button>
                ]}
            >
                {selectedTemplate && (
                    <div>
                        <Text type="secondary">Created: {new Date(selectedTemplate.createdAt).toLocaleDateString()}</Text>

                            <div style={{ marginTop: 24 }}>
                                <Title level={4}>Tasks</Title>
                                {Array.isArray(selectedTemplate.tasks) && selectedTemplate.tasks.map(task => (
                                    <div key={task.id} style={{ marginBottom: 8 }}>
                                        <Text strong>{task.name}</Text> - <Text type="secondary">{task.time} hours</Text>
                                    </div>
                                ))}
                                {(!selectedTemplate.tasks || selectedTemplate.tasks.length === 0) && (
                                    <Text type="secondary">No tasks available</Text>
                                )}
                            </div>
                            <div style={{ marginTop: 12 }}>
                            <Title level={4}>How many hours a week can you do?</Title>
                            <Input
                                type="number"
                                placeholder="Enter hours per week"
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TemplateList;