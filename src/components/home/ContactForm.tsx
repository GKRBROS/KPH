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
    Mail,
    MessageSquare,
} from "lucide-react";

/* -------------------- Schema -------------------- */
const formSchema = z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email().optional().or(z.literal("")),
    district: z.string().min(1),
    interestedIn: z.string().min(1),
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
                `https://wa.me/918301921926?text=${encodeURIComponent(message)}`,
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
        <section id="contact" className="section-padding bg-accent/10">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT INFO */}
                    <div className="space-y-10">
                        <div>
                            <span className="text-primary text-sm font-bold tracking-widest uppercase">
                                Contact Us
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">
                                Let’s Talk About <br /> Your Project
                            </h2>
                            <p className="text-slate-600 mt-5 max-w-md">
                                Share your requirements and our painting experts will reach out
                                with the best solution.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: MapPin,
                                    title: "Visit Us",
                                    value:
                                        "St. George Shopping Complex, Edathua, Kerala 689573",
                                },
                                {
                                    icon: Phone,
                                    title: "Call Us",
                                    value: "+91 830 192 1926",
                                },
                                {
                                    icon: Mail,
                                    title: "Email",
                                    value: "kphpaints@gmail.com",
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                                        <p className="text-slate-600 text-sm">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Your name" />
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
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="+91 XXXXX XXXXX" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>District</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Alappuzha">Alappuzha</SelectItem>
                                                        <SelectItem value="Pathanamthitta">Pathanamthitta</SelectItem>
                                                        <SelectItem value="Kottayam">Kottayam</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sqft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sq. Feet</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Ex: 1200" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="interestedIn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Interior Painting">Interior Painting</SelectItem>
                                                    <SelectItem value="Exterior Painting">Exterior Painting</SelectItem>
                                                    <SelectItem value="Waterproofing">Waterproofing</SelectItem>
                                                    <SelectItem value="Full Home Makeover">Full Home Makeover</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="projectDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Details</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Tell us about your project" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Upload */}
                                <div className="space-y-3">
                                    <div className="border-2 border-dashed rounded-xl p-4 text-center relative cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0"
                                        />
                                        <Upload className="mx-auto text-slate-400" />
                                        <p className="text-xs mt-2 text-slate-500">
                                            Upload reference images (max 5)
                                        </p>
                                    </div>

                                    {/* Image Preview */}
                                    {imageFiles.length > 0 && (
                                        <div className="grid grid-cols-4 gap-3">
                                            {imageFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group aspect-square rounded-lg overflow-hidden border"
                                                >
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
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
                                    className="w-full h-12 text-base font-bold"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                    ) : (
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                    )}
                                    Send Enquiry
                                </Button>

                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
