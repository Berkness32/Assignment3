import React, {useState, useEffect} from 'react';
import { SERVER_URL } from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const [transcript, setTranscript] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/transcripts?studentId=3`);
                if (response.ok) {
                    const data = await response.json();
                    setTranscript(data);
                } else {
                    const rc = await response.json();
                    setMessage(`Error: ${rc.message}`);
                }
            } catch (err) {
                setMessage(`Network error: ${err}`);
            }
        };
        fetchTranscript();
    }, []);

    return(
        <> 
            <h3>Transcript</h3>
            <h4>{message}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>Course ID</th>
                        <th>Section ID</th>
                        <th>Title</th>
                        <th>Credits</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {transcript.map(enrollment => (
                        <tr key={enrollment.enrollmentId}>
                            <td>{enrollment.year}</td>
                            <td>{enrollment.semester}</td>
                            <td>{enrollment.courseId}</td>
                            <td>{enrollment.sectionId}</td>
                            <td>{enrollment.title}</td>
                            <td>{enrollment.credits}</td>
                            <td>{enrollment.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Transcript;
