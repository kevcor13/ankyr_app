
import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AutnContext';
import { creatingChallangeDocument, fetchDocumentIdByField, fetchUserCompletion, fetchUserGoal, fetchUserSecondCompletion, setUserGoalCompletion,  } from '@/lib/appwrite/api';
import LoseWeight from '@/components/forms/PersonalQuestions/LoseWeight';
import GainMuscle from '@/components/forms/PersonalQuestions/GainMuscle';
import { isCompositeComponent } from 'react-dom/test-utils';
import { useParams } from 'react-router-dom';
import { appwriteConfig } from '@/lib/appwrite/config';



// Utility function to read the text file
const fetchChallenges = async () => {
    const response = await fetch('/dailyChallenges.txt'); // Update the path if necessary
    const text = await response.text();
    return text.split('\n').filter(line => line.trim() !== '');
};

const ChallengesPage = () => {
    const { user } = useUserContext()
    const [isLoseWeight, setIsLoseWeight] = useState<boolean>();
    const [isGainMuscle, setIsGainMuslce ] = useState<boolean>(false);
    const [challenges, setChallenges] = useState<string[]>([]);
    const [dailyChallenge, setDailyChallenge] = useState<string>('');

        const fetchUserData = async () => {
            if (!user.id) return;
            try {
                const goal = await fetchUserGoal(user.id);
                const completion = await fetchUserSecondCompletion(user.id)
                await creatingChallangeDocument(user.id, goal)

                console.log(goal)
                console.log(completion)

                if(!completion || completion === null){
                    if (goal === 'lose weight') {
                        console.log("User's goal is to lose weight");
                        setIsLoseWeight(true);
                        await setUserGoalCompletion(user.id)
                    } else {
                        return 
                    }
                }
                if(!completion || completion === null){
                    if (goal === 'gain muscle') {
                        console.log("User's goal is to gain muscle");
                        setIsGainMuslce(true);
                        await setUserGoalCompletion(user.id)
                    } else {
                        return 
                    }
                }

            } catch (error) {
                console.error('Error retrieving user data:', error);
            }
        };

    useEffect(() => {
        fetchUserData();
    }, [user.id]);

        const fetchChallengesData = async () => {
            try {
                const lines = await fetchChallenges();
                setChallenges(lines);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            }
        };


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
                {isLoseWeight ? (
                        <LoseWeight onComplete={() => setIsLoseWeight(false)} />
                    ) : (
                        <>
                          {isGainMuscle ? (
                            <GainMuscle onComplete={() => setIsGainMuslce(false)} /> 
                          ) : (
                            <>

                            </>
                          )}  
                    </>
                )}
        </div>
    );
};

export default ChallengesPage;

