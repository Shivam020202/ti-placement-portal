import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import { Toast } from "@/components/ui/toast";
import { resolveAvatar } from "@/utils/avatarHelper";

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  const loginWithGoogle = useCallback(
    async (token, photoURL = null) => {
      try {
        setAuth((prev) => ({ ...prev, loading: true, error: null }));

        const response = await axios.post(
          "/login",
          {},
          {
            headers: { Authorization: token },
          }
        );

        const { user, student, admin, recruiter } = response.data;
        const isAdminRole =
          user.role === "admin" || user.role === "super-admin";
        const role =
          user.role === "student" ? student : isAdminRole ? admin : recruiter;
        const resolvedPhoto = await resolveAvatar(
          user.email,
          photoURL,
          user.fullName
        );
        const userWithPhoto = { ...user, photoURL: resolvedPhoto };

        // Store auth data
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(userWithPhoto));

        setAuth({
          user: userWithPhoto,
          role,
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        });

        // Navigate based on role
        navigate(
          user.role === "student"
            ? "/student"
            : isAdminRole
            ? "/super-admin"
            : "/recruiter"
        );
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Login failed";
        Toast.error(errorMessage);
        setAuth((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    },
    [setAuth, navigate]
  );

  const logout = useCallback(async () => {
    try {
      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      // Reset auth state
      setAuth({
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      // Navigate to login
      navigate("/login");
      Toast.success("Logged out successfully");
    } catch (error) {
      Toast.error("Logout failed");
    }
  }, [setAuth, navigate]);

  return {
    auth,
    loginWithGoogle,
    logout,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
  };
};
