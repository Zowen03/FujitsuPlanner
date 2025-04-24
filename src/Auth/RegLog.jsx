import React, { useState, useContext } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { register, login } from '../api';
import { UserContext } from './UserContext'; // Import the UserContext

const RegLog = ({ modalOpen: propModalOpen, setModalOpen: propSetModalOpen }) => {
    // Get user context
    const { loggedInUser, setLoggedInUser } = useContext(UserContext);
    
    // Use props if provided, otherwise use internal state for modal
    const isModalControlled = propModalOpen !== undefined;
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    // Determine which modal state to use
    const modalOpen = isModalControlled ? propModalOpen : internalModalOpen;
    const setModalOpen = isModalControlled ? propSetModalOpen : setInternalModalOpen;

    const handleSubmit = async (values) => {
        try {
            const { username, password } = values;

            if (isLogin) {
                const result = await login(username, password);
                if (result.success) {
                    message.success('Login successful!');
                    setLoggedInUser(username);
                    setModalOpen(false);
                } else {
                    message.error(result.error || 'Invalid credentials');
                }
            } else {
                const result = await register(username, password);
                if (result.success) {
                    message.success('Registration successful!');
                    setIsLogin(true);
                } else {
                    message.error(result.error || 'Registration failed');
                }
            }
        } catch (error) {
            message.error('Network error');
        }
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setLogoutModalOpen(false);
        message.success('Logged out successfully!');
    };

    // Render the button only if the modal is not controlled
    const renderButton = !isModalControlled && (
        <Button 
            type="primary" 
            onClick={() => loggedInUser ? setLogoutModalOpen(true) : setModalOpen(true)}
        >
            {loggedInUser ? loggedInUser : isLogin ? 'Login' : 'Register'}
        </Button>
    );

    return (
        <>
            {renderButton}
            
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
                                { required: true, message: 'Please confirm your password!' },
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

            {/* Logout Modal - only shown when using internal modal state */}
            {!isModalControlled && (
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
            )}
        </>
    );
};

export default RegLog;