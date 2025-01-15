import { useBranding } from "@/hooks/useBranding";

export const Footer = () => {
  const { data: branding } = useBranding();
  
  return (
    <footer className="bg-[#f0f0f0] py-12 mt-16 border-t border-solid border-t-[rgb(230,230,230)]">
      <div className="container">
        <div className="flex justify-center">
          <p className="text-[#868787]">
            © <a 
              href={branding?.footer_url || "https://www.productcompass.pm/"} 
              target="_blank" 
              rel="dofollow" 
              className="hover:underline"
            >
              {branding?.footer_text || "The Product Compass Newsletter"}
            </a> 2025
          </p>
        </div>
      </div>
    </footer>
  );
};