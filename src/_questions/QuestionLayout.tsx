
import React from "react";
import { Outlet } from "react-router-dom";

const QuestionLayout = () => {
    return(
        <div className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
        </div>
    )
}
export default QuestionLayout