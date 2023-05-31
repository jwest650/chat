import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUser = create(
     persist(
          (set) => ({
               user: "",
               data: [],
               users: [],
               roomID: "",
               darkmode: false,
               onlineUsers: [],
               modalState: "",
               chatType: "chats",
               active: "",
               selectedMsg: null,

               setMesg: (value) =>
                    set(() => {
                         return { selectedMsg: value };
                    }),

               setActive: (value) =>
                    set(() => {
                         return { active: value };
                    }),
               setChatType: (value) =>
                    set((state) => {
                         return {
                              chatType: value,
                         };
                    }),

               addOnlineUsers: (value) =>
                    set(() => {
                         return {
                              onlineUsers: value,
                         };
                    }),
               showModal: (value) =>
                    set((state) => {
                         return {
                              modalState: value,
                         };
                    }),

               setDarkMode: (value) =>
                    set((state) => {
                         return {
                              darkmode: value,
                         };
                    }),
               getUser: (user: unknown) =>
                    set((state: unknown) => {
                         return { user: user };
                    }),
               signOut: (user: unknown) =>
                    set((state: unknown) => {
                         return { user: "", data: [], roomID: "" };
                    }),
               setGroup: (value) =>
                    set((state) => {
                         return {
                              users: [...value],
                         };
                    }),
               getChat: (value) =>
                    set((state) => {
                         return {
                              users: value,
                         };
                    }),
               getRoomId: (value) =>
                    set(() => {
                         return {
                              roomID: value,
                              data: [],
                         };
                    }),
               getMessages: (value) =>
                    set((state) => {
                         return {
                              data: value,
                         };
                    }),
               addMessages: (value) =>
                    set((state) => {
                         return {
                              data: [...state.data, value],
                         };
                    }),
          }),

          {
               name: "data",
               partialize: (state) => ({ user: state.user }),

               storage: createJSONStorage(() => sessionStorage),
          }
     )
);

export default useUser;
