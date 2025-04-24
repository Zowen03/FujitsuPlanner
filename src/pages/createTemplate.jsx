import React, { useState, useContext } from 'react';
import { Button, Form, Input, InputNumber, List, message, Typography, Space } from 'antd';
import { createTemplate } from '../api';
import RegLog from '../Auth/RegLog';
import { UserContext } from '../Auth/UserContext';

const { Title, Text } = Typography;

const CreateTemplate = () => {
    const [templateName, setTemplateName] = useState('');
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [taskTime, setTaskTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    const { loggedInUser } = useContext(UserContext);

    const handleAddTask = () => {
        if (taskName && taskTime) {
            setTasks([...tasks, { 
                name: taskName, 
                time: taskTime,
                id: Date.now().toString() 
            }]);
            setTaskName('');
            setTaskTime('');
        }
    };

    const handleRemoveTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleSubmit = async () => {
        if (!templateName || tasks.length === 0) return;

        if (!loggedInUser) {
            message.error('You must be logged in to create a template.');
            setShowLoginModal(true);
            return;
        }

        setLoading(true);
        try {
            const response = await createTemplate({
                name: templateName,
                tasks: tasks,
            });

            if (response.success) {
                message.success('Template created successfully!');
                setTemplateName('');
                setTasks([]);
            } else {
                message.error('Failed to create template');
            }
        } catch (error) {
            message.error('Failed to create template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={1}>Create Template</Title>
            {!loggedInUser ? (
                <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
                    <Text style={{ display: 'block', marginBottom: '16px' }}>
                        You must be logged in to create a template.
                    </Text>
                    <Button 
                        type="primary" 
                        onClick={() => setShowLoginModal(true)}
                        style={{ width: '120px' }}
                    >
                        Login / Register
                    </Button>
                </Space>
            ) : (
                <Form layout="vertical" style={{ maxWidth: 600 }}>
                    <Form.Item label={<Text strong>Template Name</Text>} required>
                        <Input
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Enter template name"
                        />
                    </Form.Item>
                    <Form.Item label={<Text strong>Add Task</Text>}>
                        <Input
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Task Name"
                            style={{ marginBottom: '10px' }}
                        />
                        <InputNumber
                            value={taskTime}
                            onChange={(value) => setTaskTime(value)}
                            placeholder="Time Estimation (hours)"
                            style={{ marginBottom: '10px', width: '100%' }}
                        />
                        <Button type="primary" onClick={handleAddTask}>
                            Add Task
                        </Button>
                    </Form.Item>
                    <Form.Item label={<Text strong>Tasks</Text>}>
                        <List
                            bordered
                            dataSource={tasks}
                            renderItem={(task) => (
                                <List.Item
                                    actions={[
                                        <Button type="link" onClick={() => handleRemoveTask(task.id)}>
                                            Remove
                                        </Button>,
                                    ]}
                                >
                                    {task.name} - {task.time} hours
                                </List.Item>
                            )}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            disabled={!templateName || tasks.length === 0}
                            loading={loading}
                        >
                            Create Template
                        </Button>
                    </Form.Item>
                </Form>
            )}

            <RegLog
                modalOpen={showLoginModal}
                setModalOpen={setShowLoginModal}
            />
        </div>
    );
};

export default CreateTemplate;