import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  // Sort by total points descending
  const sorted = [...data].sort((a, b) => b.totalPoints - a.totalPoints);
  // Safe destructuring assuming 3 groups always exist (handled in Home.tsx)
  const [first, second, third] = sorted;

  const getGroupColorClass = (group: string) => {
    switch(group) {
      case 'Green': return 'bg-green-500';
      case 'Red': return 'bg-red-500';
      case 'Blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getGroupTextClass = (group: string) => {
    switch(group) {
      case 'Green': return 'text-green-600 dark:text-green-400';
      case 'Red': return 'text-red-600 dark:text-red-400';
      case 'Blue': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-10">
      {/* Podium Display */}
      <div className="flex justify-center items-end gap-2 sm:gap-6 h-72 sm:h-96 pt-8 pb-2">
        
        {/* Second Place */}
        {second && (
          <div className="w-1/3 max-w-[150px] flex flex-col items-center group">
            <div className="mb-3 text-center transition-transform duration-300 group-hover:-translate-y-2">
                <span className={`block text-lg sm:text-2xl font-bold ${getGroupTextClass(second.group)}`}>{second.group}</span>
                <span className="text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400">{second.totalPoints} pts</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-32 sm:h-48 rounded-t-lg relative border-t-4 border-slate-400 shadow-lg flex justify-center transition-colors">
                <div className="absolute -top-4 bg-slate-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white dark:ring-slate-800">2</div>
                <div className={`absolute bottom-0 w-full h-3 ${getGroupColorClass(second.group)} opacity-80`}></div>
            </div>
          </div>
        )}

        {/* First Place */}
        {first && (
          <div className="w-1/3 max-w-[180px] flex flex-col items-center group z-10">
            <div className="mb-3 text-center transition-transform duration-300 group-hover:-translate-y-2">
                <div className="animate-bounce mb-1 text-2xl sm:text-3xl">👑</div>
                <span className={`block text-xl sm:text-3xl font-black ${getGroupTextClass(first.group)}`}>{first.group}</span>
                <span className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-500">{first.totalPoints} pts</span>
            </div>
            <div className="w-full bg-yellow-100 dark:bg-yellow-900/40 h-48 sm:h-64 rounded-t-lg relative border-t-4 border-yellow-400 shadow-xl flex justify-center transition-colors">
                <div className="absolute -top-5 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-white dark:ring-slate-800">1</div>
                <div className={`absolute bottom-0 w-full h-3 ${getGroupColorClass(first.group)} opacity-80`}></div>
            </div>
          </div>
        )}

        {/* Third Place */}
        {third && (
          <div className="w-1/3 max-w-[150px] flex flex-col items-center group">
            <div className="mb-3 text-center transition-transform duration-300 group-hover:-translate-y-2">
                <span className={`block text-lg sm:text-2xl font-bold ${getGroupTextClass(third.group)}`}>{third.group}</span>
                <span className="text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400">{third.totalPoints} pts</span>
            </div>
            <div className="w-full bg-orange-100 dark:bg-orange-900/40 h-24 sm:h-36 rounded-t-lg relative border-t-4 border-orange-400 shadow-lg flex justify-center transition-colors">
                <div className="absolute -top-4 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white dark:ring-slate-800">3</div>
                <div className={`absolute bottom-0 w-full h-3 ${getGroupColorClass(third.group)} opacity-80`}></div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide text-sm">Medal Tally & Points</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-700 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 w-16">Rank</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-4 py-4 text-center text-yellow-600 dark:text-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20" title="10 Points">🥇 Gold</th>
                <th className="px-4 py-4 text-center text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-700/30" title="6 Points">🥈 Silver</th>
                <th className="px-4 py-4 text-center text-orange-600 dark:text-orange-500 bg-orange-50/50 dark:bg-orange-900/20" title="2 Points">🥉 Bronze</th>
                <th className="px-6 py-4 text-right">Total Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {sorted.map((entry, index) => (
                <tr key={entry.group} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${index === 0 ? 'bg-yellow-50/10 dark:bg-yellow-900/10' : ''}`}>
                  <td className="px-6 py-4 font-medium text-gray-400 dark:text-gray-500">#{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full shadow-sm ${getGroupColorClass(entry.group)}`}></div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 text-base">{entry.group}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-gray-700 dark:text-gray-300 bg-yellow-50/30 dark:bg-yellow-900/10 text-base">{entry.firstPlaceCount}</td>
                  <td className="px-4 py-4 text-center font-bold text-gray-700 dark:text-gray-300 bg-gray-50/30 dark:bg-gray-700/20 text-base">{entry.secondPlaceCount}</td>
                  <td className="px-4 py-4 text-center font-bold text-gray-700 dark:text-gray-300 bg-orange-50/30 dark:bg-orange-900/10 text-base">{entry.thirdPlaceCount}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-black text-sm">
                      {entry.totalPoints}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;