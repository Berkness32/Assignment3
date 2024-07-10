

// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

import React, { useState, useEffect } from 'react';
import { SERVER_URL } from "../../Constants";

const AssignmentsStudentView = () => {
  const headers = [
    "Course Id",
    "Assignment Title",
    "Assignment DueDate",
    "Score"
  ];
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');
  const studentId = 3; // Use studentId=3 for now
  const year = 2024; // Example year, adjust as necessary
  const semester = "Fall"; // Example semester, adjust as necessary

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/assignments?studentId=${studentId}&year=${year}&semester=${semester}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAssignments(data);
      } else {
        const json = await response.json();
        console.log(json);
        setMessage("response error: " + json.message);
      }
    } catch (err) {
      setMessage("network error: " + err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div>
      <h3>Assignments</h3>
      <h4>{message}</h4>
      <table className="Center">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, idx) => (
            <tr key={idx}>
              <td>{assignment.courseId}</td>
              <td>{assignment.title}</td>
              <td>{assignment.dueDate}</td>
              <td>{assignment.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsStudentView;
