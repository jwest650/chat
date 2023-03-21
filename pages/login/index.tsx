import { RiLockPasswordLine } from "react-icons/ri";
import { BiUser } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import useUser from "../../store/userStore";
import Head from "next/head";
import ClipLoader from "react-spinners/ClipLoader";
const Login = () => {
     const [user, getUser] = useUser((state) => [state.user, state.getUser]);
     const [isloading, setisloading] = useState(false);
     const router = useRouter();
     const {
          register,
          handleSubmit,
          watch,
          formState: { errors },
     } = useForm();
     async function getLogin(data) {
          setisloading(true);
          try {
               const { data: result } = await axios.post(
                    "http://localhost:5000/login",
                    data
               );
               getUser(result.data);

               router.push("/");
               setisloading(false);
          } catch (error) {
               console.log(error);
          }
     }

     const onSubmit = async (data: unknown) => {
          getLogin(data);
     };

     return (
          <main className="login-bg w-screen h-screen relative bg-[#4834d4]  ">
               <Head>
                    <title>login</title>
               </Head>
               <div className="flex flex-col space-y-10 justify-center  items-center h-screen ">
                    <h1 className="text-white font-bold text-2xl z-50">
                         Sign in to your account
                    </h1>
                    <form
                         onSubmit={handleSubmit(onSubmit)}
                         className="space-y-4  w-64 z-50  "
                    >
                         <div className="space-x-4 text-sm text-white">
                              <button onClick={() => router.push("/login")}>
                                   Sign in
                              </button>
                              <button onClick={() => router.push("/signup")}>
                                   Sign up
                              </button>
                         </div>
                         <aside>
                              <div className="bg-white flex items-center space-x-1 rounded-md p-1 relative text-sm">
                                   <div className="bg-white rotate-45 w-[10px] absolute -top-1 left-5 h-[10px]" />
                                   <BiUser />
                                   <input
                                        type="text"
                                        placeholder="name"
                                        className="h-10 w-full outline-none"
                                        {...register("name", {
                                             required: true,
                                        })}
                                   />
                              </div>
                              {errors.username && (
                                   <p className="text-red-400">
                                        username required.
                                   </p>
                              )}
                         </aside>
                         <aside>
                              <div className="bg-white flex items-center space-x-1 rounded-md p-1 text-sm">
                                   <RiLockPasswordLine className="bg-white" />
                                   <input
                                        type="text"
                                        value={"11"}
                                        placeholder="Password"
                                        className="h-10 w-full outline-none  "
                                        {...register("password", {
                                             required: true,
                                        })}
                                   />
                              </div>
                              {errors.password && (
                                   <p className="text-red-400">
                                        password required.
                                   </p>
                              )}
                         </aside>

                         <aside className="w-full flex flex-col items-center space-y-3 ">
                              <button
                                   type="submit"
                                   className="bg-blue-600 h-10  h text-white w-full rounded-md "
                              >
                                   <span>Sign in</span>
                              </button>
                              <ClipLoader
                                   color={"white"}
                                   loading={isloading}
                                   size={20}
                                   aria-label="Loading Spinner"
                                   data-testid="loader"
                              />
                         </aside>
                    </form>
               </div>
          </main>
     );
};

export default Login;
