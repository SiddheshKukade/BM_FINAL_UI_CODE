import * as React from "react";

import { cn } from "../../lib/utils";
import { styled } from "../../stitches/index";
import { Center, Flex, FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { templateState } from "../ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const StyledInput = styled("input", {});
const autoComplete = {
  autoComplete: "off",
  autoCorrect: "off",
  "data-form-type": "other",
  spellCheck: false,
};
// const [templateMode, setTemplateMode] = useAtom(templateState)

const TransInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, submitPressed, ...props }, ref) => {
    console.log("props", props)
    // Function to handle Enter key press
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // Call your function here, passing the inputValue if needed
        submitPressed();
        event.target.blur();
      }
    };
    const [templateMode, setTemplateMode] = useAtom(templateState)
    const handleSwitchChange = () => {
      if (templateMode == "NORMAL") {
        setTemplateMode("INVENTORY")
        localStorage.setItem("templateMode", "INVENTORY")
      } else {
        setTemplateMode("NORMAL");
        localStorage.setItem("templateMode", "NORMAL")

      }
    };
    console.log(templateMode)
    return (
      <>
        <Flex gap={3} direction={"row"} 
        justifyContent={"space-between"}
        // w={"100vw"}
        >
          {/* <Flex w={"80%"}> */}
          <StyledInput
            style={{ marginBottom: "0px" }}
            onKeyPress={handleKeyPress}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className,
              "bg-transparent",
            )}
            ref={ref}
            {...props}
            {...autoComplete}
          />
          {/* </Flex> */}

       
        </Flex>
           {/* <FormControl
           className={cn(
             "flex h-10")}
           alignContent={"center"} display='flex' alignItems='center'> */}
           {/* <FormLabel htmlFor='email-alerts' mb='0'>
             Normal Mode
           </FormLabel> */}
           {/* <Switch onChange={handleSwitchChange} isChecked={templateMode == "NORMAL"} id='email-alerts' /> */}
         {/* </FormControl> */}
         </>
    );
  },
);
TransInput.displayName = "TransInput";

export { TransInput };
