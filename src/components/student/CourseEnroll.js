import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { SERVER_URL } from '../../Constants';

const CourseEnroll = (props) => {
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/sections/open`);
                if (response.ok) {
                    const data = await response.json();
                    setSections(data);
                } else {
                    const rc = await response.json();
                    setMessage(`Error: ${rc.message}`);
                }
            } catch (err) {
                setMessage(`Network error: ${err}`);
            }
        };
        fetchSections();
    }, []);

    const handleEnroll = async (secNo) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`, {
                method: 'POST',
            });

            if (response.ok) {
                setMessage('Enrolled successfully');
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
            <h3>Open Sections</h3>
            <h4>{message}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Section No</th>
                        <th>Course ID</th>
                        <th>Title</th>
                        <th>Instructor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map(section => (
                        <tr key={section.secNo}>
                            <td>{section.secNo}</td>
                            <td>{section.courseId}</td>
                            <td>{section.title}</td>
                            <td>{section.instructorName}</td>
                            <td>
                                <Button onClick={() => handleEnroll(section.secNo)}>Enroll</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default CourseEnroll;
