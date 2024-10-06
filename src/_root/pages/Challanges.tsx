
import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AutnContext';
import { fetchDocumentIdByField, fetchUserGoal, fetchUserSecondCompletion, UserDailyGoal,  } from '@/lib/appwrite/api';


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
            } catch (error) {
                console.error('Error retrieving user data:', error);
            }
        };
        
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
            await fetchDailyGoal();
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

