import { Calendar, Badge, Tooltip, Typography, Progress, Alert, Space, Spin, Modal, List } from 'antd';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useState } from 'react';

dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);

const LinearTaskCalendar = ({ assignments = [], templates = [], loading = false }) => {
  // State for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // 1. Verify data is loaded
  if (loading) {
    return <Spin size="large" />;
  }

  // 2. Debug logs to verify incoming data
  console.log('Raw templates:', templates);
  console.log('Raw assignments:', assignments);

  // 3. Combine assignments with template data
  const enhancedAssignments = assignments
    .map(assignment => {
      const template = templates.find(t => t.id === assignment.templateId);
      if (!template) {
        console.error(`Template not found! Assignment: ${assignment.id}, Looking for template: ${assignment.templateId}`);
        return null;
      }

      // Process tasks
      const processedTasks = (template.tasks || []).map(task => ({
        id: task.id || Math.random().toString(36).substr(2, 9),
        name: task.name || 'Unnamed Task',
        time: Number(task.time) || 0,
        originalTime: Number(task.time) || 0,
        isComplete: Boolean(task.isComplete)
      })).filter(task => task.time > 0);

      return {
        ...assignment,
        tasks: processedTasks,
        startDate: assignment.startDate || dayjs().format('YYYY-MM-DD'),
        hoursPerWeek: Math.max(1, Number(assignment.hoursPerWeek) || 1)
      };
    })
    .filter(Boolean); // Remove null entries

  // 4. Calculate progress
  const progress = enhancedAssignments.reduce((acc, assignment) => {
    assignment.tasks.forEach(task => {
      acc.total += task.originalTime;
      if (task.isComplete) acc.completed += task.originalTime;
    });
    return acc;
  }, { total: 0, completed: 0 });

  const percent = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  // 5. Generate scheduled events
  const scheduledEvents = enhancedAssignments.flatMap(assignment => {
    const events = [];
    const dailyHours = assignment.hoursPerWeek / 5;
    let currentDate = dayjs(assignment.startDate);
    let dayHoursUsed = 0;
    let taskIndex = 0;
    const tasksCopy = JSON.parse(JSON.stringify(assignment.tasks));

    while (taskIndex < tasksCopy.length) {
      const task = tasksCopy[taskIndex];
      if (!task || task.time <= 0) {
        taskIndex++;
        continue;
      }

      // Skip weekends
      while (currentDate.weekday() >= 5) {
        currentDate = currentDate.add(1, 'day');
      }

      const availableHours = dailyHours - dayHoursUsed;
      const assignHours = Math.min(availableHours, task.time);

      if (assignHours > 0) {
        events.push({
          date: currentDate.format('YYYY-MM-DD'),
          task: {
            ...task,
            hours: assignHours
          },
          isComplete: task.isComplete,
          assignmentId: assignment.id
        });

        task.time -= assignHours;
        dayHoursUsed += assignHours;

        if (task.time <= 0) taskIndex++;
      }

      if (dayHoursUsed >= dailyHours - 0.01) {
        currentDate = currentDate.add(1, 'day');
        dayHoursUsed = 0;
      }
    }

    return events;
  });

  // Debug logs
  console.log('Processed assignments:', enhancedAssignments);
  console.log('Scheduled events:', scheduledEvents);
  console.log('Progress calculation:', progress);

  // 6. Render
  return (
    <div style={{ padding: 16, height: '100%' }}>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          My Learning Plan
        </Typography.Title>

        <Progress
          percent={percent}
          status={percent === 100 ? 'success' : 'active'}
          strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
          format={() => `${progress.completed}h / ${progress.total}h (${percent}%)`}
        />

        <Alert
          message={
            percent === 100
              ? "All tasks completed! 🎉"
              : `${progress.total - progress.completed}h remaining`
          }
          type={percent === 100 ? 'success' : 'info'}
          showIcon
        />
      </Space>

      <Calendar
        cellRender={(date, info) => {
          if (info.type !== 'date') return null;
          const dateStr = date.format('YYYY-MM-DD');
          const dayEvents = scheduledEvents.filter(e => e.date === dateStr);
          
          return (
            <div 
              className="day-cell"
              onClick={() => {
                if (dayEvents.length > 0) {
                  setSelectedDate(date);
                  setSelectedEvents(dayEvents);
                  setIsModalVisible(true);
                }
              }}
              style={{ 
                cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                minHeight: '100%'
              }}
            >
              {dayEvents.map((event, i) => (
                <div key={`${dateStr}-${event.task.id}-${i}`}>
                  <Badge
                    status={event.isComplete ? 'default' : 'processing'}
                    text={`${event.task.name} (${event.task.hours}h)`}
                  />
                </div>
              ))}
            </div>
          );
        }}
        style={{ height: 'calc(100% - 150px)' }}
      />

      {/* Modal for task details */}
      <Modal
        title={`Tasks for ${selectedDate?.format('MMMM D, YYYY')}`}
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={selectedEvents}
          renderItem={(event) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Badge
                    status={event.isComplete ? 'success' : 'processing'}
                  />
                }
                title={event.task.name}
                description={
                  <>
                    <div>Hours: {event.task.hours}h</div>
                    <div>Status: {event.isComplete ? 'Completed' : 'In Progress'}</div>
                    <div>Assignment ID: {event.assignmentId}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default LinearTaskCalendar;