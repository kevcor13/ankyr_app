
import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AutnContext';
import { creatingChallangeDocument, fetchDocumentIdByField, fetchUserCompletion, fetchUserGoal, fetchUserSecondCompletion, setUserGoalCompletion, UserDailyGoal,  } from '@/lib/appwrite/api';
import LoseWeight from '@/components/forms/PersonalQuestions/LoseWeight';
import { appwriteConfig } from '@/lib/appwrite/config';
import Calisthenics from '@/components/forms/PersonalQuestions/Calisthenics';
import GainMuscle from '@/components/forms/PersonalQuestions/GainMuscle';


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
    const [isCalisthenics, setIsCalisthenics ] = useState<boolean>();
    const [dailyGoal, setDailyGoal] = useState<string[]>([]);
    const [challenges, setChallenges] = useState<string[]>([]);
    // depending on daily goal set the collectionID in a string 
    const [collectionID, setCollectionID] = useState<string>(''); 
    const [dailyChallenge, setDailyChallenge] = useState<string>('');


    /** gets user data to check if the second questionare has been completed */
        const fetchUserData = async () => {
            if (!user.id) return;
            try {
                const goal = await fetchUserGoal(user.id);
                const completion = await fetchUserSecondCompletion(user.id)


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
                if(!completion || completion === null){
                    if (goal === 'calisthenics') {
                        console.log("User's goal is to calisthenics");
                        setIsCalisthenics(true);
                        await setUserGoalCompletion(user.id)
                    } else {
                        return 
                    }
                }

            } catch (error) {
                console.error('Error retrieving user data:', error);
            }
        };

        // in a seperate function, set the collectioID depending on the 
        // daily goal the user choose 

        const fecthCollectionID = async () => {
            if(!user.id) return
            try {
                const goal = await fetchUserGoal(user.id)
                if(goal === 'lose weight'){
                    setCollectionID(appwriteConfig.loseWeightId)
                } else if(goal === 'gain muscle'){
                    setCollectionID(appwriteConfig.gainMuscleId)
                    console.log(collectionID)
                } else if(goal === 'calisthenics'){
                    setCollectionID(appwriteConfig.calisthenics)
                }
                console.log(collectionID);
            } catch (error) {
                console.log(error);
            }
        }

/** this function will be called to extract the daily userGoal  */
        const fetchDailyGoal = async () => {
            if (!user.id) return;
            try {
                const documentID = await fetchDocumentIdByField(collectionID, 'users', user.id);
                const goal = await UserDailyGoal(documentID, collectionID);
                setDailyGoal(goal);
            } catch (error) {
                console.log(error)
            }
        };

    useEffect(() => {
        const initializeData = async () => {
            await fetchUserData();
            await fecthCollectionID();
            await fetchDailyGoal();
        };

    initializeData();
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
                    <>
                        <LoseWeight onComplete={() => setIsLoseWeight(false)} />
                    </>
                    ) : (
                        <>
                          {isGainMuscle ? (
                            <GainMuscle onComplete={() => setIsGainMuslce(false)} /> 
                          ) : (
                            <>
                                {isCalisthenics ? (
                                    <Calisthenics onComplete={() => setIsCalisthenics(false)}/>
                                ) : (
                                    <>
                                        {dailyGoal !== null && <p>Goal Day: {dailyGoal}</p>}
                                    </>
                                )}
                            </>
                          )}  
                    </>
                )}
        </div>
    );
};

export default ChallengesPage;

