import { useUserContext } from "@/context/AutnContext";
import { fetchDocumentIdByField, updateUserDocument } from "@/lib/appwrite/api";
import { appwriteConfig } from "@/lib/appwrite/config";
import { useState } from "react";

interface LoseWeightProps {
    onComplete: () => void;
}

const LoseWeight: React.FC<LoseWeightProps> = ({ onComplete }) => {
    const { user } = useUserContext();
    const [questionIndex, setQuestionIndex] = useState(0);
    const [chosenWorkout, setChosenWorkout] = useState<string>('');
    const [changeWorkout, setChangeWorkout] = useState<boolean>(false);
    const [days, setDays] = useState<number>(0);
    
    const handleSubmit = async () => {
        if (chosenWorkout !== null) {
            try {
                const documentID = await fetchDocumentIdByField(appwriteConfig.loseWeightId, 'user', user.id)
                await updateUserDocument(appwriteConfig.loseWeightId, documentID , {
                    chosenWorkout: '', 
                    days,
                    weightSize: chosenWorkout
                })
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
                    <legend className="text-lg font-semibold mb-2">Choose your daily Workout</legend>
                    <div>
                        <label className="block">
                            <input
                                type="radio"
                                value="jogging/running"
                                checked={chosenWorkout === 'jogging/running'}
                                onChange={(e) => setChosenWorkout(e.target.value)}
                                className="mr-2"
                            />
                            Jogging/Running
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="cycling"
                                checked={chosenWorkout === 'cycling'}
                                onChange={(e) => setChosenWorkout(e.target.value)}
                                className="mr-2"
                            />
                            Cycling
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="stair master"
                                checked={chosenWorkout === 'stair master'}
                                onChange={(e) => setChosenWorkout(e.target.value)}
                                className="mr-2"
                            />
                            Stair Climbing
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="shadow boxing"
                                checked={chosenWorkout === 'shadow boxing'}
                                onChange={(e) => setChosenWorkout(e.target.value)}
                                className="mr-2"
                            />
                            Shadow Boxing 
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="eliptical training"
                                checked={chosenWorkout === 'eliptical training'}
                                onChange={(e) => setChosenWorkout(e.target.value)}
                                className="mr-2"
                            />
                            Eliptical Training
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
                                checked={changeWorkout === true}
                                onChange={(e) => setChangeWorkout(e.target.value === 'yes')}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="no"
                                checked={changeWorkout === false}
                                onChange={(e) => setChangeWorkout(e.target.value === 'no')}
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

export default LoseWeight;

