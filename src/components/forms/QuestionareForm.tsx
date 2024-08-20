
import React, { useState } from 'react';
import { useUpdateUserInfo } from '@/lib/react-query/queriesAndMutations'; 
import { useUserContext } from '@/context/AutnContext';
import { Input } from '../ui/input';
import '@/styles/QuestionnaireForm.css';
import LoseWeight from './PersonalQuestions/LoseWeight';

interface QuestionnaireFormProps {
    onComplete: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onComplete }) => {
    const { user } = useUserContext();
    const { mutateAsync: updateUserInfo } = useUpdateUserInfo();
    const [questionIndex, setQuestionIndex] = useState(0);
    const [gender, setGender] = useState<string | null>('');
    const [age, setAge] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [fitness, setFitness] = useState<string>('');
    const [workoutdays, setWorkoutDays] = useState<number>(0);
    const [sport, setSport] = useState<boolean>(false);
    const [goal, setGoal] = useState<string>('');
    
    const handleSubmit = async () => {
        if (gender !== null) {
            try {
                await updateUserInfo({ userId: user.id, updates: { gender, age, weight, fitness, workoutdays, goal } });
                alert('Information saved successfully!');
                onComplete(); 
            } catch (error) {
                console.error("Error saving information:", error);
            }
        } else {
            alert('Please fill in all fields');
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
                    <legend className="text-lg font-semibold mb-2">What is your gender?</legend>
                    <div>
                        <label className="block">
                            <input
                                type="radio"
                                value="Male"
                                checked={gender === 'Male'}
                                onChange={(e) => setGender(e.target.value)}
                                className="mr-2"
                            />
                            Male
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="Female"
                                checked={gender === 'Female'}
                                onChange={(e) => setGender(e.target.value)}
                                className="mr-2"
                            />
                            Female
                        </label>
                    </div>
                </fieldset>
            )
        },
        {
            question: (
                <div className="mb-4">
                    <label htmlFor="age" className="block text-lg font-semibold">What is your age?</label>
                    <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(parseFloat(e.target.value) || 0)}
                        placeholder="Enter your age"
                        min="0"
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>
            )
        },
        {
            question: (
                <div>
                    <label htmlFor="weight">What is your weight?</label>
                    <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                        placeholder="Enter your weight"
                        min="0"
                    />
                </div>
            )
        },
        {
            question: (
                <fieldset>
                    <legend className="text-lg font-semibold mb-2">What is your fitness level?</legend>
                    <div>
                        <label className="block">
                            <input
                                type="radio"
                                value="beginner"
                                checked={fitness === 'beginner'}
                                onChange={(e) => setFitness(e.target.value)}
                                className="mr-2"
                            />
                            Beginner
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="intermediate"
                                checked={fitness === 'intermediate'}
                                onChange={(e) => setFitness(e.target.value)}
                                className="mr-2"
                            />
                            Intermediate
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="expert"
                                checked={fitness === 'expert'}
                                onChange={(e) => setFitness(e.target.value)}
                                className="mr-2"
                            />
                            Expert
                        </label>
                    </div>
                </fieldset>
            )
        },
        {
            question: (
                <div>
                    <label htmlFor="workoutdays">How many days do you workout per week?</label>
                    <Input
                        id="workoutdays"
                        type="number"
                        value={workoutdays}
                        onChange={(e) => setWorkoutDays(parseFloat(e.target.value) || 0)}
                        placeholder="Enter Number"
                        min="0"
                        max="7"
                    />
                </div>
            )
        },
        {
            question: (
                <fieldset>
                    <legend className="text-lg font-semibold mb-2">Do you play a sport?</legend>
                    <div>
                        <label className="block">
                            <input
                                type="radio"
                                value="yes"
                                checked={sport === true}
                                onChange={(e) => setSport(e.target.value === 'yes')}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="no"
                                checked={sport === false}
                                onChange={(e) => setSport(e.target.value === 'no')}
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
                    <legend className="text-lg font-semibold mb-2">What is your goal?</legend>
                    <div>
                        <label className="block">
                            <input
                                type="radio"
                                value="lose weight"
                                checked={goal === 'lose weight'}
                                onChange={(e) => setGoal(e.target.value)}
                                className="mr-2"
                            />
                            Lose Weight
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="gain muscle"
                                checked={goal === 'gain muscle'}
                                onChange={(e) => setGoal(e.target.value)}
                                className="mr-2"
                            />
                            Gain Muscle
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="calisthenics"
                                checked={goal === 'calisthenics'}
                                onChange={(e) => setGoal(e.target.value)}
                                className="mr-2"
                            />
                            Calisthenics
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="sport endurance"
                                checked={goal === 'sport endurance'}
                                onChange={(e) => setGoal(e.target.value)}
                                className="mr-2"
                            />
                            Sport Endurance
                        </label>
                    </div>
                </fieldset>
            )
        }
    ];
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

export default QuestionnaireForm;

