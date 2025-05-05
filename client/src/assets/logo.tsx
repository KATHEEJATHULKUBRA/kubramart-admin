import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <div className={`rounded-full bg-primary flex items-center justify-center ${sizes[size]} ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-2/3 h-2/3 text-white"
      >
        <path d="M2 3h1.5c.8 0 1.5.7 1.5 1.5v15c0 .8-.7 1.5-1.5 1.5H2"/>
        <path d="M20.2 3h1.3c.5 0 .9.4.9.9V5"/>
        <path d="M20.2 17h1.3c.5 0 .9-.4.9-.9v-1.1"/>
        <path d="M6.3 3h13.4"/>
        <path d="M18 14c.5-1.9.7-5.5-1.5-8.5"/>
        <path d="M11.2 17.8c-1-.9-2.2-2.1-3-3.6"/>
        <path d="M13 9c.8.5 2 1.6 3 3.5"/>
        <path d="M6 21h12c.5 0 1-.2 1.4-.5"/>
        <path d="M6.4 21c-.9-.3-1.4-1-1.4-1.5v-3.2c0-.6.4-1.2.9-1.5l8.6-5c.8-.4 1.8-.4 2.6 0l1 .6"/>
        <path d="M10 9v0"/>
        <path d="M13 9v0"/>
        <path d="M13 17v0"/>
        <path d="M16 9v0"/>
        <path d="M11 13v0"/>
        <path d="M14 13v0"/>
        <path d="M14 17v0"/>
      </svg>
    </div>
  );
};

export default Logo;
