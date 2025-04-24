import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, List, message } from 'antd';
import { createTemplate } from '../api';

const CreateTemplate = () => {
    const [templateName, setTemplateName] = useState('');
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [taskTime, setTaskTime] = useState('');
    const [loading, setLoading] = useState(false);

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
        
        setLoading(true);
        try {
            const response = await createTemplate({
                name: templateName,
                tasks: tasks
            });
            
            if (response.success) {
                message.success('Template created successfully!');
                setTemplateName('');
                setTasks([]);
            }
        } catch (error) {
            message.error('Failed to create template');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ padding: '20px' }}>
            <h1>Create Template</h1>
            <Form layout="vertical" style={{ maxWidth: 600 }}>
                <Form.Item label="Template Name" required>
                    <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Enter template name"
                    />
                </Form.Item>
                <Form.Item label="Add Task">
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
                <Form.Item label="Tasks">
                    <List
                        bordered
                        dataSource={tasks}
                        renderItem={(task, index) => (
                            <List.Item
                                actions={[
                                    <Button type="link" onClick={() => handleRemoveTask(index)}>
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
                    >
                        Create Template
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateTemplate;