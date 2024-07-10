import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import AssignmentAdd from './AssignmentAdd';
import Button from '@mui/material/Button';

const AssignmentsView = (props) => {
    const location = useLocation();
    const { secNo, courseId, secId } = location.state || {};
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!secNo) {
            setMessage('Section number is missing');
            return;
        }

        const fetchAssignments = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
                if (response.ok) {
                    const data = await response.json();
                    setAssignments(data);
                } else {
                    const rc = await response.json();
                    setMessage(`Error: ${rc.message}`);
                }
            } catch (err) {
                setMessage(`Network error: ${err}`);
            }
        };
        fetchAssignments();
    }, [secNo]);

    const handleDelete = async (assignmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage('Assignment deleted successfully');
                setAssignments(assignments.filter(a => a.id !== assignmentId));
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
            <h3>Assignments</h3>
            <h4>{message}</h4>
            {assignments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(a => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.title}</td>
                                <td>{a.dueDate}</td>
                                <td>
                                    <AssignmentUpdate assignment={a} />
                                    <AssignmentGrade assignmentId={a.id} />
                                    <Button onClick={() => handleDelete(a.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No assignments available.</p>
            )}
            <AssignmentAdd />
        </>
    );
};

export default AssignmentsView;
