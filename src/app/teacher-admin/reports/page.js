import { collection, getDocs, collectionGroup, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaChartLine, FaUsers, FaBookOpen, FaAward, FaCalendarAlt, FaChevronRight, FaSync } from 'react-icons/fa';
import TeacherAdminGuard from '../TeacherAdminGuard';

export default function ReportsPage() {
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState({
        activeStudents: 0,
        lessonsCompleted: 0,
        avgScore: 0,
        medalsEarned: 0,
        recentActivity: [],
        subjectPopularity: []
    });

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch all children profiles
            const childrenSnap = await getDocs(collectionGroup(db, 'children'));
            const children = childrenSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // 2. Fetch all achievements
            const achievementsSnap = await getDocs(collection(db, 'achievements'));
            const medalsTotal = achievementsSnap.size;

            // 3. Process Activity & Aggregates
            let totalCompleted = 0;
            let totalScore = 0;
            let scoreCount = 0;
            const activity = [];
            const subjectCounts = {};

            children.forEach(child => {
                const completed = (child.assignedTasks || []).filter(t => t.status === 'completed');
                totalCompleted += completed.length;

                completed.forEach(task => {
                    const score = parseFloat(task.score);
                    if (!isNaN(score)) {
                        totalScore += score;
                        scoreCount++;
                    }

                    // Track subject popularity
                    const subId = task.subjectId || task.taskId?.split('-')[0] || 'other';
                    subjectCounts[subId] = (subjectCounts[subId] || 0) + 1;

                    // Add to recent activity list
                    activity.push({
                        studentName: child.name || 'Student',
                        studentImage: child.profileImage || child.image,
                        taskName: task.taskName || task.taskId,
                        score: task.score,
                        completedAt: task.completedAt || new Date().toISOString(),
                        subjectId: subId
                    });
                });
            });

            // Sort activity by time
            const recent = activity
                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                .slice(0, 5);

            // Process subject popularity
            const totalTasks = Object.values(subjectCounts).reduce((a, b) => a + b, 0);
            const popularity = Object.entries(subjectCounts)
                .map(([name, count]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    pct: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
                    color: name === 'english' ? 'bg-blue-500' : name === 'math' ? 'bg-orange-500' : 'bg-green-500'
                }))
                .sort((a, b) => b.pct - a.pct)
                .slice(0, 3);

            setStats({
                activeStudents: children.length,
                lessonsCompleted: totalCompleted,
                avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
                medalsEarned: medalsTotal,
                recentActivity: recent,
                subjectPopularity: popularity.length > 0 ? popularity : [
                    { name: 'Mathematics', pct: 0, color: 'bg-blue-500' },
                    { name: 'English', pct: 0, color: 'bg-green-500' },
                    { name: 'Science', pct: 0, color: 'bg-purple-500' }
                ]
            });
        } catch (e) {
            console.error("Reports fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const statConfig = [
        { label: "Active Students", value: stats.activeStudents, icon: <FaUsers />, color: "bg-blue-500", text: "text-blue-500" },
        { label: "Lessons Completed", value: stats.lessonsCompleted, icon: <FaBookOpen />, color: "bg-green-500", text: "text-green-500" },
        { label: "Avg. Quiz Score", value: `${stats.avgScore}%`, icon: <FaChartLine />, color: "bg-purple-500", text: "text-purple-500" },
        { label: "Medals Earned", value: stats.medalsEarned, icon: <FaAward />, color: "bg-yellow-500", text: "text-yellow-500" },
    ];

    return (
        <TeacherAdminGuard>
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Learning Insights</h1>
                        <p className="text-slate-500 font-medium">Monitor student progress and curriculum performance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 hover:bg-slate-50 transition-colors"
                        >
                            <FaSync className={`${loading ? 'animate-spin' : ''} text-blue-500`} />
                            <span className="text-sm font-bold text-slate-600">Refresh Data</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statConfig.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-800 leading-none">
                                    {loading ? '...' : stat.value}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent completions */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-800">Recent Student Activity</h3>
                            <button className="text-sm font-bold text-blue-500 hover:text-blue-600">View All</button>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-200" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                                <div className="h-3 w-32 bg-slate-200 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((act, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400 overflow-hidden">
                                                {act.studentImage ? <img src={act.studentImage} alt="" className="w-full h-full object-cover" /> : act.studentName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{act.studentName}</p>
                                                <p className="text-xs text-slate-400 font-medium line-clamp-1">Completed: {act.taskName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${parseFloat(act.score) >= 80 ? 'text-green-500' : 'text-amber-500'}`}>
                                                {act.score !== undefined ? `${act.score}% Score` : 'Completed'}
                                            </p>
                                            <p className="text-[10px] text-slate-300 font-bold uppercase">
                                                {new Date(act.completedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-400 font-bold">No recent activities found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
                            <h3 className="text-xl font-bold mb-2">Weekly Summary</h3>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                {stats.activeStudents === 0 ? 'Start assigning tasks to see your student analytics!' : `Your ${stats.activeStudents} students have completed ${stats.lessonsCompleted} tasks so far.`}
                            </p>
                            <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                Download PDF <FaChevronRight size={12} />
                            </button>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Popularity</h3>
                            <div className="space-y-5">
                                {stats.subjectPopularity.map((subject, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-600">{subject.name}</span>
                                            <span className="text-slate-400">{subject.pct}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${subject.color} transition-all duration-1000`} style={{ width: `${subject.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherAdminGuard>
    );
}
