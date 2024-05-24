import * as React from "react";

import { cn } from "../../lib/utils";
import { atom, useAtom } from "jotai";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { template } from "lodash";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
export const templateState = atom("INVENTORY");
// INVENTORY
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
const [templateMode, setTemplateMode] = useAtom(templateState)
const handleSwitchChange = () => {
  if(templateMode == "NORMAL"){
    setTemplateMode("INVENTORY")
  }else{
    setTemplateMode("NORMAL");
  }
};
    return (
      <> 
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
   
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };
