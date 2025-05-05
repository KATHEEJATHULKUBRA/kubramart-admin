import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
  };
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, action }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h1>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button className="bg-primary hover:bg-primary/90">
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button className="bg-primary hover:bg-primary/90" onClick={action.onClick}>
            {action.icon && <span className="mr-1">{action.icon}</span>}
            {action.label}
          </Button>
        )
      )}
    </div>
  );
};

export default PageTitle;
