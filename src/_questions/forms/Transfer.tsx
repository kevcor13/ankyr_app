import { useUserContext } from "@/context/AutnContext";
import { fetchUserGoal } from "@/lib/appwrite/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Transfer = () => {
    const {user} = useUserContext();
    const navigate = useNavigate();
    const fetchUserData = async () => {
        try {
            const goal = fetchUserGoal(user.id);
            console.log(goal);

            if(await goal === 'lose weight'){
                navigate("/lose-weight")
            } else if (await goal === 'gain muscle'){
                navigate("/gainMuscle-form")
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const initializeData = async () => {
            await fetchUserData();
        };
    initializeData();
}, [user.id])


    return(
        <div>hello</div>
    )

}


export default Transfer;