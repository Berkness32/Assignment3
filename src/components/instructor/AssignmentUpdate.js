import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SERVER_URL } from '../../Constants';

const AssignmentUpdate = (props) => {
    const { assignment } = props;
    const [open, setOpen] = useState(false);
    const [updatedAssignment, setUpdatedAssignment] = useState(assignment);
    const [message, setMessage] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    };

    const handleChange = (event) => {
        setUpdatedAssignment({ ...updatedAssignment, [event.target.name]: event.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAssignment),
            });

            if (response.ok) {
                setMessage('Assignment updated successfully');
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
            <Button onClick={handleClickOpen}>Edit</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Assignment</DialogTitle>
                <DialogContent>
                    <h4>{message}</h4>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        name="title"
                        fullWidth
                        value={updatedAssignment.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        fullWidth
                        value={updatedAssignment.dueDate}
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

export default AssignmentUpdate;
