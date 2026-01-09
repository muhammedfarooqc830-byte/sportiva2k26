import React from 'react';
import { Result, LeaderboardEntry } from '../types';
import Leaderboard from '../components/Leaderboard';
import ResultsList from '../components/ResultsList';

interface HomeProps {
  results: Result[];
}

const Home: React.FC<HomeProps> = ({ results }) => {
  // Calculate Leaderboard
  const calculateLeaderboard = (results: Result[]): LeaderboardEntry[] => {
    const map: Record<string, LeaderboardEntry> = {
      'Green': { group: 'Green', totalPoints: 0, firstPlaceCount: 0, secondPlaceCount: 0, thirdPlaceCount: 0 },
      'Red': { group: 'Red', totalPoints: 0, firstPlaceCount: 0, secondPlaceCount: 0, thirdPlaceCount: 0 },
      'Blue': { group: 'Blue', totalPoints: 0, firstPlaceCount: 0, secondPlaceCount: 0, thirdPlaceCount: 0 },
    };

    results.forEach(r => {
      if (map[r.group]) {
        map[r.group].totalPoints += r.points;
        if (r.position === 1) map[r.group].firstPlaceCount++;
        if (r.position === 2) map[r.group].secondPlaceCount++;
        if (r.position === 3) map[r.group].thirdPlaceCount++;
      }
    });

    return Object.values(map);
  };

  const leaderboardData = calculateLeaderboard(results);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Overall Standing
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Live updates from the field
        </p>
      </div>
      
      <Leaderboard data={leaderboardData} />
      
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="bg-indigo-600 w-1 h-6 rounded-full"></span>
          Detailed Results
        </h3>
        <ResultsList results={results} />
      </div>
    </div>
  );
};

export default Home;