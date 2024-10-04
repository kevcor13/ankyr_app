import { useUserContext } from "@/context/AutnContext";
import { fetchUserGoal } from "@/lib/appwrite/api";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Transfer = () => {
    const {user} = useUserContext();
    const navigate = useNavigate();
    const[userGoal, setUserGoal] = useState(String);
    const fetchUserData = async () => {
        try {
            const goal = fetchUserGoal(user.id);
            console.log(goal);

            if(await goal === 'gain muscle'){
                navigate("/gainMuscle-form")
            } else if (await goal === 'lose weight'){
                navigate("")
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