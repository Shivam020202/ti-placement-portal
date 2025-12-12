import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebaseConfig";
import { FaGoogle } from "react-icons/fa";

const StudentLoginForm = () => {
  const { loginWithGoogle, loading: authLoading, error: authError } = useAuth();
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [localError, setLocalError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLocalError(null);
      const result = await signInWithGoogle();
      if (result) {
        const token = await result.user.getIdToken();
        await loginWithGoogle(token);
      }
    } catch (err) {
      setLocalError(err.message);
      console.error("Google Sign In Error:", err);
    }
  };

  const isLoading = loading || authLoading;
  const displayError = localError || authError || error?.message;

  return (
    <div className="flex flex-col gap-10 mt-10 text-center">
      <h1 className="text-xl font-medium">
        Empowering Your Journey <br /> from{" "}
        <span className="text-red font-semibold">Campus</span> to{" "}
        <span className="text-red font-semibold">Career</span>.
      </h1>

      <button
        className="btn btn-primary text-md font-semibold text-white max-w-xs flex items-center justify-center gap-3 px-5 py-2 rounded-lg disabled:opacity-80"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex gap-2 items-center">
            {/* Animated Text */}
            <h1 className="text-lg text-red font-medium">Connecting</h1>

            {/* Animated Dots */}
            <div className="flex gap-2 mt-1">
              <span className="w-1 h-1 bg-red rounded-full animate-bounce [animation-delay:-0.4s]"></span>
              <span className="w-1 h-1 bg-red rounded-full animate-bounce [animation-delay:-0.2s]"></span>
              <span className="w-1 h-1 bg-red rounded-full animate-bounce"></span>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <FaGoogle size={24} />
            <h1 className="text-lg font-medium">Continue with Google</h1>
          </div>
        )}

      </button>

      {displayError && <p className="text-red text-sm">{displayError}</p>}
    </div>
  );
};

export default StudentLoginForm;
