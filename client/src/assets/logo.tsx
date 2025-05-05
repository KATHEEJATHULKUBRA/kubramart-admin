import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-10",
    md: "h-16",
    lg: "h-24",
    xl: "h-32"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/src/assets/images/kubra-logo.png" 
        alt="Kubra Market Logo"
        className={cn(sizes[size], "object-contain")}
      />
    </div>
  );
};

export default Logo;
