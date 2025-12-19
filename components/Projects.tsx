"use client";

import { motion } from "framer-motion";
import { Play, Github, ExternalLink } from "lucide-react";
import ProductBackground from "./ProductBackground";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { projects, Project } from "@/data/projects";

import VideoModal from "./VideoModal";

export default function Projects() {
    const containerRef = useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Track which videos are open by their videoId
    const [videoStates, setVideoStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Initialize all videos as closed
        const initialStates = projects.reduce((acc, project) => {
            if (project.videoId) {
                acc[project.videoId] = false;
            }
            return acc;
        }, {} as Record<string, boolean>);
        setVideoStates(initialStates);
    }, []);

    const openVideo = (videoId: string) => {
        setVideoStates(prev => ({ ...prev, [videoId]: true }));
    };

    const closeVideo = (videoId: string) => {
        setVideoStates(prev => ({ ...prev, [videoId]: false }));
    };

    return (
        <section ref={containerRef} id="projects" className="py-32 px-4 relative overflow-hidden w-full h-full" style={{ position: 'relative' }}>
            {isMounted && <ProductBackground />}

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Projects</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                        Real-world solutions demonstrating expertise in automation,
                        <br className="hidden md:block" />
                        data processing, and full-stack development.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            project={project}
                            index={index}
                            videoStates={videoStates}
                            openVideo={openVideo}
                            closeVideo={closeVideo}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface ProjectCardProps {
    project: Project;
    index: number;
    videoStates: Record<string, boolean>;
    openVideo: (videoId: string) => void;
    closeVideo: (videoId: string) => void;
}

function ProjectCard({ project, index, videoStates, openVideo, closeVideo }: ProjectCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const gradients = [
        "from-purple-500 to-indigo-500",
        "from-blue-500 to-cyan-500",
        "from-emerald-500 to-teal-500",
        "from-amber-500 to-orange-500",
    ];

    const gradient = gradients[index % gradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-purple-500/50 hover:to-blue-500/50 transition-all duration-500"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

            <div className="relative h-full bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[22px] overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`} />

                {/* Thumbnail with Play Button */}
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={project.image}
                        alt={`${project.title} thumbnail`}
                        fill
                        className={`object-cover transition-all duration-500 group-hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsImageLoaded(true)}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Loading placeholder */}
                    {!isImageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                    )}

                    {/* Play button overlay */}
                    {project.videoId && (
                        <button
                            onClick={() => openVideo(project.videoId!)}
                            className="absolute inset-0 flex items-center justify-center"
                            aria-label={`Play ${project.title} video`}
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-125 opacity-50 hover:opacity-90 border-2 border-white/30">
                                <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </div>
                        </button>
                    )}
                </div>

                {/* Video Modal */}
                {project.videoId && (
                    <VideoModal
                        isOpen={videoStates[project.videoId] || false}
                        videoId={project.videoId}
                        onClose={() => closeVideo(project.videoId!)}
                    />
                )}

                {/* Content */}
                <div className="relative z-10 p-6">
                    {/* Title and Date */}
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                            {project.title}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {project.date}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed text-sm mb-6">
                        {project.description}
                    </p>

                    {/* Technologies */}
                    {project.tags.length > 0 && (
                        <div className="mb-6">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                Technologies
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, tagIndex) => (
                                    <span
                                        key={tagIndex}
                                        className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm font-medium text-white/40 hover:text-white transition-colors"
                            >
                                <Github className="w-4 h-4 mr-2" />
                                View Code
                            </a>
                        )}
                        {project.videoId && (
                            <button
                                onClick={() => openVideo(project.videoId!)}
                                className="flex items-center text-sm font-medium text-white/40 hover:text-white transition-colors"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Watch Demo
                            </button>
                        )}
                        {project.datasource && (
                            <a
                                href={project.datasource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm font-medium text-white/40 hover:text-white transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Data Source
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
