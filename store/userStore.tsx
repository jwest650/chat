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

               addOnlineUsers: (value) =>
                    set(() => {
                         return {
                              onlineUsers: value,
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
               getGroup: (value) =>
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
