import React from 'react';
import { jsPDF } from 'jspdf';
import { FaFilePdf, FaChartBar, FaClipboardList, FaTasks } from 'react-icons/fa';

const Reports = ({ childData }) => {
  const generateProgressReport = () => {
    const doc = new jsPDF();
    doc.text(`${childData.name}'s Progress Report`, 20, 10);
    if (childData.progress && childData.progress.subjects) {
      let y = 20;
      Object.entries(childData.progress.subjects).forEach(([subject, data]) => {
        doc.text(`${subject}: ${data.score}% (Level ${data.level}, ${data.stars} stars)`, 20, y);
        y += 10;
      });
    } else {
      doc.text("No progress data available.", 20, 20);
    }
    doc.save(`${childData.name}-progress-report.pdf`);
  };

  const generateTasksReport = () => {
    const doc = new jsPDF();
    doc.text(`${childData.name}'s Tasks Report`, 20, 10);
    if (childData.assignedTasks && childData.assignedTasks.length > 0) {
      let y = 20;
      childData.assignedTasks.forEach(task => {
        doc.text(`${task.name} - Status: ${task.status}`, 20, y);
        y += 10;
      });
    } else {
      doc.text("No task data available.", 20, 20);
    }
    doc.save(`${childData.name}-tasks-report.pdf`);
  };
  
  const generateExamsReport = () => {
    const doc = new jsPDF();
    doc.text(`${childData.name}'s Exams Report`, 20, 10);
    // Mock exam data for now
    const exams = [
        { name: 'Math Mid-Term', score: 85 },
        { name: 'Science Final', score: 92 },
    ];
    if (exams && exams.length > 0) {
      let y = 20;
      exams.forEach(exam => {
        doc.text(`${exam.name} - Score: ${exam.score}%`, 20, y);
        y += 10;
      });
    } else {
      doc.text("No exam data available.", 20, 20);
    }
    doc.save(`${childData.name}-exams-report.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
        <FaFilePdf className="mr-2" /> Download Reports
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={generateProgressReport} className="p-4 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600">
          <FaChartBar className="mr-2" /> Progress Report
        </button>
        <button onClick={generateExamsReport} className="p-4 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600">
          <FaClipboardList className="mr-2" /> Exams Report
        </button>
        <button onClick={generateTasksReport} className="p-4 bg-yellow-500 text-white rounded-lg flex items-center justify-center hover:bg-yellow-600">
          <FaTasks className="mr-2" /> Tasks Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
