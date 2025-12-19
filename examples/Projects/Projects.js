import { useEffect, useState } from "react";
import { projects } from "./Constants";
import FullCard from "./FullCard";

import {
  ProjectContainer,
  ProjectGrid,
  SectionTitleBackground,
  SectionTitle,
} from "./ProjectStyles";

export default function ProjectsComponent(){
  const [videoStates, setVideoStates] = useState({});

  useEffect(() => {
    // Sets object with keys of all projectIds with value of false
    // so no videos are open
    const projectsWithVideoId = projects.reduce((acc, project) => {
      acc[project.videoId] = false;
      return acc;
    }, {});

    setVideoStates(projectsWithVideoId);
  }, [projects]);

  const openVideo = (videoId) => {
    const tempVideoStates = { ...videoStates };
    tempVideoStates[videoId] = true;
    setVideoStates(tempVideoStates);
  };

  const closeVideo = (videoId) => {
    const tempVideoStates = { ...videoStates };
    tempVideoStates[videoId] = false;
    setVideoStates(tempVideoStates);
  };

  return (
    <ProjectContainer id="projects">
      <ProjectGrid>
        <SectionTitleBackground />
        <SectionTitle>Projects</SectionTitle>
        {projects.map((project, index) => {
          return (
            <FullCard 
            key={index} 
            project={project} 
            projectIndex={index} 
            projectsLen={projects.length} 
            videoStates={videoStates}
            openVideo={openVideo}
            closeVideo={closeVideo}
            />
          );
        })}
      </ProjectGrid>
    </ProjectContainer>
  );
};
