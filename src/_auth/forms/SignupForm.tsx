
import * as z from "zod"
 import { useToast } from "@/components/ui/use-toast"
 import { Link , useNavigate} from "react-router-dom"
 import { zodResolver } from "@hookform/resolvers/zod"

 import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {SignupValidation} from "@/lib/validation"
import { Loader } from "lucide-react"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AutnContext"
 
 
 const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } =  useUserContext();
  const navigate = useNavigate();

//quaries
  const {mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount();
  const {mutateAsync: signInAccount, isPending: isSigningInUser }= useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupValidation>){
     //create the user 
    const newUser = await createUserAccount(values);
  
    if(!newUser){
      return toast({ title: "Sign up failed. please try  @ again",})
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })
    
    if(!session){
      console.log("new session is " + session);
      toast({title: 'sign in failed. please tyr again.'})

      navigate("/sign-in");
      return;
    }

    const isLoggedIn  =  await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate("/questionare-form");
    } else {
      return toast({title: 'sign up failed. please try again'})
    }
  };

   return (

    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/AnkyrIcons/icon-ankyr.jpg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12" > Create new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Gramsnap enter account details </p>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type = "text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type = "username" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type = "Email" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type = "Password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
          {isCreatingUser? (
            <div className = "flex-center gap-2">
               <Loader /> Loading...
            </div>
          ): (
            "Sign-up"
          )}
        </Button>

      <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an account?
          <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1"> Log in </Link>
      </p>
      </form>
    </div>
  </Form>
   )
 }
 
 export default SignupForm
