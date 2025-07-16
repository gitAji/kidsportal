import { useState, useEffect } from 'react';

const GradesReport = ({ childId }) => {
  const [reports, setReports] = useState([]);

  // In a real app, you would fetch the reports for the child from a database.
  useEffect(() => {
    // Mock data for now
    setReports([
      { id: 1, subject: 'Math', level: 5, score: 85, timeTaken: 240 },
      { id: 2, subject: 'English', level: 3, score: 92, timeTaken: 180 },
      { id: 3, subject: 'Science', level: 4, score: 78, timeTaken: 300 },
    ]);
  }, [childId]);

  const downloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Subject,Level,Score,Time Taken (seconds)\n"
      + reports.map(r => `${r.subject},${r.level},${r.score},${r.timeTaken}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grades_report.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[var(--background-alt)] p-8 rounded-lg shadow-lg text-[var(--foreground)]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Grades Report</h2>
        <button 
          onClick={downloadReport}
          className="bg-[var(--primary-blue)] hover:bg-[var(--deep-ocean)] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Download Report
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4">Subject</th>
              <th className="p-4">Level</th>
              <th className="p-4">Score</th>
              <th className="p-4">Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-4">{report.subject}</td>
                <td className="p-4">{report.level}</td>
                <td className="p-4">{report.score}%</td>
                <td className="p-4">{formatTime(report.timeTaken)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesReport;