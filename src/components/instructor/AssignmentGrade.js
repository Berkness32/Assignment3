import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { SERVER_URL } from '../../Constants';

const AssignmentGrade = (props) => {
    const { assignmentId } = props;
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}/grades`);
                if (response.ok) {
                    const data = await response.json();
                    setGrades(data);
                } else {
                    const rc = await response.json();
                    setMessage(`Error: ${rc.message}`);
                }
            } catch (err) {
                setMessage(`Network error: ${err}`);
            }
        };
        fetchGrades();
    }, [assignmentId]);

    const handleChange = (event, gradeId) => {
        const updatedGrades = grades.map(g => {
            if (g.gradeId === gradeId) {
                return { ...g, score: event.target.value };
            }
            return g;
        });
        setGrades(updatedGrades);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grades),
            });

            if (response.ok) {
                setMessage('Grades saved successfully');
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
            <h3>Grades</h3>
            <h4>{message}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Grade ID</th>
                        <th>Student Name</th>
                        <th>Student Email</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map(g => (
                        <tr key={g.gradeId}>
                            <td>{g.gradeId}</td>
                            <td>{g.studentName}</td>
                            <td>{g.studentEmail}</td>
                            <td>
                                <input
                                    type="text"
                                    name="score"
                                    value={g.score}
                                    onChange={(event) => handleChange(event, g.gradeId)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button onClick={handleSave}>Save Grades</Button>
        </>
    );
};

export default AssignmentGrade;