import React from 'react';
import { Badge, Calendar, Typography } from 'antd';
import { Splitter, Flex } from 'antd';
import '../styles/home.css'; // Import your CSS file for styling

const getListData = (value) => {
    let listData = [];
    switch (value.date()) {
        case 8:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is usual event.' },
            ];
            break;
        case 10:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is usual event.' },
                { type: 'error', content: 'This is error event.' },
            ];
            break;
        case 15:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is very long usual event......' },
                { type: 'error', content: 'This is error event 1.' },
                { type: 'error', content: 'This is error event 2.' },
                { type: 'error', content: 'This is error event 3.' },
                { type: 'error', content: 'This is error event 4.' },
            ];
            break;
        default:
    }
    return listData || [];
};

const getMonthData = (value) => {
    if (value.month() === 8) {
        return 1394;
    }
};

const Home = () => {
    const monthCellRender = (value) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };

    const Desc = ({ text }) => (
        <Flex justify="center" align="center" style={{ height: '100%' }}>
            <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
                {text}
            </Typography.Title>
        </Flex>
    );

    return (
        <Splitter layout="vertical" style={{ height: '100vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Splitter.Panel >
                <Splitter layout="horizontal">
                    <Splitter.Panel>
                        <Desc text="Top-Left" />
                    </Splitter.Panel>
                    <Splitter.Panel>
                        <Desc text="Top-Right" />
                    </Splitter.Panel>
                </Splitter>
            </Splitter.Panel>
            <Splitter.Panel collapsible>
                <Calendar cellRender={cellRender} />
            </Splitter.Panel>
        </Splitter>
    );
};

export default Home;