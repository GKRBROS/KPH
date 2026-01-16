import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Loader2,
    Upload,
    X,
    MapPin,
    Phone,
    ArrowRight,
} from "lucide-react";

/* -------------------- Schema -------------------- */
const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email().optional().or(z.literal("")),
    district: z.string().min(1, "Please select a district"),
    interestedIn: z.string().min(1, "Please select a service"),
    sqft: z.string().optional(),
    projectDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

/* -------------------- Component -------------------- */
const ContactForm = () => {
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            district: "",
            interestedIn: "",
            sqft: "",
            projectDetails: "",
        },
    });

    /* -------------------- Image handlers -------------------- */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        if (imageFiles.length + files.length > 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }
        setImageFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    /* -------------------- Submit -------------------- */
    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true);
            const imageUrls: string[] = [];

            for (const file of imageFiles) {
                const ext = file.name.split(".").pop();
                const path = `enquiry_attachments/${crypto.randomUUID()}.${ext}`;

                const { error } = await supabase.storage
                    .from("enquiry-attachments")
                    .upload(path, file);

                if (!error) {
                    const { data } = supabase.storage
                        .from("enquiry-attachments")
                        .getPublicUrl(path);
                    imageUrls.push(data.publicUrl);
                }
            }

            await supabase.from("enquiries").insert({
                name: values.name,
                phone: values.phone,
                email: values.email || null,
                district: values.district,
                interested_in: values.interestedIn,
                sqft: values.sqft || null,
                project_details: values.projectDetails || null,
                image_urls: imageUrls,
                status: "New",
            });

            const message = `*New Painting Enquiry*
Name: ${values.name}
Phone: ${values.phone}
Service: ${values.interestedIn}
District: ${values.district}
Sq.Ft: ${values.sqft || "N/A"}
Details: ${values.projectDetails || "N/A"}`;

            window.open(
                `https://wa.me/919446194178?text=${encodeURIComponent(message)}`,
                "_blank"
            );

            toast.success("Enquiry sent successfully!");
            form.reset();
            setImageFiles([]);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 bg-slate-100 relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

                    {/* Left: Project Info */}
                    <div className="lg:w-5/12 pt-4">
                        <div className="pb-8 border-b border-black/10 mb-8">
                            <span className="block text-xs font-bold tracking-[0.2em] text-slate-500 mb-4 uppercase">
                                Contact Us
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[0.95] mb-6">
                                VISIT OUR <br />
                                <span className="text-slate-400">SHOWROOM</span> <br />
                                TODAY
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed max-w-sm">
                                Located in St. George Shopping Complex, Edathua. We are open for all your painting needs.
                            </p>
                        </div>

                        <div className="grid gap-8">
                            {[
                                { label: "Call Us", value: "0477-2212444 | 9446194178", icon: Phone },
                                { label: "Alternate Mobile", value: "8156965090", icon: Phone },
                                { label: "Location", value: "St. George Shopping Complex, Edathua", icon: MapPin },
                            ].map((item, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex items-center gap-3 mb-1 text-slate-400">
                                        <item.icon className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 group-hover:text-black transition-colors whitespace-pre-line">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: The Form */}
                    <div className="lg:w-7/12">
                        <div className="bg-white p-8 md:p-12 shadow-[0px_20px_50px_-20px_rgba(0,0,0,0.1)] border border-slate-200 relative">
                            {/* Decorative Accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[80px] -z-0" />

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter your name" className="h-14 bg-white border border-slate-900 rounded-none focus:ring-1 focus:ring-black transition-all placeholder:text-slate-400" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="+91 ..." className="h-14 bg-white border border-slate-900 rounded-none focus:ring-1 focus:ring-black transition-all placeholder:text-slate-400" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="district"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">District</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-14 bg-white border border-slate-900 rounded-none focus:ring-1 focus:ring-black text-slate-900 data-[placeholder]:text-slate-400 hover:bg-slate-50 transition-colors">
                                                                <SelectValue placeholder="Select District" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-none border border-black bg-white shadow-xl max-h-[300px] z-50">
                                                            {["Alappuzha", "Pathanamthitta", "Kottayam", "Other"].map(dist => (
                                                                <SelectItem
                                                                    key={dist}
                                                                    value={dist}
                                                                    className="rounded-none cursor-pointer focus:bg-black focus:text-white data-[state=checked]:bg-slate-100 py-3 text-xs uppercase tracking-widest font-medium transition-colors"
                                                                >
                                                                    {dist}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="sqft"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Square Feet</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Approx Area" className="h-14 bg-white border border-slate-900 rounded-none focus:ring-1 focus:ring-black transition-all placeholder:text-slate-400" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="interestedIn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Service Required</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-14 bg-white border border-slate-900 rounded-none focus:ring-1 focus:ring-black text-slate-900 data-[placeholder]:text-slate-400 hover:bg-slate-50 transition-colors">
                                                            <SelectValue placeholder="Select Service" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-none border border-black bg-white shadow-xl max-h-[300px] z-50">
                                                        {["Interior Painting", "Exterior Painting", "Waterproofing", "Full Home Makeover"].map(service => (
                                                            <SelectItem
                                                                key={service}
                                                                value={service}
                                                                className="rounded-none cursor-pointer focus:bg-black focus:text-white data-[state=checked]:bg-slate-100 py-3 text-xs uppercase tracking-widest font-medium transition-colors"
                                                            >
                                                                {service}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="projectDetails"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Project Details</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} placeholder="Tell us more about your project needs..." className="min-h-[120px] bg-white border border-slate-900 rounded-none focus:ring-1 focus:ring-black transition-all p-4 resize-none placeholder:text-slate-400" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4">
                                        <div className="border border-slate-900 border-dashed hover:border-black bg-white hover:bg-slate-50 transition-all p-8 text-center relative cursor-pointer group rounded-none">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 z-20 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-slate-900 block">Click to Upload Images</span>
                                                    <span className="text-xs text-slate-500">Max 5 images (JPG, PNG)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {imageFiles.length > 0 && (
                                            <div className="flex flex-wrap gap-4">
                                                {imageFiles.map((file, index) => (
                                                    <div key={index} className="relative w-20 h-20 bg-slate-100 border border-slate-200 rounded-none">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt="preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 bg-black text-white hover:bg-zinc-800 rounded-none text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin w-5 h-5" />
                                        ) : (
                                            <>
                                                Submit Free Enquiry
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
