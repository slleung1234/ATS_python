import React, { useState } from 'react';
import { StudentSession } from '../types';

interface StudentLoginProps {
  onLogin: (session: StudentSession) => void;
  onBack: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin, onBack }) => {
  const [studentClass, setStudentClass] = useState('');
  const [classNumber, setClassNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentClass && classNumber) {
      onLogin({ studentClass, classNumber });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-hk-dark p-8 relative overflow-hidden text-white font-sans">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
      
      <div className="z-10 w-full max-w-md bg-hk-panel border border-slate-700 p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-hk-neon-blue mb-2 text-center">學生登入</h2>
        <p className="text-slate-400 text-center mb-6 text-sm">請輸入你的班別資料以開始紀錄</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 text-sm font-bold">班別 (Class)</label>
            <input
              type="text"
              required
              placeholder="e.g. 2A"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value.toUpperCase())}
              className="w-full bg-[#0d1117] border border-slate-600 rounded p-3 text-white focus:border-hk-neon-blue focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2 text-sm font-bold">學號 (Class No.)</label>
            <input
              type="text"
              required
              placeholder="e.g. 15"
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              className="w-full bg-[#0d1117] border border-slate-600 rounded p-3 text-white focus:border-hk-neon-blue focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-hk-neon-blue text-black font-bold py-3 rounded hover:bg-[#33f3ff] transition-all transform hover:scale-[1.02] shadow-[0_0_15px_#00f0ff44]"
          >
            開始冒險 (Start Adventure)
          </button>
        </form>
        <button onClick={onBack} className="w-full mt-4 text-slate-500 text-sm hover:text-white transition-colors">
          &larr; 返回首頁
        </button>
      </div>
    </div>
  );
};

export default StudentLogin;
