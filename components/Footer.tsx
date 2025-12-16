"use client";

import { Github, Linkedin, Instagram, Youtube, Mail, Phone } from "lucide-react";

interface SocialLink {
    name: string;
    url: string | undefined;
    icon: React.ReactNode;
}

export default function Footer() {
    const email = process.env.NEXT_PUBLIC_FOOTER_EMAIL;
    const phone = process.env.NEXT_PUBLIC_FOOTER_PHONE;

    const socialLinks: SocialLink[] = [
        {
            name: "GitHub",
            url: process.env.NEXT_PUBLIC_GITHUB_URL,
            icon: <Github className="w-5 h-5" />,
        },
        {
            name: "LinkedIn",
            url: process.env.NEXT_PUBLIC_LINKEDIN_URL,
            icon: <Linkedin className="w-5 h-5" />,
        },
        {
            name: "Instagram",
            url: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
            icon: <Instagram className="w-5 h-5" />,
        },
        {
            name: "YouTube",
            url: process.env.NEXT_PUBLIC_YOUTUBE_URL,
            icon: <Youtube className="w-5 h-5" />,
        },
    ];

    // Filter out any undefined URLs
    const activeSocialLinks = socialLinks.filter((link) => link.url);

    return (
        <footer className="py-12 px-6 border-t border-white/10 bg-black/60 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                {/* Social Links */}
                <div className="flex flex-col items-center md:items-start gap-4 mb-8">
                    <ul className="flex flex-col items-center md:items-start gap-3">
                        {activeSocialLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors duration-300 group"
                                >
                                    <span className="group-hover:scale-110 transition-transform duration-300">
                                        {link.icon}
                                    </span>
                                    <span className="text-sm font-medium">{link.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col items-center md:items-start gap-3 mb-8">
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors duration-300 group"
                        >
                            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">{email}</span>
                        </a>
                    )}
                    {phone && (
                        <a
                            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                            className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors duration-300 group"
                        >
                            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">{phone}</span>
                        </a>
                    )}
                </div>

                {/* Copyright */}
                <div className="text-left">
                    <p className="text-gray-600 text-sm">
                        © Ryan Deame 2025
                    </p>
                </div>
            </div>
        </footer>
    );
}
