import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { SERVER_URL } from '../../Constants';

const ScheduleView = (props) => {
    const [schedule, setSchedule] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/enrollments?year=2023&semester=Fall&studentId=3`);
                if (response.ok) {
                    const data = await response.json();
                    setSchedule(data);
                } else {
                    const rc = await response.json();
                    setMessage(`Error: ${rc.message}`);
                }
            } catch (err) {
                setMessage(`Network error: ${err}`);
            }
        };
        fetchSchedule();
    }, []);

    const handleDrop = async (enrollmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/${enrollmentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage('Course dropped successfully');
                setSchedule(schedule.filter(e => e.enrollmentId !== enrollmentId));
            } else {
                const rc = await response.json();
                setMessage(`Error: ${rc.message}`);
            }
        } catch (err) {
            setMessage(`Network error: ${err}`);
        }
    };

    return (
        <>
            <h3>Schedule</h3>
            <h4>{message}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Title</th>
                        <th>Section No</th>
                        <th>Building</th>
                        <th>Room</th>
                        <th>Times</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map(enrollment => (
                        <tr key={enrollment.enrollmentId}>
                            <td>{enrollment.courseId}</td>
                            <td>{enrollment.title}</td>
                            <td>{enrollment.secId}</td>
                            <td>{enrollment.building}</td>
                            <td>{enrollment.room}</td>
                            <td>{enrollment.times}</td>
                            <td>
                                <Button onClick={() => handleDrop(enrollment.enrollmentId)}>Drop</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default ScheduleView;
