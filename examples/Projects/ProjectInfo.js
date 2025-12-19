import {
    TitleDateContainer,
    TitleSpan,
    DateSpan,
    ProjectCardTechnologiesGrid,
    ProjectCardTechnologiesTitle,
    ProjectCardTechnologiesName,
} from "./ProjectStyles";

export default function ProjectInfo ({project}) {
  return (
    <>
    <TitleDateContainer>
        <TitleSpan>{project.title}</TitleSpan>
        <DateSpan>
            Published: {project.date}
        </DateSpan>
    </TitleDateContainer>
    {project.tags.length &&
    <ProjectCardTechnologiesGrid>
        <ProjectCardTechnologiesTitle>
        Technologies Used
        </ProjectCardTechnologiesTitle>
        {project.tags.map((tag, index) => {
        return (
            <ProjectCardTechnologiesName key={index}>
            {tag}
            </ProjectCardTechnologiesName>
        );
        })}
    </ProjectCardTechnologiesGrid>
    }
    </>
  );
};