import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { register, login } from '../api'; // Adjust the import path as necessary

const RegLog = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false); // State for logout modal
    const [isLogin, setIsLogin] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null); // State to store the logged-in user's username

    const handleSubmit = async (values) => {
        try {
            const { username, password } = values;
            
            if (isLogin) {
                const result = await login(username, password);
                if (result.success) {
                    message.success('Login successful!');
                    setLoggedInUser(username); // Set the logged-in user's username
                    setModalOpen(false);
                } else {
                    message.error('Invalid credentials');
                }
            } else {
                const result = await register(username, password);
                if (result.success) {
                    message.success('Registration successful!');
                    setIsLogin(true); // Switch to login after registration
                } else {
                    message.error(result.error || 'Registration failed');
                }
            }
        } catch (error) {
            message.error('Network error');
        }
    };

    const handleLogout = () => {
        setLoggedInUser(null); // Clear the logged-in user's username
        setLogoutModalOpen(false); // Close the logout modal
        message.success('Logged out successfully!');
    };

    return (
        <>
            <Button 
                type="primary" 
                onClick={() => loggedInUser ? setLogoutModalOpen(true) : setModalOpen(true)}
            >
                {loggedInUser ? loggedInUser : isLogin ? 'Login' : 'Register'}
            </Button>
            
            {/* Login/Register Modal */}
            <Modal
                title={isLogin ? 'Login' : 'Register'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                <Form onFinish={handleSubmit}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    {!isLogin && (
                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Passwords must match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm Password" />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                        <Button 
                            type="link" 
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ marginLeft: 10 }}
                        >
                            {isLogin ? 'Create account' : 'Already have an account?'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Logout Modal */}
            <Modal
                title="Logout"
                open={logoutModalOpen}
                onCancel={() => setLogoutModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setLogoutModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="logout" type="primary" onClick={handleLogout}>
                        Logout
                    </Button>,
                ]}
            >
                <p>Are you sure you want to log out?</p>
            </Modal>
        </>
    );
};

export default RegLog;