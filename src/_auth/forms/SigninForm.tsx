  
 import { z } from "zod"
 import { useToast } from "@/components/ui/use-toast"
 import { Link , useNavigate} from "react-router-dom"
 import { Button } from "@/components/ui/button"
import {
  Form, FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SigninValidation } from "@/lib/validation"
import { Loader } from "lucide-react"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AutnContext"
 
 
 const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } =  useUserContext();
  const navigate = useNavigate();

//quaries
  const {mutateAsync: signInAccount, isPending: isSigningIn }= useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })
 
  // 2. Define a submit handler.
 const handleSignup = async (values: z.infer<typeof SigninValidation>) => {
    //create the user 

    const session = await signInAccount({
      email:  values.email,
      password:values.password,
    })

    if(!session){
      toast({title: 'sign in failed. please tyr again.'})

      navigate("/sign-in");
      return;
    }

    const isLoggedIn  =  await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate('/')
    } else {
      return toast({title: 'sign up failed. please try again'})
    }
  }

   return (

    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12" > Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back please enter your details </p>
        
        <form onSubmit={form.handleSubmit(handleSignup)} className="flex-col gap-5 w-full mt-4">
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
          {isUserLoading? (
            <div className = "flex-center gap-2">
               <Loader /> Loading...
            </div>
          ): "Sign-in"}
        </Button>

      <p className="text-small-regular text-light-2 text-center mt-2">
          Don't have an account?
          <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1"> Sign up </Link>
      </p>
      </form>
    </div>
  </Form>
   )
 }
 
 export default SigninForm