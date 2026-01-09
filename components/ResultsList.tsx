import React, { useState, useMemo } from 'react';
import { Result, Group, EventType, GROUPS, EVENT_TYPES } from '../types';

interface ResultsListProps {
  results: Result[];
  onDelete?: (ids: string[]) => void;
  isAdmin?: boolean;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, onDelete, isAdmin = false }) => {
  const [filterGroup, setFilterGroup] = useState<Group | 'All'>('All');
  const [filterType, setFilterType] = useState<EventType | 'All'>('All');
  const [search, setSearch] = useState('');

  // 1. Filter raw results
  const filteredRaw = results.filter(r => {
    const matchGroup = filterGroup === 'All' || r.group === filterGroup;
    const matchType = filterType === 'All' || r.eventType === filterType;
    const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) || 
                        r.registerNumber.toLowerCase().includes(search.toLowerCase()) ||
                        r.eventName.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchType && matchSearch;
  });

  // 2. Group by Batch ID or Event Name
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: Result[] } = {};
    
    filteredRaw.forEach(r => {
      // Use batchId if available, otherwise fallback to combining eventName and timestamp (for legacy data)
      const key = r.batchId || `${r.eventName}-${r.timestamp}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(r);
    });

    // Sort winners within each group by position
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.position - b.position);
    });

    // Return as array sorted by timestamp of the first item
    return Object.values(groups).sort((a, b) => b[0].timestamp - a[0].timestamp);
  }, [filteredRaw]);

  const getBadgeColor = (pos: number) => {
    if (pos === 1) return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 ring-2 ring-yellow-50 dark:ring-transparent';
    if (pos === 2) return 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600 ring-2 ring-gray-50 dark:ring-transparent';
    if (pos === 3) return 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700 ring-2 ring-orange-50 dark:ring-transparent';
    return 'bg-gray-50 text-gray-600';
  };

  const getGroupColor = (group: string) => {
     switch(group) {
        case 'Green': return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        case 'Red': return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        case 'Blue': return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        default: return 'text-gray-600 dark:text-gray-400';
     }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select 
            value={filterGroup} 
            onChange={(e) => setFilterGroup(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700 dark:text-gray-200"
          >
            <option value="All">All Groups</option>
            {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700 dark:text-gray-200"
          >
            <option value="All">All Events</option>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search student or event..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Results List - Grouped Cards */}
      <div className="space-y-4">
        {groupedResults.length > 0 ? groupedResults.map((groupResults, index) => {
          const eventInfo = groupResults[0];
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              {/* Event Header */}
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{eventInfo.eventName}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                        {eventInfo.eventType}
                    </span>
                </div>
                {isAdmin && onDelete && (
                    <button 
                        onClick={() => onDelete(groupResults.map(r => r.id))}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1.5 rounded transition-colors"
                    >
                        Delete Event
                    </button>
                )}
              </div>
              
              {/* Winners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
                {groupResults.map((result) => (
                  <div key={result.id} className="p-4 flex items-center gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm shadow-sm ${getBadgeColor(result.position)}`}>
                        {result.position === 1 ? '1st' : result.position === 2 ? '2nd' : '3rd'}
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{result.studentName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{result.registerNumber}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getGroupColor(result.group)}`}>
                            {result.group}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-gray-900 dark:text-white text-lg">{result.points}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">Pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 transition-colors">
            <p className="text-gray-400 dark:text-gray-500 italic">No results found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsList;