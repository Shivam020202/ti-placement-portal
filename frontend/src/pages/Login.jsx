import { assets } from "../assets/assets";
import layout from "../theme/layout";
import LoginCard from "../components/auth/LoginCard";
import PublicRoute from '../components/common/PublicRoute';

const bgImage = assets.gradient;

const Login = () => {
    return (
        <PublicRoute>
            <div
                className={`${layout.Login.loginpage}`}
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                <div className="w-full h-full md:w-[90%] md:h-[90%]">
                    <LoginCard />   
                </div>
            </div>
        </PublicRoute>
    );
};

export default Login;