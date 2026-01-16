import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
    const phoneNumber = "919446194178"; // Business WhatsApp Number
    const message = "Hello! I'm interested in your paint solutions.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
            aria-label="Enquire on WhatsApp"
        >
            <MessageCircle className="w-8 h-8 fill-current" />
        </a>
    );
};

export default WhatsAppFloat;
