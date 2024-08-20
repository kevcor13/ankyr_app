import React from 'react';
import { useGetChallenges } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AutnContext';

const WeeklyCalendar: React.FC = () => {
    const { user } = useUserContext();
    const { data: challenges } = useGetChallenges(user.id);

    // Get the current week and its days
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });

    const challengeMap = new Map<string, any>();
    if (challenges) {
        challenges.forEach(challenge => {
            challengeMap.set(challenge.day, challenge);
        });
    }

    return (
        <div className="weekly-calendar">
            <h2>Weekly Challenges</h2>
            <div className="calendar-grid">
                {daysOfWeek.map((day) => {
                    const dayString = day.toLocaleDateString('en-US', { weekday: 'long' });
                    const challenge = challengeMap.get(dayString);

                    return (
                        <div className="calendar-day" key={day.toISOString()}>
                            <h4>{day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</h4>
                            {challenge ? (
                                <div className={`challenge-status ${challenge.completed ? 'completed' : 'pending'}`}>
                                    <p>{challenge.title}</p>
                                    <p>{challenge.description}</p>
                                    <p>Status: {challenge.completed ? 'Completed' : 'Pending'}</p>
                                </div>
                            ) : (
                                <p>No Challenge</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyCalendar;
