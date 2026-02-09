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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DistrictSelect } from "@/components/ui/district-select";
import { Loader2, Upload, X, ArrowRight } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone is required"),
    district: z.string().min(1, "District is required"),
    interestedIn: z.string().min(1, "Service type is required"),
    sqft: z.string().optional(),
    projectDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const QuickContactForm = () => {
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            district: "",
            interestedIn: "",
            sqft: "",
            projectDetails: "",
        },
    });

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
                district: values.district,
                interested_in: values.interestedIn,
                sqft: values.sqft || null,
                project_details: values.projectDetails || null,
                image_urls: imageUrls,
                status: "New",
            });

            const message = `*Expert Painting Enquiry*\nName: ${values.name}\nPhone: ${values.phone}\nDistrict: ${values.district}\nService: ${values.interestedIn}\nSq.Ft: ${values.sqft || "N/A"}`;
            window.open(
                `https://wa.me/919446194178?text=${encodeURIComponent(message)}`,
                "_blank"
            );

            toast.success("Thank you! Our experts will call you.");
            form.reset();
            setImageFiles([]);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="contact" className="w-full max-w-[500px] bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden flex flex-col group/form transition-all duration-500 border border-white/50 ring-1 ring-purple-100">
            {/* Architectural Header */}
            {/* Architectural Header - Royal Theme */}
            <div className="bg-[#0f0a1e] text-white p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.4em]">Direct Consultation</span>
                    </div>
                    <h3 className="text-2xl font-black font-heading tracking-tight leading-none uppercase text-white drop-shadow-lg">
                        Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Project</span>
                    </h3>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                <div className="absolute bottom-0 right-10 w-20 h-20 bg-indigo-600/20 blur-2xl rounded-full pointer-events-none" />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-5">
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Name *"
                                            className="h-12 bg-white border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-slate-900 font-normal text-sm px-4 placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Phone Number *"
                                            className="h-12 bg-white border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-slate-900 font-normal text-sm px-4 placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Row 2: District & SqFt */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <DistrictSelect
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            isHero={true}
                                            className="h-12 bg-white border-slate-300 rounded-none px-4 text-slate-900 text-sm font-normal"
                                            placeholder="Select District *"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sqft"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Square Feet (Optional)"
                                            className="h-12 bg-white border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-slate-900 font-normal text-sm px-4 placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Row 3: Service */}
                    <FormField
                        control={form.control}
                        name="interestedIn"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 bg-white border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 text-sm font-normal px-4 text-slate-900 data-[placeholder]:text-gray-400">
                                            <SelectValue placeholder="Service Required *" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-none border-slate-300 bg-white max-h-[300px]">
                                        {[
                                            "Interior Painting",
                                            "Exterior Painting",
                                            "Waterproofing",
                                            "Full Home Makeover",
                                            "Wood Polishing & Varnishing",
                                            "Metal Painting",
                                            "Texture Design & Stenciling",
                                            "Wallpaper Installation",
                                            "Damp Proofing Solutions",
                                            "New Paint Service",
                                            "Repainting Services",
                                            "Project-Based Painting Services",
                                            "Plinth Area Painting & Protection",
                                            "Floor Painting",
                                            "Epoxy Metal Painting",
                                            "Safe Paint Services"
                                        ].map(service => (
                                            <SelectItem key={service} value={service} className="rounded-none text-sm font-normal text-slate-700 cursor-pointer focus:bg-slate-900 focus:text-white">
                                                {service}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-[10px] text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Row 4: Project Details */}
                    <FormField
                        control={form.control}
                        name="projectDetails"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Tell us about your project requirements (Optional)..."
                                        className="min-h-[80px] bg-white border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-slate-900 font-normal text-sm px-4 py-3 resize-none placeholder:text-gray-400"
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Row 5: Image Upload (Compact) */}
                    <div className="relative group/upload">
                        <div className="border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors p-4 text-center cursor-pointer relative rounded-none">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 z-20 cursor-pointer"
                            />
                            <div className="flex items-center justify-center gap-2 text-slate-500">
                                <Upload className="w-4 h-4" />
                                <span className="text-[11px] font-medium">Upload Images (Max 5)</span>
                            </div>
                        </div>
                        {imageFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {imageFiles.map((file, index) => (
                                    <div key={index} className="relative w-10 h-10 border border-slate-300 rounded-none overflow-hidden">
                                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
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
                        className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Get Quote"}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default QuickContactForm;
