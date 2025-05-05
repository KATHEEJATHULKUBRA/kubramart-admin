import React from "react";
import kubraLogo from "@/assets/images/kubra-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
    xl: "h-20"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={kubraLogo} 
        alt="Kubra Market Logo"
        className={`${sizes[size]} object-contain`}
      />
    </div>
  );
};

export default Logo;
