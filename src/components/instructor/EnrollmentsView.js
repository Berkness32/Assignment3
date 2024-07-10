import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SERVER_URL } from "../../Constants";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

// instructor view list of students enrolled in a section
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />
//
// Partially implemented. Untested.

const EnrollmentsView = (props) => {
  const headers = [
    "enrollment id",
    "student id",
    "name",
    "email",
    "grade",
    "",
    "",
  ];
  const [enrollments, setEnrollments] = useState([ ]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  // const { secNo, courseId, secId } = location.state;
  console.log("Location state: ", location.state);
  const section = location.state;


  const fetchEnrollments = async () => {
    console.log(section.secNo);
    if (!section.secNo) {
      console.log("No Section Number");
      return;
    } 
    try {
      const response = await fetch(`${SERVER_URL}/sections/${section.secNo}/enrollments`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setEnrollments(data);
      } else {
        const json = await response.json();
        setMessage(json.message);
      }
    } catch (err) {
      setMessage("network error: " + err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const saveGrade = async (enrollmentId, newGrade) => {
    try {
      const response = await fetch(
        `${SERVER_URL}/sections/${section.secNo}/enrollments/${enrollmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ grade: newGrade }),
        },
      );
      if (response.ok) {
        setMessage("New grade saved");
        fetchEnrollments();
      } else {
        const json = await response.json();
        setMessage("response error: " + json.message);
      }
    } catch (err) {
      setMessage("network error: " + err);
    }
  };

  const onGradeChange = (e, enrollmentId) => {
    const newGrade = e.target.value;
    setEnrollments(
      enrollments.map((enrollment) =>
        enrollment.enrollmentId === enrollmentId
          ? { ...enrollment, grade: newGrade }
          : enrollment,
      ),
    );
  };

  const handleSaveGrade = (enrollmentId) => {
    const enrollment = enrollments.find(e => e.enrollmentId === enrollmentId);
    if (enrollment) {
      saveGrade(enrollmentId, enrollment.grade);
    }
  };

  return (
    <div>
      <h3>Enrollments</h3>
      <h4>{message}</h4>
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (
              <th key={idx}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.studentId}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>
                <input
                  type="text"
                  name="grade"
                  value={e.grade}
                  onChange={(event) => onGradeChange(event, e.enrollmentId)}
                />
              </td>
              <td>
                <button onClick={() => handleSaveGrade(e.enrollmentId)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default EnrollmentsView;

