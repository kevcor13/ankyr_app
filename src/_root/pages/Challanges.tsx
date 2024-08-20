/*
import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AutnContext';
import QuestionnaireForm from '@/components/forms/QuestionareForm';
import { fetchUserCompletion, fetchUserGoal } from '@/lib/appwrite/api';
import LoseWeight from '@/components/forms/PersonalQuestions/LoseWeight';

const ChallengesPage = () => {
    const { user } = useUserContext();

    const [isQuestionnaireVisible, setIsQuestionnaireVisible] = useState<boolean>();
    const [ isLoseWeight, setIsLoseWeight] = useState<boolean>();
    const [userGoal, setUserGoal] = useState<string>('');
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user.id) return;
            try {
                const goal = await fetchUserGoal(user.id);
                setUserGoal(goal);

                const completed = await fetchUserCompletion(user.id);

                if (goal === 'lose weight' && !completed) {
                    setIsLoseWeight(true);
                }

                if (!completed) {
                    setIsQuestionnaireVisible(true);
                }
            } catch (error) {
                console.error('Error retrieving user data:', error);
            }
        };

        fetchUserData();
    }, [user.id]);

    if(!user.id){
        return <div> ...Loading </div>
    }

    return (
        <div className="challenges-page">
            <h2>Challenges</h2>
            {isQuestionnaireVisible ? (
                <QuestionnaireForm onComplete={() => { setIsQuestionnaireVisible(false); } } />
            ) : (
                <>
                {isLoseWeight ? (
                    <LoseWeight onComplete={() => (setIsLoseWeight(false))}/>
                ) : (
                        <div className="challenge-box bg-blue-500 text-white p-4 rounded shadow-md">
                            <h3 className="text-xl font-bold">Todays Challange</h3>
                            <p className="text-lg mt-2">{userGoal}</p>
                        </div>
                    )}
                <>
                </>
                </>
            )}
        </div>
    )
};

export default ChallengesPage;
*/
import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AutnContext';
import QuestionnaireForm from '@/components/forms/QuestionareForm';
import { fetchUserCompletion, fetchUserGoal } from '@/lib/appwrite/api';
import LoseWeight from '@/components/forms/PersonalQuestions/LoseWeight';

// Utility function to read the text file
const fetchChallenges = async () => {
    const response = await fetch('/dailyChallenges.txt'); // Update the path if necessary
    const text = await response.text();
    return text.split('\n').filter(line => line.trim() !== '');
};

const ChallengesPage = () => {
    const { user } = useUserContext();
    const [isQuestionnaireVisible, setIsQuestionnaireVisible] = useState<boolean>(false);
    const [isLoseWeight, setIsLoseWeight] = useState<boolean>(false);
    const [userGoal, setUserGoal] = useState<string>('');
    const [challenges, setChallenges] = useState<string[]>([]);
    const [dailyChallenge, setDailyChallenge] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user.id) return;
            try {
                const goal = await fetchUserGoal(user.id);
                setUserGoal(goal);

                const completed = await fetchUserCompletion(user.id);

                if (goal === 'lose weight' && !completed) {
                    setIsLoseWeight(true);
                }

                if (!completed) {
                    setIsQuestionnaireVisible(true);
                }
            } catch (error) {
                console.error('Error retrieving user data:', error);
            }
        };

        const fetchChallengesData = async () => {
            try {
                const lines = await fetchChallenges();
                setChallenges(lines);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            }
        };

        fetchUserData();
        fetchChallengesData();
    }, [user.id]);

    useEffect(() => {
        if (challenges.length > 0) {
            const today = new Date();
            const index = today.getDate() % challenges.length; // Cycle through challenges
            setDailyChallenge(challenges[index]);
        }
    }, [challenges]);

    if (!user.id) {
        return <div>...Loading</div>;
    }

    return (
        <div className="challenges-page">
            <h2>Challenges</h2>
            {isQuestionnaireVisible ? (
                <QuestionnaireForm onComplete={() => { setIsQuestionnaireVisible(false); }} />
            ) : (
                <>
                    {isLoseWeight ? (
                        <LoseWeight onComplete={() => setIsLoseWeight(false)} />
                    ) : (
                        <><div className="challenge-box bg-blue-500 text-white p-4 rounded shadow-md">
                                    <h3 className="text-xl font-bold">Your daily challenge is:</h3>
                                    <p className="text-lg mt-2">{userGoal}</p>
                                </div><div>
                                        <h3 className="text-xl font-bold">An optional Challange</h3>
                                        <p className='text-lg mt-2'>{dailyChallenge}</p>
                                    </div></>
                    )}
                </>
            )}
        </div>
    );
};

export default ChallengesPage;
