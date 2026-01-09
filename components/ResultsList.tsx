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
    if (pos === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200 ring-2 ring-yellow-50';
    if (pos === 2) return 'bg-gray-100 text-gray-800 border-gray-200 ring-2 ring-gray-50';
    if (pos === 3) return 'bg-orange-100 text-orange-800 border-orange-200 ring-2 ring-orange-50';
    return 'bg-gray-50 text-gray-600';
  };

  const getGroupColor = (group: string) => {
     switch(group) {
        case 'Green': return 'text-green-700 bg-green-50 border-green-200';
        case 'Red': return 'text-red-700 bg-red-50 border-red-200';
        case 'Blue': return 'text-blue-700 bg-blue-50 border-blue-200';
        default: return 'text-gray-600';
     }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select 
            value={filterGroup} 
            onChange={(e) => setFilterGroup(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700"
          >
            <option value="All">All Groups</option>
            {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700"
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
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Results List - Grouped Cards */}
      <div className="space-y-4">
        {groupedResults.length > 0 ? groupedResults.map((groupResults, index) => {
          const eventInfo = groupResults[0];
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Event Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">{eventInfo.eventName}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {eventInfo.eventType}
                    </span>
                </div>
                {isAdmin && onDelete && (
                    <button 
                        onClick={() => onDelete(groupResults.map(r => r.id))}
                        className="text-red-500 hover:text-red-700 text-xs font-bold border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                    >
                        Delete Event
                    </button>
                )}
              </div>
              
              {/* Winners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {groupResults.map((result) => (
                  <div key={result.id} className="p-4 flex items-center gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm shadow-sm ${getBadgeColor(result.position)}`}>
                        {result.position === 1 ? '1st' : result.position === 2 ? '2nd' : '3rd'}
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{result.studentName}</p>
                        <p className="text-xs text-gray-500 mb-1">{result.registerNumber}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getGroupColor(result.group)}`}>
                            {result.group}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-gray-900 text-lg">{result.points}</span>
                        <span className="text-[10px] text-gray-400 uppercase">Pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 italic">No results found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsList;