// Field definitions for every editable collection. Shared by the admin forms
// (client) and the server actions that validate what admins submit.

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "image"
  | "url"
  | "date"
  | "select"
  | "boolean"
  | "youtube";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  max?: number;
}

export type CollectionKey =
  | "hero"
  | "leaders"
  | "slides"
  | "glance"
  | "stats"
  | "timeline"
  | "days"
  | "news"
  | "videos"
  | "departments"
  | "helplines"
  | "pages";

export interface CollectionDef {
  key: CollectionKey;
  label: string;
  singular: string;
  description: string;
  group: "Home page" | "Content" | "Directory";
  prefix: string;
  sort: "order" | "date";
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
}

export const DEPARTMENT_CATEGORIES = [
  "Judiciary & Constitutional Bodies",
  "Government Departments",
  "Authorities & Boards",
  "Universities & Colleges",
  "Citizen Services",
];

export const HELPLINE_CATEGORIES = ["Police", "Hospitals", "Exchange", "Medical Colleges", "Social Services"];

export const ACCENTS = ["teal", "violet", "gold", "red", "green"];

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "news",
    label: "News & Updates",
    singular: "News story",
    description: "Press releases and government news. Shown on the home page and the News page.",
    group: "Content",
    prefix: "news",
    sort: "date",
    titleField: "title",
    subtitleField: "date",
    imageField: "image",
    fields: [
      { name: "title", label: "Headline", type: "text", required: true, max: 300 },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "image", label: "Photo", type: "image" },
      { name: "body", label: "Story", type: "markdown", required: true, help: "Leave a blank line between paragraphs. Start a line with ## for a sub-heading or - for a bullet." },
      { name: "slug", label: "Web address (slug)", type: "text", help: "Leave empty to create it from the headline." },
      { name: "published", label: "Published", type: "boolean", help: "Untick to keep this story as a draft." },
      { name: "featured", label: "Feature on home page", type: "boolean" },
    ],
  },
  {
    key: "videos",
    label: "Videos",
    singular: "Video",
    description: "Paste any YouTube link. The thumbnail and player are created automatically.",
    group: "Content",
    prefix: "video",
    sort: "order",
    titleField: "title",
    subtitleField: "url",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 160 },
      { name: "url", label: "YouTube link", type: "youtube", required: true, help: "Any YouTube link works: youtu.be, watch?v=, shorts or embed." },
      { name: "description", label: "Short description", type: "textarea", max: 400 },
    ],
  },
  {
    key: "pages",
    label: "Pages",
    singular: "Page",
    description: "Long-form pages such as The Kashmir Cause.",
    group: "Content",
    prefix: "page",
    sort: "order",
    titleField: "title",
    subtitleField: "slug",
    imageField: "heroImage",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Web address (slug)", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "heroImage", label: "Header image", type: "image" },
      { name: "body", label: "Content", type: "markdown", required: true },
      { name: "source", label: "Source / credit", type: "text" },
    ],
  },
  {
    key: "hero",
    label: "Hero photos",
    singular: "Hero photo",
    description: "Large photos that fade behind the headline at the top of the home page.",
    group: "Home page",
    prefix: "hero",
    sort: "order",
    titleField: "title",
    imageField: "image",
    fields: [
      { name: "title", label: "Caption (place name)", type: "text", required: true },
      { name: "image", label: "Photo (wide, at least 1600px)", type: "image", required: true },
    ],
  },
  {
    key: "leaders",
    label: "Leadership",
    singular: "Leader",
    description: "President, Prime Minister and other office holders.",
    group: "Home page",
    prefix: "leader",
    sort: "order",
    titleField: "name",
    subtitleField: "role",
    imageField: "image",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Office", type: "text", required: true },
      { name: "image", label: "Portrait", type: "image", required: true },
      { name: "bio", label: "Short profile", type: "textarea", required: true, max: 900 },
      { name: "link", label: "Official website", type: "url" },
    ],
  },
  {
    key: "slides",
    label: "Initiatives & campaigns",
    singular: "Banner",
    description: "Campaign and initiative banners shown in the carousel.",
    group: "Home page",
    prefix: "slide",
    sort: "order",
    titleField: "title",
    subtitleField: "link",
    imageField: "image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "image", label: "Banner image", type: "image", required: true },
      { name: "link", label: "Link (page or website)", type: "text" },
    ],
  },
  {
    key: "glance",
    label: "Kashmir at a glance",
    singular: "Sector",
    description: "Tourism, IT, education, hydro power and other sectors.",
    group: "Home page",
    prefix: "glance",
    sort: "order",
    titleField: "title",
    imageField: "image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "image", label: "Photo", type: "image", required: true },
      { name: "text", label: "Text", type: "textarea", required: true, max: 1200 },
      { name: "accent", label: "Colour", type: "select", options: ACCENTS },
    ],
  },
  {
    key: "stats",
    label: "Key figures",
    singular: "Figure",
    description: "Numbers shown in the AJK at a glance band.",
    group: "Home page",
    prefix: "stat",
    sort: "order",
    titleField: "label",
    subtitleField: "value",
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "value", label: "Value", type: "text", required: true },
      { name: "unit", label: "Unit", type: "text" },
      { name: "note", label: "Note / source", type: "text" },
    ],
  },
  {
    key: "timeline",
    label: "History timeline",
    singular: "Milestone",
    description: "Milestones in the history of Jammu & Kashmir.",
    group: "Home page",
    prefix: "tl",
    sort: "order",
    titleField: "title",
    subtitleField: "year",
    fields: [
      { name: "year", label: "Year", type: "text", required: true, max: 20 },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "text", label: "Description", type: "textarea", required: true, max: 600 },
    ],
  },
  {
    key: "days",
    label: "Days of remembrance",
    singular: "Day",
    description: "National days observed in AJK.",
    group: "Home page",
    prefix: "day",
    sort: "order",
    titleField: "title",
    subtitleField: "date",
    fields: [
      { name: "date", label: "Date", type: "text", required: true, help: "For example: 5 February" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "text", label: "Description", type: "textarea", required: true, max: 400 },
    ],
  },
  {
    key: "departments",
    label: "Departments",
    singular: "Department",
    description: "Departments, courts, boards and online services.",
    group: "Directory",
    prefix: "dept",
    sort: "order",
    titleField: "name",
    subtitleField: "category",
    imageField: "logo",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "url", label: "Website", type: "url", required: true },
      { name: "category", label: "Category", type: "select", options: DEPARTMENT_CATEGORIES, required: true },
      { name: "logo", label: "Logo", type: "image" },
      { name: "featured", label: "Show logo on home page", type: "boolean" },
    ],
  },
  {
    key: "helplines",
    label: "Helplines",
    singular: "Helpline number",
    description: "Emergency and office numbers by district.",
    group: "Directory",
    prefix: "help",
    sort: "order",
    titleField: "designation",
    subtitleField: "group",
    fields: [
      { name: "category", label: "Category", type: "select", options: HELPLINE_CATEGORIES, required: true },
      { name: "group", label: "Group / district", type: "text", required: true, help: "For example: District Kotli" },
      { name: "designation", label: "Office", type: "text", required: true },
      { name: "number", label: "Phone number", type: "text" },
    ],
  },
];

