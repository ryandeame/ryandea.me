import styled from "styled-components";

export const ProjectContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  // min-width: 375px;
`;

export const ProjectGrid = styled.section`
  margin-top: 0.5rem;
  max-width: 1292px;
  width: 1292px;
  //margin: 15px 0;
  background-color: #f4d1ae;
  border-radius: 25px;
  display: grid;
  grid-template-rows: auto-fill;
  grid-template-columns: 1fr 8fr 1fr 8fr 1fr;
  position: relative;
  overflow: hidden;
`;

export const SectionTitleBackground = styled.div`
  background-color: #9a7aa0;
  grid-row: 1;
  grid-column: 1 / -1;
  border-bottom: 3px solid ${(props) => props.theme.colors.background};
`;

export const SectionTitle = styled.h2`
  margin-top: -0.75rem;
  font-size: 2.25rem;
  transition: 0.8s all ease;
  color: #f4edea;
  text-shadow: 2px 2px 5px black;
  line-height: 4rem;
  font-family: "Open Sans";
  grid-row: 1;
  grid-column: 2;
  // position: absolute;

  @media ${(props) => props.theme.breakpoints.minSm} {
    font-size: 3rem;
    line-height: 5rem;
  }
`;

export const ProjectCard = styled.div`
  font-family: "Open Sans";
  grid-row: ${(props) => (Math.floor(props.index / 2) + 2).toString()};
  grid-column: ${(props) => (!(props.index % 2) ? "2" : "4")};
  ${(props) => ((props.index % 2) + 3).toString()};
  text-align: center;

  margin-top: 10px;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  margin-bottom: ${(props) => (props.$lgfinal ? "10px" : "0")};

  @media ${(props) => props.theme.breakpoints.sm} {
    grid-row: ${(props) => (props.index + 2).toString()};
    grid-column: 2 / 5;
    margin-bottom: ${(props) => (props.$smfinal ? "10px" : "0")};
  }
`;

export const ProjectCardImage = styled.img``;

export const TitleDateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const TitleSpan = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

export const ProjectCardName = styled.span`
  font-size: 22px;
  font-weight: bold;
  color: #00698f;
`;

export const DateSpan = styled.span`
  font-size: 16px;
  color: #666;
`;

// export const ProjectCardDate = styled.span`
//   font-size: 14px;
//   color: #999;
// `;

export const ProjectCardTechnologiesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  margin-bottom: 5px;
`;

export const ProjectCardTechnologiesTitle = styled.span`
  grid-column: 1 / 3;
  color: #333;
  font-weight: bold;
`;

export const ProjectCardTechnologiesName = styled.span`
  color: white;
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
`;

export const GridContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  padding: 3rem;
  place-items: start;
  column-gap: 2rem;
  row-gap: 3rem;
  @media ${(props) => props.theme.breakpoints.sm} {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    padding-bottom: 0;
    margin-bottom: 15px;
  }
`;
export const BlogCard = styled.div`
  border-radius: 10px;
  box-shadow: 3px 3px 20px rgba(57, 199, 205, 0.25);
  text-align: center;
  background: rgba(0, 0, 0, 0.25);
  width: 400px;
  @media ${(props) => props.theme.breakpoints.sm} {
    width: 100%;
  }
`;
export const TitleContent = styled.div`
  text-align: center;
  z-index: 20;
  width: 100%;
`;

export const HeaderThree = styled.h3`
  font-weight: 500;
  letter-spacing: 2px;
  color: #9cc9e3;
  padding: 0.5rem 0;
  font-size: ${(props) => (props.new ? "3rem" : "2rem")};
`;

export const HeaderTwo = styled.h3`
  font-weight: 500;
  letter-spacing: 2px;
  color: #9cc9e3;
  padding: 0.5rem 0;
  font-size: ${(props) => (props.new ? "2rem" : "1rem")};
`;

export const Hr = styled.hr`
  width: 50px;
  height: 3px;
  margin: 20px auto;
  border: 0;
  background: #d0bb57;
`;

export const Intro = styled.div`
  width: 170px;
  margin: 0 auto;
  color: #dce3e7;
  font-family: "Droid Serif", serif;
  font-size: 13px;
  font-style: italic;
  line-height: 18px;
`;

export const CardInfo = styled.p`
  width: 100%;
  padding: 0 50px;
  color: #e4e6e7;
  font-style: 2rem;
  line-height: 24px;
  text-align: justify;
  white-space: pre-wrap;
  @media ${(props) => props.theme.breakpoints.sm} {
    padding: 0.3rem;
  }
`;

export const UtilityList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-around;
  margin: 2.5rem 0;
`;

export const ExternalLinks = styled.a`
  color: #d4c0c0;
  font-size: 1.6rem;
  padding: 1rem 1.5rem;
  background: #6b3030;
  border-radius: 15px;
  transition: 0.5s;
  &:hover {
    background: #801414;
  }
`;

export const TagList = styled.ul`
  display: flex;
  justify-content: space-around;
  padding: 2rem;
`;
export const Tag = styled.li`
  color: #d8bfbf;
  font-size: 1.5rem;
`;

export const Thumbnail = styled.div`
  // display: inline-flex;
  /* display: flex;
  position: relative;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
  padding: 5px;
  position: relative;
`;

export const Button = styled.button`
  // z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;

  /* width: 100px;
  height: 100px; */
  width: 80px; // Reduce the button size
  height: 80px;
  // background: rgba(151, 26, 210, 0.75);
  background: #2ecc71;
  border: 3px solid #333;
  border-radius: 50%; // Make the button circular
  cursor: pointer;
  transition: background-color 0.3s; // Add a smooth transition effect

  user-select: none; /* Standard syntax */
  -webkit-user-select: none; /* Safari and Chrome */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer */
  -webkit-tap-highlight-color: transparent; /* Safari and Chrome */

  &:hover {
    background-color: #1b9463; // Change the background color on hover
  }

  /* ::before {
    position: absolute;
    left: 50%;
    top: 50%;
    display: block;
    background: red;
  } */
`;

export const Span = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  // width: inherit;
  // height: inherit;
  // border-radius: 50%;

  //display: flex;
  //justify-content: center;
  //align-items: center;
  // position: relative;
  //z-index: 2;
  & > svg.icon-container {
    //svg {
    font-size: 60px; // Adjust the icon size
    color: white;

    //}
  }

  @media ${(props) => props.theme.breakpoints.sm} {
  }
`;