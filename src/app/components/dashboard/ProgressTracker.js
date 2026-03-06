import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FaChartBar, FaBook, FaCheckCircle, FaPercentage, FaFire, FaTrophy, FaTasks, FaRegClock } from 'react-icons/fa';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-xl shadow-xl border border-slate-700">
        <p className="font-bold text-sm mb-1">{label}</p>
        <p className="text-amber-400 font-black text-lg">Score: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const ProgressTracker = ({ child }) => {
  const { progress, assignedTasks } = child;

  if (!assignedTasks || assignedTasks.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center text-slate-500">
        <FaChartBar className="text-6xl text-slate-300 mx-auto mb-4" />
        <p className="text-lg font-bold text-slate-600 mt-4">Waiting for Liftoff! 🚀</p>
        <p className="text-sm">Your child's progress will appear here once they complete their first tasks.</p>
      </div>
    );
  }

  const completedTasks = assignedTasks.filter(t => t.status === 'completed');
  const overallCompletion = Math.round((completedTasks.length / assignedTasks.length) * 100);

  // Aggregate scores by subject
  const subjectProgress = {};
  completedTasks.forEach(task => {
    const subjectName = task.taskId.split('-')[0];
    if (!subjectProgress[subjectName]) {
      subjectProgress[subjectName] = { scores: [], count: 0 };
    }
    if (task.score !== undefined) {
      subjectProgress[subjectName].scores.push(task.score);
    }
    subjectProgress[subjectName].count++;
  });

  const chartData = Object.keys(subjectProgress).map(subject => ({
    name: subject.charAt(0).toUpperCase() + subject.slice(1),
    avgScore: subjectProgress[subject].scores.reduce((a, b) => a + b, 0) / subjectProgress[subject].scores.length,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8">

      {/* Overview Cards */}
      <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
        <FaFire className="text-orange-500" /> Performance Overview
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3 text-xl">
            <FaBook />
          </div>
          <p className="text-3xl font-black text-slate-800">{assignedTasks.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Tasks</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-3 text-xl">
            <FaTrophy />
          </div>
          <p className="text-3xl font-black text-emerald-500">{completedTasks.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Completed</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-3 text-xl">
            <FaRegClock />
          </div>
          <p className="text-3xl font-black text-amber-500">{assignedTasks.length - completedTasks.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-2 bg-slate-100">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${overallCompletion}%` }} />
          </div>
          <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-3 text-xl">
            <FaChartBar />
          </div>
          <p className="text-3xl font-black text-indigo-500">{overallCompletion}%</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Done</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 w-full">
          <FaPercentage className="text-fuchsia-500" /> Subject Averages
        </h3>
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 'bold' }} dx={-10} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="avgScore" radius={[8, 8, 8, 8]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-10 font-bold">No graded tasks completed yet.</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <FaCheckCircle className="text-green-500" /> Recent Activity Log
        </h3>
        {completedTasks.length > 0 ? (
          <ul className="space-y-3">
            {completedTasks.slice(-5).reverse().map((task, idx) => (
              <li key={task.taskId + idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-full">
                    <FaCheckCircle />
                  </div>
                  <span className="font-bold text-slate-700">{task.taskName}</span>
                </div>
                {task.score !== undefined && (
                  <span className="font-black text-amber-500 bg-amber-100 px-3 py-1 rounded-full text-sm">
                    {task.score}%
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-center py-8 font-bold">No tasks recently completed.</p>
        )}
      </div>

    </div>
  );
};

export default ProgressTracker;