import React, { useState, useEffect } from "react";
import { SERVER_URL } from "../../Constants";
import { useLocation } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { Link } from "react-router-dom";

// instructor views a list of sections they are teaching
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {
  const headers = [
    "section no",
    "course id",
    "section id",
    "building",
    "room",
    "times",
    "enrollments",
    "assignments",
  ];
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState("");
  const email = "dwisneski@csumb.edu"; // This will be dynamic in future versions

  const location = useLocation();
  const { year, semester } = location.state;

  useEffect(() => {
    fetchSections();
  }, [email, year, semester]);

  const fetchSections = async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/sections?email=${email}&year=${year}&semester=${semester}`,
      );
      if (response.ok) {
        const sections = await response.json();
        setSections(sections);
      } else {
        const json = await response.json();
        setMessage("response error: " + json.message);
      }
    } catch (err) {
      setMessage("network error: " + err);
    }
  };

  return (
    <div>
      <h3>{message}</h3>
      {sections.length > 0 && (
        <>
          <h3>
            Sections {year} {semester}{" "}
          </h3>

          <table className="Center">
            <thead>
              <tr>
                {headers.map((s, idx) => (
                  <th key={idx}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.secNo}>
                  <td>{section.secNo}</td>
                  <td>{section.courseId}</td>
                  <td>{section.secId}</td>
                  <td>{section.building}</td>
                  <td>{section.room}</td>
                  <td>{section.times}</td>
                  <td>
                    <Link to="/enrollments" state={section}>
                      Enrollments
                    </Link>
                  </td>
                  <td>
                    <Link to="/assignments" state={section}>
                      Assignments
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default InstructorSectionsView;