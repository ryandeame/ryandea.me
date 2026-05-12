export type ProductStat = {
  label: string;
  value: string;
};

export type ProductFeature = {
  title: string;
  description: string;
};

export type ProductDetail = {
  slug: "ontrack" | "reach" | "been-to-box";
  name: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  icon: string;
  previewImage?: string;
  accent: {
    from: string;
    to: string;
    text: string;
    glow: string;
  };
  audience: string;
  problem: string;
  primaryAction: string;
  stats: ProductStat[];
  stack: string[];
  workflows: ProductFeature[];
  differentiators: ProductFeature[];
  architecture: ProductFeature[];
  mockup: {
    title: string;
    subtitle: string;
    primaryMetric: string;
    secondaryMetric: string;
    rows: Array<{
      label: string;
      value: string;
    }>;
  };
};

export const productDetails: ProductDetail[] = [
  {
    slug: "ontrack",
    name: "OnTrack",
    eyebrow: "Fitness, nutrition, and food cost tracking",
    tagline: "A mobile dashboard for staying honest about calories, macros, workouts, and what food actually costs.",
    summary:
      "OnTrack brings daily nutrition, exercise volume, and cost-per-serving awareness into one compact Expo app. It is built for people who want practical health tracking without a heavy meal-planning workflow.",
    icon: "/products/ontrack-icon.png",
    accent: {
      from: "from-cyan-400",
      to: "to-purple-500",
      text: "text-cyan-300",
      glow: "shadow-cyan-500/20",
    },
    audience:
      "Fitness-minded users, travelers, expats, and anyone who wants to connect meal decisions with macros and real daily spend.",
    problem:
      "Most calorie trackers separate nutrition from the cost of eating. OnTrack treats food as both fuel and budget data, then keeps workout volume visible beside it.",
    primaryAction: "View Reach",
    stats: [
      { label: "Daily lenses", value: "Food + Fitness" },
      { label: "Currency helper", value: "ARS / PEN" },
      { label: "Trend window", value: "10 days" },
    ],
    stack: [
      "Expo Router",
      "React Native",
      "TypeScript",
      "Supabase",
      "Victory Charts",
      "Skia",
      "SecureStore",
    ],
    workflows: [
      {
        title: "Daily Summary",
        description:
          "Selected-date totals for calories, protein, carbs, food spend, progress rings, calendar browsing, and yesterday spend comparison.",
      },
      {
        title: "Food Logging",
        description:
          "Servings, grams, calories, carbs, protein, date/time, autocomplete, reuse from prior entries, and cost per serving.",
      },
      {
        title: "Exercise Tracking",
        description:
          "Exercise suggestions, sets, reps, date entry, recent workout history, and 10-day volume dashboards.",
      },
      {
        title: "Theme Studio",
        description:
          "Aurora, Cobalt, Amethyst, and Inferno palettes with light, dark, and system-aware variants.",
      },
    ],
    differentiators: [
      {
        title: "Nutrition plus spend",
        description:
          "The cost-per-serving calculator makes the app more specific than a normal calorie logger.",
      },
      {
        title: "International food math",
        description:
          "ARS and PEN conversion support turns grocery or receipt totals into usable USD serving costs.",
      },
      {
        title: "Dashboard-first behavior",
        description:
          "Progress rings, trend charts, and aggregated daily history keep the feedback loop short.",
      },
    ],
    architecture: [
      {
        title: "Auth and persistence",
        description:
          "Supabase auth with protected Expo Router flows and SecureStore-backed session persistence.",
      },
      {
        title: "Time-aware analytics",
        description:
          "Dashboard data uses local-day windows with Supabase querying and fallback logic.",
      },
      {
        title: "Native charts",
        description:
          "Victory and Skia support compact, mobile-friendly food and exercise trend views.",
      },
    ],
    mockup: {
      title: "Daily Summary",
      subtitle: "Today at a glance",
      primaryMetric: "$18.42",
      secondaryMetric: "1,940 cal",
      rows: [
        { label: "Protein", value: "146g" },
        { label: "Carbs", value: "212g" },
        { label: "Exercise", value: "428 reps" },
      ],
    },
  },
  {
    slug: "reach",
    name: "Reach",
    eyebrow: "Personal CRM and outbound momentum hub",
    tagline: "A lightweight workflow app for keeping outreach, applications, and social publishing moving every day.",
    summary:
      "Reach is an Expo and Supabase app for job seekers, freelancers, founders, and solo operators who need a simple system for daily pipeline momentum without heavyweight sales tooling.",
    icon: "/products/reach-icon.png",
    accent: {
      from: "from-teal-300",
      to: "to-blue-500",
      text: "text-teal-300",
      glow: "shadow-teal-500/20",
    },
    audience:
      "Job seekers, freelancers, founders, recruiters, and operators managing outreach, applications, and publishing habits.",
    problem:
      "Personal pipelines often fall apart because activity is scattered across notes, job boards, social platforms, and memory. Reach turns daily movement into visible signals.",
    primaryAction: "View OnTrack",
    stats: [
      { label: "Daily outreach goal", value: "10 contacts" },
      { label: "Application goal", value: "10 apps" },
      { label: "Social goal", value: "3 posts" },
    ],
    stack: [
      "Expo Router",
      "React Native",
      "TypeScript",
      "Supabase",
      "RPC SQL",
      "Chrome Extension",
      "Browser Scripts",
    ],
    workflows: [
      {
        title: "Outreach Log",
        description:
          "Choose a person, pick a communication vector, add notes, and track unique contacts toward a daily goal.",
      },
      {
        title: "Apply Log",
        description:
          "Track company, role, location, resume submitted state, job URL, notes, and daily application progress.",
      },
      {
        title: "Social Post Log",
        description:
          "Record LinkedIn, Instagram, Facebook, and Twitter/X posts, reels, and stories against daily publishing goals.",
      },
      {
        title: "Initiative Dashboard",
        description:
          "Daily signal cards, 10-day charts, people count, company count, and recent productivity windows.",
      },
    ],
    differentiators: [
      {
        title: "Momentum-first CRM",
        description:
          "Reach centers on daily movement and signal bars instead of becoming a passive contact database.",
      },
      {
        title: "Three workflows together",
        description:
          "Outreach, job applications, and social publishing live in one personal operating system.",
      },
      {
        title: "LinkedIn capture",
        description:
          "Browser scripts and a Chrome extension help capture company and person JSON for import workflows.",
      },
    ],
    architecture: [
      {
        title: "Supabase analytics",
        description:
          "RPC functions power local-day counts, recent activity windows, and elapsed-hour productivity spans.",
      },
      {
        title: "Import pipeline",
        description:
          "Captured LinkedIn-style JSON maps into person and company creation forms inside the app.",
      },
      {
        title: "Theme system",
        description:
          "Default, Noir, Momentum, and Glass themes give the product multiple visual modes.",
      },
    ],
    mockup: {
      title: "Initiative Dashboard",
      subtitle: "Daily pipeline signal",
      primaryMetric: "10 / 10",
      secondaryMetric: "6 apps",
      rows: [
        { label: "People", value: "184" },
        { label: "Companies", value: "52" },
        { label: "Social posts", value: "3" },
      ],
    },
  },
  {
    slug: "been-to-box",
    name: "Been-To-Box",
    eyebrow: "Personal travel stats and highlights",
    tagline: "An upcoming Expo app for turning the places you have been into a personal world archive.",
    summary:
      "Been-To-Box will collect the places a user has traveled, organize them into meaningful stats and highlights, and make personal travel history feel visual, memorable, and easy to revisit across mobile and web.",
    icon: "/products/been-to-box-icon.png",
    previewImage: "/been-to/been-to-box-banner.png",
    accent: {
      from: "from-emerald-400",
      to: "to-amber-400",
      text: "text-emerald-300",
      glow: "shadow-emerald-500/20",
    },
    audience:
      "Travelers, digital nomads, families, and memory-keepers who want more than a static map of pins.",
    problem:
      "Travel memories often live in scattered photos, notes, and maps. Been-To-Box will package those places into a personal, stats-driven travel archive.",
    primaryAction: "View product",
    stats: [
      { label: "Product stage", value: "Planned" },
      { label: "Platforms", value: "Native + Web" },
      { label: "Core lens", value: "Travel stats" },
    ],
    stack: [
      "Expo Router",
      "React Native",
      "TypeScript",
      "Web",
      "Maps",
      "Travel Data",
      "Highlights",
    ],
    workflows: [
      {
        title: "Place Collection",
        description:
          "Add countries, cities, landmarks, and personally meaningful stops into a structured travel archive.",
      },
      {
        title: "Travel Stats",
        description:
          "Surface totals, regions, continents, repeat visits, travel streaks, and other personal movement patterns.",
      },
      {
        title: "Highlight Boxes",
        description:
          "Group favorite places into curated collections that feel more intentional than a plain checklist.",
      },
      {
        title: "Mobile and Web Views",
        description:
          "Use Expo with React Native and web support so the same travel archive can work on phone and browser.",
      },
    ],
    differentiators: [
      {
        title: "Personal geography",
        description:
          "The product will focus on how travel feels to the user, not just where pins sit on a map.",
      },
      {
        title: "Stats plus memories",
        description:
          "Counts and charts become more useful when paired with highlights and personally meaningful groupings.",
      },
      {
        title: "Built for expansion",
        description:
          "The page is ready for screenshots, map visuals, achievements, and richer trip data when the app exists.",
      },
    ],
    architecture: [
      {
        title: "Expo foundation",
        description:
          "A future Expo Router app can share navigation and product logic across native and web surfaces.",
      },
      {
        title: "Structured places",
        description:
          "The baseline product model should keep locations, regions, highlights, and stats separate enough to evolve.",
      },
      {
        title: "Portfolio-ready placeholder",
        description:
          "This page marks the concept as upcoming while preserving the same product presentation system as the finished apps.",
      },
    ],
    mockup: {
      title: "World Box",
      subtitle: "Travel archive",
      primaryMetric: "42 places",
      secondaryMetric: "8 countries",
      rows: [
        { label: "Continents", value: "3" },
        { label: "Top region", value: "South America" },
        { label: "Highlights", value: "12 boxes" },
      ],
    },
  },
];

export const productDetailBySlug = Object.fromEntries(
  productDetails.map((product) => [product.slug, product]),
) as Record<ProductDetail["slug"], ProductDetail>;
