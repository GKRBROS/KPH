import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone is required"),
    district: z.string().min(2, "District is required"),
    serviceRequired: z.string().min(2, "Service type is required"),
    email: z.string().email("Valid email required").or(z.literal("")),
    whatsappUpdates: z.boolean().default(true),
    agreeToTerms: z.boolean().refine(val => val === true, "Agreement is required"),
});

type FormValues = z.infer<typeof formSchema>;

const QuickContactForm = () => {
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            district: "",
            serviceRequired: "",
            email: "",
            whatsappUpdates: true,
            agreeToTerms: false,
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true);

            await supabase.from("enquiries").insert({
                name: values.name,
                phone: values.phone,
                email: values.email || null,
                district: values.district,
                interested_in: values.serviceRequired,
                status: "New",
            });

            const message = `*Expert Painting Enquiry*\nName: ${values.name}\nPhone: ${values.phone}\nDistrict: ${values.district}\nService: ${values.serviceRequired}`;
            window.open(
                `https://wa.me/919446194178?text=${encodeURIComponent(message)}`,
                "_blank"
            );

            toast.success("Thank you! Our experts will call you.");
            form.reset();
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] bg-white rounded-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col group/form transition-all duration-500">
            {/* Architectural Header */}
            <div className="bg-[#111111] text-white p-6 md:p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-4 bg-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Direct Consultation</span>
                    </div>
                    <h3 className="text-2xl font-black font-heading tracking-tight leading-[0.9] uppercase">
                        Start Your Masterpiece
                    </h3>
                </div>
                {/* Visual Detail: Heavy contrast slash */}
                <div className="absolute top-0 right-0 w-32 h-full bg-white/5 -mr-16 rotate-12" />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-4 bg-white">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="group/input relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-all scale-y-0 group-focus-within/input:scale-y-100 z-10" />
                                        <Input
                                            {...field}
                                            placeholder="YOUR NAME*"
                                            aria-label="Your Name"
                                            className="h-14 bg-white border border-black/20 rounded-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black transition-all font-heading font-bold text-[13px] tracking-wider uppercase placeholder:text-slate-400 placeholder:text-[10px] placeholder:font-normal placeholder:tracking-[0.2em] px-6"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="group/input relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-all scale-y-0 group-focus-within/input:scale-y-100 z-10" />
                                        <Input
                                            {...field}
                                            placeholder="CONTACT NUMBER*"
                                            aria-label="Contact Number"
                                            className="h-14 bg-white border border-black/20 rounded-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black transition-all font-heading font-bold text-[13px] tracking-wider uppercase placeholder:text-slate-400 placeholder:text-[10px] placeholder:font-normal placeholder:tracking-[0.2em] px-6"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1" />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="group/input relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-all scale-y-0 group-focus-within/input:scale-y-100 z-10" />
                                            <Input
                                                {...field}
                                                placeholder="DISTRICT*"
                                                aria-label="District"
                                                className="h-14 bg-white border border-black/20 rounded-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black transition-all font-heading font-bold text-[13px] tracking-wider uppercase placeholder:text-slate-400 placeholder:text-[10px] placeholder:font-normal placeholder:tracking-[0.2em] px-6"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serviceRequired"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="group/input relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-all scale-y-0 group-focus-within/input:scale-y-100 z-10" />
                                            <Input
                                                {...field}
                                                placeholder="SERVICE REQUIRED*"
                                                aria-label="Service Required"
                                                className="h-14 bg-white border border-black/20 rounded-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black transition-all font-heading font-bold text-[13px] tracking-wider uppercase placeholder:text-slate-400 placeholder:text-[10px] placeholder:font-normal placeholder:tracking-[0.2em] px-6"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="group/input relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-all scale-y-0 group-focus-within/input:scale-y-100 z-10" />
                                        <Input
                                            {...field}
                                            placeholder="EMAIL (OPTIONAL)"
                                            aria-label="Email Address"
                                            className="h-14 bg-white border border-black/20 rounded-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black transition-all font-heading font-bold text-[13px] tracking-wider uppercase placeholder:text-slate-400 placeholder:text-[10px] placeholder:font-normal placeholder:tracking-[0.2em] px-6"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1" />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-3 pt-1">
                        <div className="flex items-center space-x-4">
                            <Checkbox id="whatsapp" defaultChecked className="w-4 h-4 border-slate-300 data-[state=checked]:bg-primary rounded-none" />
                            <Label htmlFor="whatsapp" className="text-[10px] text-slate-500 font-bold uppercase tracking-widest cursor-pointer">WhatsApp Updates</Label>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Checkbox
                                id="terms"
                                className="w-4 h-4 border-slate-300 mt-0.5 data-[state=checked]:bg-primary rounded-none"
                                onCheckedChange={(checked) => form.setValue("agreeToTerms", checked === true)}
                            />
                            <Label htmlFor="terms" className="text-[10px] text-slate-500 leading-snug font-bold uppercase tracking-widest cursor-pointer">
                                I agree to the <span className="text-primary hover:underline">Terms</span>
                            </Label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-primary hover:bg-[#111111] text-white font-black rounded-none transition-all duration-500 shadow-xl uppercase tracking-[0.3em] text-[12px] mt-4 flex items-center justify-center gap-2 group border-none outline-none"
                    >
                        {loading && <Loader2 className="animate-spin w-5 h-5" />}
                        SEND MESSAGE
                        {!loading && <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default QuickContactForm;
