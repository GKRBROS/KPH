import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const districts = [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
];

interface DistrictSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string; // To allow custom styling
    placeholder?: string;
    isHero?: boolean; // Little bit of a hack to style it differently for hero if needed, or just pass className
}

export function DistrictSelect({ value, onValueChange, className, placeholder = "Select District", isHero = false }: DistrictSelectProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal",
                        !value && "text-muted-foreground",
                        // Inherit styles from the parent or use default consistent with existing inputs
                        "h-14 bg-white border border-slate-900 rounded-none focus:ring-1 focus:ring-black text-slate-900 text-xs uppercase tracking-widest",
                        // Specific overrides for 'Hero' style to match QuickContactForm if needed.
                        // QuickContactForm uses: border-black/20 font-heading font-bold text-[13px] tracking-wider
                        isHero && "border-black/20 font-heading font-bold text-[13px] tracking-wider placeholder:text-[10px] placeholder:font-normal placeholder:tracking-[0.2em]",
                        className
                    )}
                >
                    <span className={cn(
                        "truncate flex-1 text-left",
                        !value && isHero && "text-slate-400 text-[10px] font-normal tracking-[0.2em]", // Hero placeholder style
                        !value && !isHero && "text-muted-foreground" // Default placeholder style
                    )}>
                        {value
                            ? districts.find((district) => district === value)
                            : placeholder}
                    </span>
                    {!value && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-none border-black">
                <Command>
                    <CommandInput placeholder="Search district..." className="h-10 text-xs font-medium uppercase tracking-widest" />
                    <CommandList>
                        <CommandEmpty>No district found.</CommandEmpty>
                        <CommandGroup>
                            {districts.map((district) => (
                                <CommandItem
                                    key={district}
                                    value={district}
                                    onSelect={(currentValue) => {
                                        // StartCase usually, but CommandItem value might be lowercase.
                                        // We want to save the Title Case version.
                                        // CommandItem lowercases value for search usually.
                                        // We can just use the 'district' variable directly.
                                        onValueChange(district);
                                        setOpen(false);
                                    }}
                                    className="text-xs uppercase tracking-widest cursor-pointer aria-selected:bg-slate-100 aria-selected:text-black"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === district ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {district}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
