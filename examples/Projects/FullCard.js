import { useState } from "react";
import dynamic from "next/dynamic";
const ModalVideo = dynamic(() => import("react-modal-video"), { ssr: false });

import FullThumbnail from "./FullThumbnail";
import ProjectInfo from "./ProjectInfo";

import {
  ProjectCard,
} from "./ProjectStyles";

export default function FullCard ({
    project, 
    projectIndex,     
    projectsLen, 
    videoStates,
    openVideo, 
    closeVideo
}){

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
            <ProjectCard
              index={projectIndex}
              $lgfinal={
              (projectIndex === projectsLen - 1) || (projectIndex === projectsLen - 2)
              }
              $smfinal={projectIndex === projectsLen - 1}
            >

              <div style={{ padding: "5px"}}>
                <FullThumbnail 
                project={project} 
                openVideo={openVideo} 
                isImageLoaded={isImageLoaded}
                setIsImageLoaded={setIsImageLoaded}
                />
                {project.videoId && (
                  <ModalVideo
                    channel="youtube"
                    isOpen={videoStates[project.videoId]}
                    videoId={project.videoId}
                    onClose={() => closeVideo(project.videoId)}
                  />
                )}
              </div>
              <ProjectInfo project={project} />
            </ProjectCard>
  );
};