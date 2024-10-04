
import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AutnContext';
import { creatingChallangeDocument, fetchDocumentIdByField, fetchUserCompletion, fetchUserGoal, fetchUserSecondCompletion, setUserGoalCompletion, UserDailyGoal,  } from '@/lib/appwrite/api';
import LoseWeight from '@/_questions/forms/LoseWeight';
import { appwriteConfig } from '@/lib/appwrite/config';
import Calisthenics from '@/components/forms/PersonalQuestions/Calisthenics';
import GainMuscle from '@/_questions/forms/GainMuscle';



const ChallengesPage = () => {
    const { user } = useUserContext()
    const [isLoseWeight, setIsLoseWeight] = useState<boolean>();
    const [isGainMuscle, setIsGainMuslce ] = useState<boolean>();
    const [dailyGoal, setDailyGoal] = useState<string[]>([]);
    const [collectionID, setCollectionID] = useState<string>(''); 


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
                else if(!completion){
                    if (goal === 'gain muscle') {
                        console.log("User's goal is to gain muscle");
                        setIsGainMuslce(true);
                        await setUserGoalCompletion(user.id)
                        console.log(completion)
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
        };

    initializeData();
}, [user.id])

    if (!user.id) {
        return <div>...Loading</div>;
    }

    return (
        <div className="challenges-page">
            <h2>Challenges</h2>
        </div>
    );
};

export default ChallengesPage;

