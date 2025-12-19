import InstaBot from "../Images/InstaBot-min.jpg";
import GoogleChartCoinbase from "../Images/GoogleChartCoinbase-min.jpg";
import PythonExcel from "../Images/PythonExcel-min.jpg";
import ChicagoExcel from "../Images/ChicagoExcel-min.jpg";

export const projects = [
  {
    title: "Puppeteer Instagram Bot (Video)",
    description: "TBD",
    image: InstaBot,
    tags: ["Puppeteer", "Web Automation", "File System Organization"],
    github: "",
    videoId: "Awwa9kB8APU",
    date: "Septemper 4, 2024",
  },
  {
    title: "Coinbase Bitcoin API to Google React Candle Chart",
    length: "50:36",
    description:
      "I create a NextJS app that accesses the Coinbase API, via my own Express server, to gather Bitcoin candle data needed to display a bar chart using the Google React Charts library.",
    image: GoogleChartCoinbase,
    tags: ["NextJS", "3rd Party API", "Visualization"],
    github: "https://github.com/ryandeame/googlechartscoinbaseapi",
    videoId: "_3zfzvfr3u0",
    date: "April 12, 2023",
  },
  {
    title: "Python to Excel Pipeline Demo (Video)",
    description:
      "This video demonstrates how data can be generated in Python and pipelined into Microsoft Access and Excel in real-time. Python can be substituted with any user input system that can connect to Microsoft Access reliably and the charts and pivot tables can be updated every other second as demonstrated in this video.",
    image: PythonExcel,
    tags: ["Python", "Microsoft Access", "Realtime Dashboards"],
    github: "https://github.com/ryandeame/PythonAccessExcelPipeline",
    videoId: "b-cWLcj04VY",
    date: "November 3, 2021",
  },
  {
    title: "Excel VBA Demo (Video)",
    description:
      "In this demo I import a CSV file with Chicago transportation data into Excel and reorganize the street by street information into city-wide, day by day and month by month data. I then take the reconstructed data and automatically insert it into a reporting template. This demo shows off my object oriented programming and Excel function writing skills. I also perform some data validation using a pivot table.",
    image: ChicagoExcel,
    tags: ["Excel VBA", "Data Processing", "Pivot Tables"],
    datasource:
      "https://data.cityofchicago.org/Transportation/Average-Daily-Traffic-Counts/pfsx-4n4m",
    github: "https://github.com/ryandeame/ExcelTransportation",
    videoId: "zwQb7rWtx-o",
    date: "October 27, 2021",
  },
];
