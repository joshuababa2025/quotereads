import { Twitter, Facebook, Instagram, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [termsAndConditions, setTermsAndConditions] = useState('');

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    // Load social media links
    const { data: links } = await supabase
      .from('social_media_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    // Load terms and conditions
    const { data: settings } = await supabase
      .from('footer_settings')
      .select('setting_value')
      .eq('setting_key', 'terms_and_conditions')
      .single();
    
    setSocialLinks(links || []);
    setTermsAndConditions(settings?.setting_value || '');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Twitter': return <Twitter className="h-4 w-4" />;
      case 'Facebook': return <Facebook className="h-4 w-4" />;
      case 'Instagram': return <Instagram className="h-4 w-4" />;
      case 'Linkedin': return <Linkedin className="h-4 w-4" />;
      case 'Mail': return <Mail className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3 lg:mb-4">
              <span className="text-lg lg:text-xl font-bold">ANEWPORTALS</span>
            </div>
            <p className="text-footer-foreground/80 text-sm leading-relaxed">
              Discover, collect, and share the world's most inspiring quotes.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/community-quotes" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Browse Quotes</a></li>
              <li><a href="/collections" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Collections</a></li>
              <li><a href="/topics" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Topics</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/blog" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Blog</a></li>
              <li><a href="/groups" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Forums</a></li>
              <li><a href="/newsletter" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Newsletter</a></li>
              <li><a href="/support-donation" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Donations</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Follow Us</h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <Button 
                  key={link.id}
                  variant="ghost" 
                  size="sm" 
                  className="p-2 text-footer-foreground/80 hover:text-footer-foreground hover:bg-white/10"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  {getIcon(link.icon_name)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-footer-foreground/20 mt-6 lg:mt-8 pt-6 lg:pt-8">
          {termsAndConditions && (
            <div className="text-center mb-4">
              <p className="text-xs text-footer-foreground/60 max-w-4xl mx-auto px-4">
                {termsAndConditions}
              </p>
            </div>
          )}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-footer-foreground/60">
              © 2025 ANEWPORTALS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};