import { Twitter, Facebook, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold">ANEWPORTALS</span>
            </div>
            <p className="text-footer-foreground/80 text-sm leading-relaxed">
              Discover, collect, and share the world's most inspiring quotes.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/community-quotes" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Browse Quotes</a></li>
              <li><a href="/collections" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Collections</a></li>
              <li><a href="/topics" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Topics</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/blog" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Blog</a></li>
              <li><a href="/groups" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Forums</a></li>
              <li><a href="/newsletter" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Newsletter</a></li>
              <li><a href="/donations" className="text-footer-foreground/80 hover:text-footer-foreground transition-colors">Donations</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="p-2 text-footer-foreground/80 hover:text-footer-foreground hover:bg-white/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-footer-foreground/80 hover:text-footer-foreground hover:bg-white/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-footer-foreground/80 hover:text-footer-foreground hover:bg-white/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-footer-foreground/80 hover:text-footer-foreground hover:bg-white/10">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-footer-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-footer-foreground/60">
            © 2025 ANEWPORTALS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};