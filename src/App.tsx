/*
import { Routes, Route, useNavigate } from 'react-router-dom';

import './globals.css';
import SigninForm from './_auth/forms/SigninForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"
import QuestionareForm from './_auth/forms/QuestionareForm';

const navigate = useNavigate();



const App = () => {
  return (
    <main className= "flex h-screen">
        <Routes>
            
            <Route element={<AuthLayout />}>
                <Route path = "/sign-in" element = {<SigninForm />} />
                <Route path = "/sign-up" element = {<SignupForm />} />
               <Route path="/questionare-form" element={<QuestionareForm onComplete={navigate('/')} />} />
            </Route>
            
            <Route element ={<RootLayout />}>
                <Route index element={<Home />}/>
                <Route path="/explore" element={<Explore />}/>
                <Route path="/saved" element={<Saved />}/>
                <Route path="/all-users" element={<AllUsers />}/>
                <Route path="/create-post" element={<CreatePost />}/>
                <Route path="/update-post/:id" element={<EditPost />}/>
                <Route path="/post/:id" element={<PostDetails />}/>
                <Route path="/profile/:id/*" element={<Profile />}/>
                <Route path="/update-profile/:id" element={<UpdateProfile />}/>
            </Route>
        </Routes>

        <Toaster />
    </main>
  )
}

export default App
*/
import { Routes, Route, useNavigate } from 'react-router-dom';
import './globals.css';
import SigninForm from './_auth/forms/SigninForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"
import QuestionLayout from './_questions/QuestionLayout';
import QuestionareForm from './_questions/forms/QuestionareForm';

const App = () => {
  const navigate = useNavigate();

  const handleQuestionnaireComplete = () => {
    navigate('/');
  };

  return (
    <main className="flex h-screen">
        <Routes>

            <Route element={<AuthLayout />}>
                <Route path="/sign-in" element={<SigninForm />} />
                <Route path="/sign-up" element={<SignupForm />} />
            </Route>
            <Route element={<QuestionLayout />}>
                <Route path="/questionare-form" element={<QuestionareForm onComplete={handleQuestionnaireComplete} />} />
            </Route>

            <Route element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/all-users" element={<AllUsers />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/update-post/:id" element={<EditPost />} />
                <Route path="/post/:id" element={<PostDetails />} />
                <Route path="/profile/:id/*" element={<Profile />} />
                <Route path="/update-profile/:id" element={<UpdateProfile />} />
            </Route>
        </Routes>

        <Toaster />
    </main>
  );
}

export default App;
