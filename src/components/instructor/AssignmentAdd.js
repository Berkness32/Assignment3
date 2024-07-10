import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SERVER_URL } from '../../Constants';

const AssignmentAdd = (props) => {
    const { courseId, secNo } = props;
    const [open, setOpen] = useState(false);
    const [assignment, setAssignment] = useState({ title: '', dueDate: '' , courseId, secNo});
    const [message, setMessage] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
        setAssignment({ title: '', dueDate: '', courseId, secNo});
        setMessage('');
    };

    const handleChange = (event) => {
        setAssignment({ ...assignment, [event.target.name]: event.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignment),
            });

            if (response.ok) {
                setMessage('Assignment added successfully');
                handleClose();
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
            <Button onClick={handleClickOpen}>Add Assignment</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent>
                    <h4>{message}</h4>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        name="title"
                        fullWidth
                        value={assignment.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        fullWidth
                        value={assignment.dueDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Close</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AssignmentAdd;
