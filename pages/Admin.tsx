import React, { useState } from 'react';
import { Result, Group, EventType, GROUPS, EVENT_TYPES, POINTS_MAP, SportsEvent } from '../types';
import { addResult, deleteResultsBatch, addEvent, deleteEvent } from '../services/db';
import ResultsList from '../components/ResultsList';

interface AdminProps {
  results: Result[];
  events: SportsEvent[];
  refreshData: () => void;
  onCelebrate: () => void;
}

// Initial state for a single winner entry
const INITIAL_WINNER_STATE = {
  studentName: '',
  registerNumber: '',
  group: 'Green' as Group,
};

const Admin: React.FC<AdminProps> = ({ results, events, refreshData, onCelebrate }) => {
  const [activeTab, setActiveTab] = useState<'results' | 'events'>('results');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- RESULT FORM STATE ---
  const [selectedEventId, setSelectedEventId] = useState('');
  
  // We keep state for 3 positions: 1, 2, 3
  const [winners, setWinners] = useState<{
    1: typeof INITIAL_WINNER_STATE & { points: number };
    2: typeof INITIAL_WINNER_STATE & { points: number };
    3: typeof INITIAL_WINNER_STATE & { points: number };
  }>({
    1: { ...INITIAL_WINNER_STATE, group: 'Green', points: POINTS_MAP[1] },
    2: { ...INITIAL_WINNER_STATE, group: 'Red', points: POINTS_MAP[2] },
    3: { ...INITIAL_WINNER_STATE, group: 'Blue', points: POINTS_MAP[3] },
  });

  // --- EVENT FORM STATE ---
  const [eventForm, setEventForm] = useState({
    name: '',
    type: 'Athletics' as EventType
  });

  // --- RESULT HANDLERS ---

  const handleWinnerChange = (pos: 1 | 2 | 3, field: string, value: any) => {
    setWinners(prev => ({
      ...prev,
      [pos]: { ...prev[pos], [field]: value }
    }));
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      alert("Please select an event first.");
      return;
    }

    const selectedEvent = events.find(ev => ev.id === selectedEventId);
    if (!selectedEvent) return;

    // Validation: At least one winner must be entered
    const hasWinner = winners[1].studentName || winners[2].studentName || winners[3].studentName;
    if (!hasWinner) {
      alert("Please enter details for at least one winner.");
      return;
    }

    setIsSubmitting(true);
    const batchId = Date.now().toString(); // ID to link these results together
    const timestamp = Date.now();

    try {
      const promises = [];
      
      // Loop through positions 1, 2, 3
      for (const pos of [1, 2, 3] as const) {
        const winner = winners[pos];
        // Only save if student name is provided
        if (winner.studentName.trim()) {
          promises.push(addResult({
            studentName: winner.studentName,
            registerNumber: winner.registerNumber.toUpperCase(),
            group: winner.group,
            eventName: selectedEvent.name,
            eventType: selectedEvent.type,
            position: pos,
            points: Number(winner.points),
            timestamp: timestamp,
            batchId: batchId 
          }));
        }
      }

      await Promise.all(promises);
      
      // Reset Form
      setSelectedEventId('');
      setWinners({
        1: { ...INITIAL_WINNER_STATE, group: 'Green', points: POINTS_MAP[1] },
        2: { ...INITIAL_WINNER_STATE, group: 'Red', points: POINTS_MAP[2] },
        3: { ...INITIAL_WINNER_STATE, group: 'Blue', points: POINTS_MAP[3] },
      });
      
      refreshData();
      alert("Event results published successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add results.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResultDelete = async (ids: string[]) => {
    if (window.confirm("Are you sure you want to delete this entire event result?")) {
      try {
        await deleteResultsBatch(ids);
        refreshData();
      } catch (e) {
        alert("Failed to delete.");
      }
    }
  };

  // --- EVENT HANDLERS ---
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.name) return;

    setIsSubmitting(true);
    try {
      await addEvent({
        name: eventForm.name,
        type: eventForm.type
      });
      setEventForm({ name: '', type: 'Athletics' });
      refreshData();
      alert("Event created successfully!");
    } catch (e) {
      alert("Failed to create event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventDelete = async (id: string) => {
    if (window.confirm("Delete this event?")) {
      try {
        await deleteEvent(id);
        refreshData();
      } catch (e) {
        alert("Failed to delete event.");
      }
    }
  };

  // --- CELEBRATION HANDLER ---
  const handlePublishClick = () => {
    if (window.confirm("Are you sure you want to publish the Grand Total? This will trigger the celebration animation.")) {
        onCelebrate();
    }
  };

  const renderWinnerInput = (pos: 1 | 2 | 3, colorClass: string, label: string) => (
    <div className={`p-4 rounded-lg border-2 ${colorClass} bg-white shadow-sm`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-gray-800 flex items-center gap-2">
           <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs text-white ${pos === 1 ? 'bg-yellow-500' : pos === 2 ? 'bg-gray-400' : 'bg-orange-500'}`}>{pos}</span>
           {label}
        </h4>
        <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 font-medium">Points:</span>
            <input 
                type="number" 
                value={winners[pos].points}
                onChange={(e) => handleWinnerChange(pos, 'points', e.target.value)}
                className="w-16 px-2 py-1 text-xs border rounded text-right font-bold text-gray-700 bg-gray-50"
            />
        </div>
      </div>
      <div className="space-y-3">
        <input 
          placeholder="Student Name"
          value={winners[pos].studentName}
          onChange={(e) => handleWinnerChange(pos, 'studentName', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-indigo-500"
        />
        <div className="grid grid-cols-2 gap-2">
            <input 
              placeholder="Reg No."
              value={winners[pos].registerNumber}
              onChange={(e) => handleWinnerChange(pos, 'registerNumber', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-indigo-500 uppercase"
            />
            <select
                value={winners[pos].group}
                onChange={(e) => handleWinnerChange(pos, 'group', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-indigo-500 bg-white"
            >
                {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-full md:w-auto">
            <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-6 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'results' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
            >
            Results Entry
            </button>
            <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2 px-6 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'events' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
            >
            Event Setup
            </button>
        </div>
        
        {/* Grand Total Button */}
        <button
            onClick={handlePublishClick}
            className="w-full md:w-auto bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-6 py-2.5 rounded-lg shadow-md font-bold text-sm flex items-center justify-center gap-2"
        >
            <span>🎉</span>
            Publish Grand Total
        </button>
      </div>

      {activeTab === 'results' ? (
        <>
          {/* Add Result Card */}
          <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Enter Event Results
                </h2>
                <span className="text-indigo-200 text-xs uppercase tracking-wider font-semibold">Multiple Winners Support</span>
            </div>
            
            <form onSubmit={handleResultSubmit} className="p-6">
                {/* Event Selector */}
                <div className="mb-6 max-w-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Event</label>
                    <select 
                      required
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-900 text-base"
                    >
                      <option value="">-- Choose an Event --</option>
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.name} ({ev.type})</option>
                      ))}
                    </select>
                    {events.length === 0 && (
                       <p className="text-sm text-red-500 mt-2">No events found. Go to 'Event Setup' to add events first.</p>
                    )}
                </div>

                {/* Winners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {renderWinnerInput(1, 'border-yellow-200', '1st Place (Gold)')}
                    {renderWinnerInput(2, 'border-gray-200', '2nd Place (Silver)')}
                    {renderWinnerInput(3, 'border-orange-200', '3rd Place (Bronze)')}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md font-bold text-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? 'Saving...' : 'Publish Results'}
                    </button>
                </div>
            </form>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4 px-1">Manage Published Results</h3>
          <ResultsList results={results} onDelete={handleResultDelete} isAdmin={true} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Event Form */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-teal-500 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Event</h2>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                    <input 
                      required
                      value={eventForm.name}
                      onChange={(e) => setEventForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g. 400m Relay"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as EventType }))}
                      className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white"
                    >
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors shadow-sm font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Event'}
                  </button>
                </form>
              </div>
            </div>

            {/* Event List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-700">Existing Events ({events.length})</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {events.length > 0 ? events.map(ev => (
                    <div key={ev.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">{ev.name}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">{ev.type}</div>
                      </div>
                      <button 
                        onClick={() => handleEventDelete(ev.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-400 italic">
                      No events added yet. Use the form to add one.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;