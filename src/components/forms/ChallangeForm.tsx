import React, { useEffect, useState } from 'react';
import { getChallenges } from '@/lib/appwrite/api';
import { useCreateChallenge, useDeleteChallenge, useUpdateChallenge } from '@/lib/react-query/queriesAndMutations';

const ChallengesPage = () => {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [challengeOfTheDay, setChallengeOfTheDay] = useState<any | null>(null);

    const { mutateAsync: createChallenge } = useCreateChallenge();
    const { mutateAsync: updateChallenge } = useUpdateChallenge();
    const { mutateAsync: deleteChallenge } = useDeleteChallenge();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const userId = 'your-user-id'; // Replace with the actual user ID
                const challenges = await getChallenges(userId);
                setChallenges(challenges);
                setChallengeOfTheDay(getTodaysChallenge(challenges));
            } catch (error) {
                console.error('Failed to fetch challenges', error);
            }
        };

        fetchChallenges();
    }, []);

    const getTodaysChallenge = (challenges: any[]) => {
        const today = new Date().toLocaleString('en-US', { weekday: 'long' });
        return challenges.find(challenge => challenge.day === today && !challenge.completed);
    };

    const handleComplete = async () => {
        if (challengeOfTheDay) {
            try {
                await updateChallenge(challengeOfTheDay.$id, { completed: true });
                setChallengeOfTheDay(null);
            } catch (error) {
                console.error('Failed to complete challenge', error);
            }
        }
    };

    return (
        <div>
            <h2>Challenge of the Day</h2>
            {challengeOfTheDay ? (
                <div>
                    <h3>{challengeOfTheDay.title}</h3>
                    <p>{challengeOfTheDay.description}</p>
                    <button onClick={handleComplete}>Complete Challenge</button>
                </div>
            ) : (
                <p>No challenge for today or already completed.</p>
            )}
        </div>
    );
};

export default ChallengesPage;
