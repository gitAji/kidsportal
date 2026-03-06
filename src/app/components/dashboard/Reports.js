import React from 'react';
import { jsPDF } from 'jspdf';
import { FaFilePdf, FaChartBar, FaClipboardList, FaTasks } from 'react-icons/fa';

const Reports = ({ childData }) => {
  const generateProgressReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${childData.name}'s Progress Report`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const completedTasks = childData.assignedTasks?.filter(t => t.status === 'completed') || [];
    const totalTasks = childData.assignedTasks?.length || 0;
    const completion = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    doc.text(`Overall Completion: ${completion}% (${completedTasks.length}/${totalTasks} tasks)`, 14, 40);

    // Achievements Block
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 45, 196, 45);

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text("Achievement Summary", 14, 55);

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Total Stars Collected:`, 14, 65);
    doc.setTextColor(245, 158, 11); // Amber-500
    doc.text(`${childData.points || 0} Stars`, 60, 65);

    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Stickers in Collection:`, 14, 72);
    doc.setTextColor(124, 58, 237); // Violet-600
    doc.text(`${childData.stickers?.length || 0} Stickers`, 60, 72);

    doc.line(14, 80, 196, 80);

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Completed Learning Journey", 14, 90);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    let y = 100;
    completedTasks.forEach(task => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      const scoreText = task.score !== undefined ? ` - Score: ${task.score}%` : '';
      doc.text(`• ${task.taskName}${scoreText}`, 16, y);
      y += 7;
    });

    doc.save(`${childData.name}-Progress-Report.pdf`);
  };

  const generateExamsReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${childData.name}'s Exam Report`, 14, 22);
    doc.setFontSize(12);

    const exams = childData.assignedTasks?.filter(t => t.type === 'exam' && t.status === 'completed') || [];

    if (exams.length === 0) {
      doc.text("No completed exams to report.", 14, 35);
    } else {
      let y = 35;
      exams.forEach(exam => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(`${exam.taskName} - Score: ${exam.score || 'N/A'}`, 14, y);
        y += 10;
      });
    }

    doc.save(`${childData.name}-Exams-Report.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
        <FaFilePdf className="mr-2" /> Download Reports
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={generateProgressReport} className="p-4 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600">
          <FaChartBar className="mr-2" /> Full Progress Report
        </button>
        <button onClick={generateExamsReport} className="p-4 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600">
          <FaClipboardList className="mr-2" /> Exams Report
        </button>
      </div>
    </div>
  );
};

export default Reports;