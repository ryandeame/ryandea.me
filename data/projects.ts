import InstaBot from "./images/InstaBot-min.jpg";
import GoogleChartCoinbase from "./images/GoogleChartCoinbase-min.jpg";
import PythonExcel from "./images/PythonExcel-min.jpg";
import ChicagoExcel from "./images/ChicagoExcel-min.jpg";
import { StaticImageData } from "next/image";

export interface Project {
    title: string;
    description: string;
    image: StaticImageData;
    tags: string[];
    github?: string;
    videoId?: string;
    date: string;
    datasource?: string;
}

export const projects: Project[] = [
    {
        title: "Puppeteer Instagram Bot",
        description: "Automated browser-based Instagram bot built with Puppeteer for web automation, featuring intelligent file system organization and scheduled posting capabilities.",
        image: InstaBot,
        tags: ["Puppeteer", "Web Automation", "File System"],
        github: "",
        videoId: "Awwa9kB8APU",
        date: "September 4, 2024",
    },
    {
        title: "Coinbase Bitcoin API Chart",
        description: "NextJS application that connects to the Coinbase API via a custom Express server to gather Bitcoin candle data and display it using Google React Charts library.",
        image: GoogleChartCoinbase,
        tags: ["NextJS", "3rd Party API", "Visualization"],
        github: "https://github.com/ryandeame/googlechartscoinbaseapi",
        videoId: "_3zfzvfr3u0",
        date: "April 12, 2023",
    },
    {
        title: "Python to Excel Pipeline",
        description: "Real-time data pipeline that generates data in Python and streams it through Microsoft Access to Excel dashboards with live updating charts and pivot tables.",
        image: PythonExcel,
        tags: ["Python", "Microsoft Access", "Dashboards"],
        github: "https://github.com/ryandeame/PythonAccessExcelPipeline",
        videoId: "b-cWLcj04VY",
        date: "November 3, 2021",
    },
    {
        title: "Excel VBA Data Processing",
        description: "Automated Excel VBA solution importing Chicago transportation CSV data, reorganizing street-level data into city-wide aggregates with automatic report generation.",
        image: ChicagoExcel,
        tags: ["Excel VBA", "Data Processing", "Pivot Tables"],
        datasource: "https://data.cityofchicago.org/Transportation/Average-Daily-Traffic-Counts/pfsx-4n4m",
        github: "https://github.com/ryandeame/ExcelTransportation",
        videoId: "zwQb7rWtx-o",
        date: "October 27, 2021",
    },
];
