import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  change?: {
    value: string | number;
    type: "increase" | "decrease";
  };
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconBgColor = "bg-primary/10",
  change,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mt-1">
              {value}
            </h3>
            
            {change && (
              <div className={cn(
                "flex items-center text-sm mt-2",
                change.type === "increase" ? "text-green-500" : "text-red-500"
              )}>
                {change.type === "increase" ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                <span>{change.value}</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            iconBgColor
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
