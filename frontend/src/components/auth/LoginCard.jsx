import React, { Suspense } from 'react';
import { assets } from "../../assets/assets";
import { useStyledTheme } from "../../theme/useStyledTheme";

// Lazy load the Tab component
const Tab = React.lazy(() => import('./Tab'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 rounded"></div>
  </div>
);

const LoginCard = () => {
  // Destructure theme properties
  const { layout, colors } = useStyledTheme();

  // Assets pre-definition for better readability
  const {
    ThaparLogoMobile: logoM,
    ThaparLogoPC: logoPC,
    gradient: tabImg,
    Mhostel: thaparImg
  } = assets;

  // Custom styles for login container
  const loginContainerStyle = `
    ${layout.Login.loginCard}
    ${colors.loginBackground}
  `;

  return (
    <div className={loginContainerStyle}>
      {/* Left section of the login card */}
      <div className={`${layout.Login.loginCardLeft}`}>
        {/* Mobile logo - only visible on small screens */}
        <div className="w-2/3 md:hidden lg:hidden">
          <img 
            className={layout.img} 
            src={logoM} 
            alt="Thapar Mobile Logo"
            loading="lazy" // Enable native lazy loading
          />
        </div>

        <div className="w-full">
          {/* Header section with logo */}
          <div className={layout.Login.loginheader}>
            <h1 className="text-2xl font-semibold">Thapar Institute</h1>
            <img 
              className="md:w-[52px] md:h-[52px] lg:w-[72px] lg:h-[72px]" 
              src={logoPC}
              alt="Thapar PC Logo"
              loading="lazy"
            />
          </div>

          {/* Tablet gradient image */}
          <img 
            className="hidden md:flex mt-14 rounded-xl lg:hidden w-full h-96" 
            src={tabImg}
            alt="Gradient Background"
            loading="lazy"
          />
        </div>

        {/* Login tab section with lazy loading */}
        <div className={layout.Login.loginTab}>
          <h1 className="text-xl font-semibold">
            🙌 Welcome to <br /> Placement Portal
          </h1>
          <Suspense fallback={<LoadingFallback />}>
            <Tab />
          </Suspense>
        </div>

        {/* Footer message */}
        <div className="absolute bottom-0">
          <p className="font-medium text-muted text-md">
            Stay Safe and Stay Healthy.
          </p>
        </div>
      </div>

      {/* Right section - only visible on large screens */}
      <div className="hidden lg:block lg:w-1/2 lg:h-full">
        <img 
          className={`${layout.img} rounded-xl`} 
          src={thaparImg}
          alt="Thapar Campus"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default LoginCard;