export function getCollection(key: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.key === key);
}

export const SETTINGS_FIELDS: { section: string; fields: Field[] }[] = [
  {
    section: "Identity",
    fields: [
      { name: "siteName", label: "Official name", type: "text", required: true },
      { name: "shortName", label: "Short name", type: "text", required: true },
      { name: "urduName", label: "Name in Urdu", type: "text" },
    ],
  },
  {
    section: "Home page",
    fields: [
      { name: "heroEyebrow", label: "Hero small heading", type: "text" },
      { name: "heroTitle", label: "Hero title", type: "text", required: true },
      { name: "heroSubtitle", label: "Hero text", type: "textarea" },
      { name: "intro", label: "Introduction", type: "textarea" },
      { name: "overview", label: "AJK overview", type: "textarea" },
    ],
  },
  {
    section: "Kashmir cause band",
    fields: [
      { name: "causeTitle", label: "Title", type: "text" },
      { name: "causeText", label: "Text", type: "textarea" },
      { name: "causeQuote", label: "Quote", type: "textarea" },
      { name: "causeQuoteSource", label: "Quote source", type: "text" },
    ],
  },
  {
    section: "Contact & links",
    fields: [
      { name: "contactAddress", label: "Address", type: "text" },
      { name: "contactPhone", label: "Phone", type: "text" },
      { name: "contactEmail", label: "Email", type: "text" },
      { name: "jobsUrl", label: "Jobs portal link", type: "url" },
      { name: "tendersUrl", label: "Tenders link", type: "url" },
      { name: "facebook", label: "Facebook page", type: "url" },
      { name: "twitter", label: "X (Twitter) profile", type: "url" },
      { name: "youtube", label: "YouTube channel", type: "url" },
      { name: "footerNote", label: "Footer note", type: "text" },
    ],
  },
];
