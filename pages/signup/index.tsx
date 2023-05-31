import { RiLockPasswordLine } from "react-icons/ri";
import { BiUser } from "react-icons/bi";
import { MdMarkEmailRead } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Head from "next/head";
import { CgProfile } from "react-icons/cg";
import { ToastContainer, toast } from "react-toastify";
import { getImageUrl } from "../../components/utils/getImageUrl";
import { instance } from "../../components/utils/axiosInstance";
const Signup = () => {
     const [image, setimage] = useState({ src: "", files: "" });
     const router = useRouter();
     const {
          register,
          handleSubmit,
          watch,
          formState: { errors },
     } = useForm();
     const onSubmit = async (data) => {
          if (!image.files) {
               toast.error(`${"upload an image!"}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
               });
          } else {
               try {
                    const url = await getImageUrl(image);

                    let res = { ...data, image: url };
                    await instance.post("/user", res);
                    router.push("/login");
               } catch (error) {
                    console.log(error);
               }
          }
     };

     return (
          <div>
               <ToastContainer />{" "}
               <main className=" w-screen h-screen bg-[#4834d4] ">
                    <Head>
                         <title>signup</title>
                    </Head>
                    <div className="flex flex-col space-y-10 justify-center  items-center h-screen ">
                         <h1 className="text-white font-bold text-xl z-50">
                              Sign up to create your account
                         </h1>

                         <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="space-y-3  w-64 z-50"
                         >
                              <div className="border-4 border-dotted border-gray-700 rounded-full w-24 h-24 text-white mx-auto flex flex-col justify-center items-center relative overflow-hidden p-2">
                                   <label htmlFor="open">
                                        {image.src ? (
                                             <Image
                                                  src={image?.src}
                                                  fill
                                                  objectFit="cover"
                                             />
                                        ) : (
                                             <CgProfile className="text-5xl self-center" />
                                        )}
                                   </label>
                                   <input
                                        type="file"
                                        className="w-0 h-0"
                                        id="open"
                                        onChange={(e) =>
                                             setimage({
                                                  src: URL.createObjectURL(
                                                       e.target.files[0]
                                                  ),
                                                  files: e.target.files[0],
                                             })
                                        }
                                   />
                              </div>

                              <div className="space-x-4 text-sm text-white">
                                   <button
                                        onClick={() => router.push("signup")}
                                   >
                                        Sign up
                                   </button>
                                   <button onClick={() => router.push("login")}>
                                        Sign in
                                   </button>
                              </div>
                              <aside>
                                   <div className="bg-white flex items-center space-x-1 text-sm rounded-md p-1 relative">
                                        <div className="bg-white rotate-45 w-[10px] absolute -top-1 left-5 h-[10px]" />
                                        <BiUser />
                                        <input
                                             type="text"
                                             placeholder="Name "
                                             className="h-10 w-full outline-none"
                                             {...register("name", {
                                                  required: true,
                                             })}
                                        />
                                   </div>

                                   {errors.name && (
                                        <p className="text-red-500">
                                             username required.
                                        </p>
                                   )}
                              </aside>
                              <aside>
                                   <div className="bg-white flex items-center space-x-1 rounded-md p-1 text-sm">
                                        <MdMarkEmailRead />
                                        <input
                                             type="text"
                                             placeholder="Email "
                                             className="h-10 w-full outline-none"
                                             {...register("email", {
                                                  required: true,
                                             })}
                                        />
                                   </div>
                                   {errors.email && (
                                        <p className="text-red-500">
                                             email required.
                                        </p>
                                   )}
                              </aside>

                              <aside>
                                   <div className="bg-white flex items-center space-x-1 rounded-md p-1 ">
                                        <RiLockPasswordLine className="bg-white" />
                                        <input
                                             type="text"
                                             placeholder="Password"
                                             className="h-10 w-full outline-none  "
                                             {...register("password", {
                                                  required: true,
                                             })}
                                        />
                                   </div>
                                   {errors.password && (
                                        <p className="text-red-500">
                                             password required.
                                        </p>
                                   )}
                              </aside>

                              <div className="w-full  ">
                                   <button
                                        type="submit"
                                        className="bg-blue-600 h-10 capitalize h text-white w-full rounded-md"
                                   >
                                        sign up
                                   </button>
                              </div>
                         </form>
                    </div>
               </main>
          </div>
     );
};

export default Signup;
