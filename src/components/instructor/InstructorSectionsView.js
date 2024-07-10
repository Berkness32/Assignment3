import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

const InstructorSectionsView = (props) => {
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');
  const email = "dwisneski@csumb.edu"; // This will be dynamic in future versions
  const year = 2024; // Set the appropriate year
  const semester = "Spring"; // Set the appropriate semester

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/sections?email=${email}&year=${year}&semester=${semester}`);
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        } else {
          const json = await response.json();
          setMessage("Response error: " + json.message);
        }
      } catch (err) {
        setMessage("Network error: " + err);
      }
    };

    fetchSections();
  }, [email, year, semester]);

  return (
    <>
      <h3>Instructor Sections</h3>
      {message && <p>{message}</p>}
      {sections.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Section No</th>
              <th>Course ID</th>
              <th>Section ID</th>
              <th>Building</th>
              <th>Room</th>
              <th>Times</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map(section => (
              <tr key={section.sectionNo}>
                <td>{section.sectionNo}</td>
                <td>{section.courseId}</td>
                <td>{section.secId}</td>
                <td>{section.building}</td>
                <td>{section.room}</td>
                <td>{section.times}</td>
                <td>
                  <Link to="/enrollments" state={{ section }}>View Enrollments</Link>
                  {' | '}
                  <Link to="/assignments" state={{ section }}>View Assignments</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sections available.</p>
      )}
    </>
  );
}

export default InstructorSectionsView;