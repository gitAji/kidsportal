import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FaFilePdf, FaChartBar, FaClipboardList, FaAward, FaCertificate } from 'react-icons/fa';

const Reports = ({ childData }) => {
  const [certSubject, setCertSubject] = useState('overall');
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

  const generateCertificate = () => {
    const doc = new jsPDF('landscape');

    // Add decorative border
    doc.setTextColor(30, 64, 175); // Use setTextColor correctly
    doc.setDrawColor(30, 64, 175); // Use setDrawColor for borders
    doc.setLineWidth(4);
    doc.rect(10, 10, 277, 190);
    doc.setDrawColor(59, 130, 246); // inner border (blue-500)
    doc.setLineWidth(1);
    doc.rect(14, 14, 269, 182);

    // Calculate Evaluation Level
    const points = childData.points || 0;
    const completedTasks = childData.assignedTasks?.filter(t => t.status === 'completed') || [];
    let awardLevel = "Bronze";
    let awardColor = [205, 127, 50]; // Bronze rgb

    if (points >= 150 || completedTasks.length >= 15) {
      awardLevel = "Gold";
      awardColor = [255, 215, 0]; // Gold rgb
    } else if (points >= 50 || completedTasks.length >= 5) {
      awardLevel = "Silver";
      awardColor = [192, 192, 192]; // Silver rgb
    }

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(30, 64, 175);
    doc.text("CERTIFICATE OF COMPLETION", 148, 45, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(100, 116, 139);
    doc.text("This certificate is proudly presented to", 148, 65, { align: "center" });

    // Child Name
    doc.setFontSize(50);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("times", "italic");
    doc.text(childData.name, 148, 95, { align: "center" });

    // Descriptor
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(100, 116, 139);
    const scopeTexts = {
      'overall': `For outstanding overall achievement in Grade ${childData.grade}`,
      'math': `For outstanding achievement in Grade ${childData.grade} Mathematics`,
      'english': `For outstanding achievement in Grade ${childData.grade} English`,
      'science': `For outstanding achievement in Grade ${childData.grade} Science`
    };

    const scopeTitle = scopeTexts[certSubject] || scopeTexts['overall'];
    doc.text(scopeTitle, 148, 115, { align: "center" });

    // Stats and Evaluation
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...awardColor);
    doc.text(`${awardLevel.toUpperCase()} EVALUATION`, 148, 140, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    const statsText = `Completed Modules: ${completedTasks.length}    Stars Earned: ${points}    Stickers: ${childData.stickers?.length || 0}`;
    doc.text(statsText, 148, 155, { align: "center" });

    // Date & Signature lines
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);

    doc.line(40, 175, 100, 175);
    doc.text("Date", 70, 182, { align: "center" });
    doc.text(new Date().toLocaleDateString(), 70, 170, { align: "center" });

    doc.line(196, 175, 256, 175);
    doc.text("Authorized Signature", 226, 182, { align: "center" });
    doc.text("KidsPortal Team", 226, 170, { align: "center" });

    doc.save(`${childData.name}-${awardLevel}-Certificate.pdf`);
  };

  return (
    <div>
      <h3 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-3">
        <FaFilePdf className="text-blue-500" /> Download Reports & Certificates
      </h3>

      <div className="space-y-8">
        {/* Core Reports */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Academic Reports</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={generateProgressReport} className="p-4 bg-white border-2 border-blue-100 text-blue-600 font-bold rounded-xl flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm">
              <FaChartBar className="mr-3 text-xl" /> Full Progress Report
            </button>
            <button onClick={generateExamsReport} className="p-4 bg-white border-2 border-blue-100 text-blue-600 font-bold rounded-xl flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm">
              <FaClipboardList className="mr-3 text-xl" /> Exams Report
            </button>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Certificate Generator */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FaAward className="text-amber-500" /> Certificates of Excellence
          </h4>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-600 mb-5 font-medium">Generate a beautifully designed PDF certificate for your child based on their star and task completions! Features automatic Gold, Silver, and Bronze tiering.</p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto flex-1">
                <select
                  className="w-full bg-white border-2 border-amber-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-amber-500/30 transition-all cursor-pointer"
                  value={certSubject}
                  onChange={(e) => setCertSubject(e.target.value)}
                >
                  <option value="overall">Overall Achievement</option>
                  <option value="english">English Module</option>
                  <option value="math">Mathematics Module</option>
                  <option value="science">Science Module</option>
                </select>
              </div>
              <button
                onClick={generateCertificate}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-3 drop-shadow-sm"
              >
                <FaCertificate className="text-xl" /> Generate Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;