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
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

    const handleModalClose = () => {
        setSelectedTemplate(null);
        setIsModalOpen(false);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Templates</Title>
            
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
                                <Button type="link">Use Template</Button>
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
        </div>
    );
};

export default TemplateList;