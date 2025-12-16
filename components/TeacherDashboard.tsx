import React from 'react';
import { MOCK_STUDENT_STATS } from '../constants';
import { exportToCSV } from '../utils/exportHelper';
import { Level } from '../types';

interface TeacherDashboardProps {
  onBack: () => void;
  levels: Level[];
  onUpdateLevelTime: (id: number, newTime: number) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack, levels, onUpdateLevelTime }) => {
  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(MOCK_STUDENT_STATS, `CodeHeroHK_Stats_${timestamp}`);
  };

  return (
    <div className="flex-1 bg-slate-100 text-slate-900 overflow-y-auto font-sans">
      <header className="bg-white shadow border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
        <div>
            <h1 className="text-2xl font-bold text-hk-dark">教師管理儀表板</h1>
            <p className="text-sm text-slate-500">中二電腦科 - Python 單元</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2"
            >
                <span>📊</span> 匯出 Excel (CSV)
            </button>
            <button 
                onClick={onBack}
                className="bg-slate-800 text-white px-4 py-2 rounded shadow hover:bg-slate-900"
            >
                登出
            </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-sm font-bold uppercase">總學生人數</h3>
                <p className="text-3xl font-bold text-slate-800 mt-2">{MOCK_STUDENT_STATS.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-sm font-bold uppercase">平均完成時間</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">54s</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-sm font-bold uppercase">需要協助學生</h3>
                <p className="text-3xl font-bold text-red-500 mt-2">
                    {MOCK_STUDENT_STATS.filter(s => s.status === 'Failed' || s.attempts > 3).length}
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-sm font-bold uppercase">課程進度</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">60%</p>
            </div>
        </div>

        {/* Level Settings */}
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <h2 className="font-bold text-lg text-slate-800">關卡設定 (時間限制)</h2>
            </div>
            <div className="p-6">
                <div className="grid gap-4">
                    {levels.map(level => (
                        <div key={level.id} className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200">
                            <div>
                                <div className="font-bold text-slate-700 text-lg">{level.title}</div>
                                <div className="text-sm text-slate-500">{level.objective}</div>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-2 rounded border border-slate-300">
                                <label className="text-sm font-bold text-slate-600">限時 (秒):</label>
                                <input 
                                    type="number" 
                                    min="10"
                                    max="600"
                                    value={level.timeLimit}
                                    onChange={(e) => onUpdateLevelTime(level.id, Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-center font-mono font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-slate-400 text-right">* 修改後將即時應用於學生端</p>
            </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-bold text-lg">學生實時數據</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold">
                        <tr>
                            <th className="px-6 py-3">學生編號</th>
                            <th className="px-6 py-3">姓名</th>
                            <th className="px-6 py-3">班級</th>
                            <th className="px-6 py-3">當前關卡</th>
                            <th className="px-6 py-3">狀態</th>
                            <th className="px-6 py-3 text-center">嘗試次數</th>
                            <th className="px-6 py-3 text-center">耗時 (秒)</th>
                            <th className="px-6 py-3">最後活動</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_STUDENT_STATS.map((student) => (
                            <tr key={student.studentId} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-mono text-slate-500">{student.studentId}</td>
                                <td className="px-6 py-3 font-medium text-slate-900">{student.name}</td>
                                <td className="px-6 py-3">{student.class}</td>
                                <td className="px-6 py-3">Level {student.levelId}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${student.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                                        ${student.status === 'Failed' ? 'bg-red-100 text-red-700' : ''}
                                        ${student.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : ''}
                                    `}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className={`px-6 py-3 text-center font-bold ${student.attempts > 3 ? 'text-red-500' : ''}`}>
                                    {student.attempts}
                                </td>
                                <td className="px-6 py-3 text-center">{student.timeSpent}</td>
                                <td className="px-6 py-3 text-slate-500 text-xs">{student.lastPlayed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
