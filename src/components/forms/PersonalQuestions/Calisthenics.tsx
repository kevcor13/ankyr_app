import { useUserContext } from "@/context/AutnContext";
import { fetchDocumentIdByField, updateUserDocument } from "@/lib/appwrite/api";
import { appwriteConfig } from "@/lib/appwrite/config";
import { useState } from "react";

interface CalisthenicsProps {
    onComplete: () => void;
};

const Calisthenics: React.FC<CalisthenicsProps> = ({onComplete}) => {
    const{ user } = useUserContext();
    const [questionIndex, setQuestionIndex] = useState(0);
    const [changeWorkout, setChangeWorkout] = useState<string>('');
    const [ChangeDays, setChangeDays] = useState<boolean>();
    const [days, setDays] = useState<number>(0);
    
    const handleSubmit = async () => {
        if (changeWorkout !== null) {
            try {
                //const documentID = await fetchDocumentIdByField(appwriteConfig.loseWeightId, 'user', user.id)
                //await updateUserDocument( documentID, appwriteConfig.loseWeightId, chosenWorkout, days)
                onComplete();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleNext = () => {
        if (questionIndex < questions.length - 1) {
            setQuestionIndex(questionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const questions = [
        {
            question: (
            <fieldset>
                <legend className="text-lg font-semibold mb-2">Choose your daily challange</legend>
                <div>
                    <label className="block">
                        <input 
                            type="radio" 
                            value="body-weight-exercise" 
                            checked={changeWorkout === 'body-weight-exercise'}
                            onChange={(e) => setChangeWorkout(e.target.value)}
                        />
                        Body Weight Exercises 
                    </label>
                </div>
                <div>
                    <label className="block">
                        <input 
                            type="radio" 
                            value="cardio-based-exercise" 
                            checked={changeWorkout === 'cardio-based-exercise'}
                            onChange={(e) => setChangeWorkout(e.target.value)}
                        />
                        Cardio Based excerise
                    </label>
                </div>
                <div>
                    <label className="block">
                        <input 
                            type="radio" 
                            value="boxing-workouts" 
                            checked={changeWorkout === 'boxing-workouts'}
                            onChange={(e) => setChangeWorkout(e.target.value)}
                        />
                        Boxing Workouts
                    </label>
                </div>
            </fieldset>
        )
    },
    {
        question: (
            <fieldset>
                <legend className="text-lg font-semibold mb-2">Would you like to change the number of days you work out?</legend>
                <div>
                    <label className="block">
                        <input
                            type="radio"
                            value="yes"
                            checked={ChangeDays === true}
                            onChange={(e) => setChangeDays(e.target.value === 'yes')}
                            className="mr-2"
                        />
                        Yes
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            value="no"
                            checked={ChangeDays === false}
                            onChange={(e) => setChangeDays(e.target.value === 'no')}
                            className="mr-2"
                        />
                        No
                    </label>
                </div>
            </fieldset>
        )
    }
];
    if (changeWorkout) {
        questions.push({
            question: (
                <fieldset>
                    <legend className="text-lg font-semibold mb-2">How many days a week do you want to work out?</legend>
                    <div>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="mr-2 p-2"
                            min="1"
                            max="7"
                        />
                    </div>
                </fieldset>
            )
        });
    }
   
    return (
        <div className="questionnaire-form">
            <h2 className="text-2xl font-bold mb-4 text-white">User Questionnaire</h2>
            <div className="question text-white">
                {questions[questionIndex].question}
            </div>
            <button
                onClick={handleNext}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                {questionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </button>
        </div>
    );
};
export default Calisthenics