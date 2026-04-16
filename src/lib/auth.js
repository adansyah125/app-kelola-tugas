import { supabase } from "./supabase";

// LOGIN
export const login = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

// REGISTER
export const register = async (email, password) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

// LOGOUT
export const logout = async () => {
  return await supabase.auth.signOut();
};

// GET USER
export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};