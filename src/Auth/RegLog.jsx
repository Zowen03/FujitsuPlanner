import React, { useState, useContext } from 'react';
import { Button, Modal, Form, Input, message, Avatar, Upload, Divider, Descriptions } from 'antd';
import { register, login, uploadProfilePicture } from '../api';
import { UserContext } from './UserContext';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';

const RegLog = ({ modalOpen: propModalOpen, setModalOpen: propSetModalOpen }) => {
    const { loggedInUser, setLoggedInUser, userDetails, setUserDetails } = useContext(UserContext);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const isModalControlled = propModalOpen !== undefined;
    const [internalModalOpen, setInternalModalOpen] = useState(false);
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
                    setUserDetails(result.userDetails || { username });
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
        setUserDetails(null);
        setLogoutModalOpen(false);
        message.success('Logged out successfully!');
    };

    const handleUpload = async (file) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('profilePicture', file);
            formData.append('username', loggedInUser);
            
            const result = await uploadProfilePicture(formData);
            if (result.success) {
                message.success('Profile picture updated!');
                setUserDetails({
                    ...userDetails,
                    profilePicture: result.profilePictureUrl
                });
                setFileList([]);
            } else {
                message.error(result.error || 'Failed to upload profile picture');
            }
        } catch (error) {
            message.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const uploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            handleUpload(file);
            return false;
        },
        fileList,
        maxCount: 1,
        accept: 'image/*',
        showUploadList: true
    };

    return (
        <>
            {!isModalControlled && (
                <Button 
                  type="primary" 
                    onClick={() => loggedInUser ? setLogoutModalOpen(true) : setModalOpen(true)}
                    style={{ 
                        height: 'auto', // Allow button to expand vertically
                        padding: '12px 16px', // Adjust padding as needed
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px' // Space between avatar and text
                    }}
>
                {loggedInUser ? (
                    <>
                        <Avatar 
                            size="large"  // or use a specific number like 32
                            src={userDetails?.profilePicture} 
                            icon={<UserOutlined />}
                            style={{ margin: 0 }} // Remove any horizontal margin
                        />
                        <span style={{ fontSize: '0.85em' }}>{loggedInUser}</span>
                    </>
                ) : isLogin ? 'Login' : 'Register'}
            </Button>
            )}
            
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

            {/* Account Details Modal */}
            {!isModalControlled && (
                <Modal
                    title="Account Details"
                    open={logoutModalOpen}
                    onCancel={() => setLogoutModalOpen(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setLogoutModalOpen(false)}>
                            Close
                        </Button>,
                        <Button key="logout" type="primary" danger onClick={handleLogout}>
                            Logout
                        </Button>,
                    ]}
                    width={600}
                >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Upload {...uploadProps}>
                            <Avatar 
                                size={128} 
                                src={userDetails?.profilePicture} 
                                icon={<UserOutlined />}
                                style={{ cursor: 'pointer' }}
                            />
                            <div style={{ marginTop: 16 }}>
                                <Button 
                                    icon={<CameraOutlined />} 
                                    loading={uploading}
                                >
                                    Change Profile Picture
                                </Button>
                            </div>
                        </Upload>
                    </div>

                    <Divider />

                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Username">
                            {loggedInUser}
                        </Descriptions.Item>
                        <Descriptions.Item label="Member Since">
                            {userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'Unknown'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {userDetails?.email || 'Not provided'}
                        </Descriptions.Item>
                    </Descriptions>
                </Modal>
            )}
        </>
    );
};

export default RegLog;