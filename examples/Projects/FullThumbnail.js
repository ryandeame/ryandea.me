import React, { useState } from "react";
import { Thumbnail, Button, Span } from "./ProjectStyles";
import { IoIosPlay } from "react-icons/io";
import Image from "next/image";

import styled from "styled-components";

export const Img = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
  borderRadius: 25px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
  opacity: ${(props) => (props.isImageLoaded ? 1 : 0)};
  transition: opacity 300ms ease-in-out;
`;

const FullThumbnail = ({ project, openVideo, isImageLoaded, setIsImageLoaded }) => {
  return (
    <>
      <Thumbnail>
        <Img
          src={project.image}
          alt="Ryan Deame's project thumbnail."
          isImageLoaded={isImageLoaded}
          onLoadingComplete={() => {setIsImageLoaded(true)}}
        />
        {project.videoId && (
          <Button onClick={() => openVideo(project.videoId)}>
            <Span>
              <IoIosPlay className="icon-container" />
            </Span>
          </Button>
        )}
      </Thumbnail>
    </>
  );
};

export default FullThumbnail;
