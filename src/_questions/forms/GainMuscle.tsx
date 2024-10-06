import { useUserContext } from "@/context/AutnContext";
import { fetchDocumentIdByField, gainMuscleChallange, updateUserDocument } from "@/lib/appwrite/api";
import { appwriteConfig } from "@/lib/appwrite/config";
import { useState } from "react";

interface GainMuscleProps {
    onComplete: () => void;
}
const GainMuscle: React.FC<GainMuscleProps> = ({onComplete}) => {
    const { user } = useUserContext();
    const [questionIndex, setQuestionIndex] = useState(0);
    const [changeDays, setChangeDays ] = useState<boolean>();
    const [workoutDays, setDays] = useState<number>(0);
    const [chosenWorkout, setChosenWorkout] = useState<string>('');

    const handleSubmit = async () => {
        if(workoutDays !== null){
            try {
                const documentID = await fetchDocumentIdByField(appwriteConfig.loseWeightId, 'users', user.id)
                await updateUserDocument( documentID, appwriteConfig.loseWeightId,chosenWorkout, workoutDays)
                onComplete()
            } catch (error) {
                console.log(error)
            }
        }
    }
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
                    <legend className="text-lg font-semibold mb-2">Would you like to change the number of days you work out?</legend>
                    <div>
                        <label className="block">
                            <input
                                type="radio"
                                value="yes"
                                checked={changeDays === true}
                                onChange={(e) => setChangeDays(e.target.value === 'yes')}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="no"
                                checked={changeDays === false}
                                onChange={(e) => setChangeDays(e.target.value === 'no')}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </fieldset>
            )
        },

        {
            question: (
                <fieldset>
                    <legend className="text-lg font-semibold mb-2">Would you like to lift heavy weight or light weight?</legend>
                    <div>
                        <label className="block">
                            <input
                                type="radio"
                                value="heavy"
                                onChange={(e) => setChosenWorkout(e.target.value)}
                                className="mr-2"
                            />
                                Heavy
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="light"
                                onChange={(e) => setChosenWorkout(e.target.value)}
                                className="mr-2"
                            />
                            Light
                        </label>
                    </div>
                </fieldset>
            )
        }
    ]; 
    
    if (changeDays) {
        questions.push({
            question: (
                <fieldset>
                    <legend className="text-lg font-semibold mb-2">How many days a week do you want to work out?</legend>
                    <div>
                        <input
                            type="number"
                            value={workoutDays}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="mr-2 p-2"
                            min="1"
                            max="5"
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
    )
};

export default GainMuscle