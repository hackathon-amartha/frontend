import * as React from "react";
import { cn } from "@/lib/utils";

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (inputValue === "" || /^\d*$/.test(inputValue)) {
        onChange(inputValue);
      }
    };

    return (
      <div
        className={cn(
          "flex items-center rounded-[20px] bg-[#E5E5EA] h-[42px] overflow-hidden",
          className
        )}
      >
        <span className="pl-4 pr-2 text-black select-none">+62 |</span>
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          className="flex-1 h-full bg-transparent border-none outline-none pr-4"
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
