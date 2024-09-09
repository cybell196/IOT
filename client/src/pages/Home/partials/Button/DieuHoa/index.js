import { TbAirConditioning } from "react-icons/tb";
import {Switch, VisuallyHidden, useSwitch} from "@nextui-org/react";

const ThemeSwitch = (props) => {
    const {
      Component, 
      slots, 
      isSelected, 
      getBaseProps, 
      getInputProps, 
      getWrapperProps
    } = useSwitch(props);
  
    return (
        <div className="flex items-center justify-start row-span-1">
        <Component {...getBaseProps()}>
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <div
                {...getWrapperProps()}
                className={slots.wrapper({
                class: [
                    "w-24 h-24 p-4",
                    "flex items-center justify-center",
                    "rounded-2xl bg-white hover:bg-slate-200",
                ],
                })}
            >
                {isSelected ? <TbAirConditioning className="text-yellow-300 w-full h-full spin"/> : <TbAirConditioning className="w-full h-full"/>}
            </div>
        </Component>
        <p className="text-white select-none font-bold mx-4 pr-2">Điều hòa: {isSelected ? "bật" : "tắt"}</p>
        </div>
    )
  }
  
  
  export default function DieuHoa() {
    return <ThemeSwitch/>
  }
