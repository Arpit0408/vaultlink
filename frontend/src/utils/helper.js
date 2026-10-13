import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../apis/userApi.js";
import { login } from "../store/slice/authSlice.js";

export const checkAuth = async ({ context }) => {
  try {
    const { queryClient, store } = context;
    const res = await queryClient.ensureQueryData({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
    });

    const userData = res?.user || res;
    if (!userData || !userData._id) return redirect({ to: "/auth" });

    store.dispatch(login(userData));
    return true;
  } catch (error) {
    return redirect({ to: "/auth" });
  }
};
