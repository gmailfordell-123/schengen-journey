/**
 * Static content for the marketing homepage sections.
 * UK & Ireland focused Schengen visa consultancy.
 */

/** Icon key — mapped to a lucide-react icon in the Services component. */
export type ServiceIcon =
  | "scheduling"
  | "form"
  | "checklist"
  | "cover-letter"
  | "insurance"
  | "flight"
  | "hotel"
  | "tracking"
  | "support";

export type Service = {
  icon: ServiceIcon;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: "scheduling",
    tag: "Appointments",
    title: "Schengen Appointment Scheduling",
    subtitle: "Earliest available slots secured on your behalf",
    description:
      "We identify and secure the earliest available appointment slots at VFS Global and TLScontact centres across the UK and Ireland, managing the entire booking process for you.",
  },
  {
    icon: "form",
    tag: "Documentation",
    title: "Visa Application Form Assistance",
    subtitle: "Line-by-line review before submission",
    description:
      "Our team reviews your completed Schengen visa application form in full to ensure every section is accurate, consistent and meets the consulate's requirements before submission.",
  },
  {
    icon: "checklist",
    tag: "Documentation",
    title: "Document Checklist & Review",
    subtitle: "Tailored to your destination and profile",
    description:
      "We prepare a personalised document checklist based on your destination country and applicant profile, then review every item before your appointment to prevent avoidable rejections.",
  },
  {
    icon: "cover-letter",
    tag: "Documentation",
    title: "Cover Letter Preparation",
    subtitle: "Professionally written for your application",
    description:
      "We prepare a professional cover letter addressing your travel purpose, itinerary and financial standing. A well-written letter significantly strengthens your Schengen visa application.",
  },
  {
    icon: "insurance",
    tag: "Insurance",
    title: "Travel Medical Insurance",
    subtitle: "Schengen-compliant coverage from day one",
    description:
      "We help you obtain Schengen-compliant travel insurance with a minimum of €30,000 coverage, valid across all 27 member states for the full duration of your permitted stay.",
  },
  {
    icon: "flight",
    tag: "Reservations",
    title: "Flight Reservation",
    subtitle: "Confirmed itinerary accepted by all consulates",
    description:
      "We provide confirmed flight reservations showing your entry and exit from the Schengen zone. These are genuine reservation records accepted as proof of travel by all Schengen consulates.",
  },
  {
    icon: "hotel",
    tag: "Reservations",
    title: "Hotel Reservation",
    subtitle: "Full itinerary with verified booking references",
    description:
      "We provide hotel reservations for your complete travel itinerary with verified booking reference numbers, accepted by all Schengen consulates as formal proof of accommodation.",
  },
  {
    icon: "tracking",
    tag: "Tracking",
    title: "Real-Time Application Tracking",
    subtitle: "Full visibility at every stage",
    description:
      "Monitor your visa application status in real time through your personal dashboard. Receive status updates and detailed admin notes at every stage from submission to final decision.",
  },
  {
    icon: "support",
    tag: "Support",
    title: "Dedicated Client Support",
    subtitle: "Expert guidance throughout your journey",
    description:
      "Our UK and Ireland support team is available throughout your entire application process to answer questions and provide expert guidance at every step of your visa journey.",
  },
];

export type Reason = {
  stat: string;
  label: string;
  description: string;
};

export const reasons: Reason[] = [
  {
    stat: "5,000+",
    label: "Clients Assisted",
    description:
      "Applicants from the UK and Ireland successfully guided through the Schengen appointment process.",
  },
  {
    stat: "27",
    label: "Schengen States",
    description:
      "We cover all 27 Schengen member states, from France and Germany to lesser-visited destinations.",
  },
  {
    stat: "98%",
    label: "Client Satisfaction",
    description:
      "Our clients rate us highly for professionalism, communication, and quality of service.",
  },
  {
    stat: "48 hrs",
    label: "Average Turnaround",
    description:
      "From enquiry to confirmed appointment support, our team moves quickly so you don't miss slots.",
  },
];

export type Step = {
  number: string;
  title: string;
  description: string;
};

export const steps: Step[] = [
  {
    number: "01",
    title: "Choose Your Country",
    description:
      "Select whether you are applying from the United Kingdom or the Republic of Ireland. This determines which visa centres and processes apply to you.",
  },
  {
    number: "02",
    title: "Select Visa Centre",
    description:
      "Choose the VFS Global or TLScontact location nearest to you — London, Manchester, Birmingham, Edinburgh, or Dublin.",
  },
  {
    number: "03",
    title: "Choose Destination",
    description:
      "Select your intended Schengen destination country. Different countries have different consulate requirements and processing times.",
  },
  {
    number: "04",
    title: "Create Your Account",
    description:
      "Register securely on the Schengen Journey platform. Your data is stored safely and your application progress is tracked from day one.",
  },
  {
    number: "05",
    title: "Choose a Package",
    description:
      "Select the service package that suits your needs — from our Essential appointment support to the full Platinum service with all documentation.",
  },
  {
    number: "06",
    title: "Submit Applicant Details",
    description:
      "Enter passport information, travel dates, and applicant details. Our team reviews everything and begins preparing your appointment and documents.",
  },
  {
    number: "07",
    title: "Receive Your Reference",
    description:
      "Once processed, you receive a unique reference number (SJ-XXXXXX) and confirmation of your appointment support details via email.",
  },
  {
    number: "08",
    title: "Track Your Application",
    description:
      "Log into your dashboard at any time to see your current status, document checklist, appointment details, and admin notes from our team.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  location: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I had been struggling to get an appointment for weeks. Schengen Journey found a slot within 48 hours and handled all the paperwork. Truly professional from start to finish.",
    name: "Farhan A.",
    role: "Software Engineer",
    initials: "FA",
    location: "London, UK",
  },
  {
    quote:
      "The cover letter they prepared was exceptional. My France visa was approved first time. Worth every penny for the peace of mind and the quality of support.",
    name: "Priya M.",
    role: "Healthcare Professional",
    initials: "PM",
    location: "Manchester, UK",
  },
  {
    quote:
      "As an Irish resident, I wasn't sure of the process. The team explained everything clearly, got me a hotel reservation and flight itinerary, and I had my visa within 12 days.",
    name: "Oluwaseun B.",
    role: "Business Consultant",
    initials: "OB",
    location: "Dublin, Ireland",
  },
  {
    quote:
      "The tracking dashboard is excellent. I could see exactly where my application was at every stage. The admin notes kept me informed. Highly recommend.",
    name: "Aarav S.",
    role: "University Student",
    initials: "AS",
    location: "Birmingham, UK",
  },
  {
    quote:
      "I needed to apply for Spain urgently. The team moved fast, provided all the supporting documents, and my appointment was confirmed in 24 hours. Remarkable service.",
    name: "Yemi O.",
    role: "Marketing Director",
    initials: "YO",
    location: "Edinburgh, UK",
  },
  {
    quote:
      "The document checklist was incredibly thorough. Nothing was missed. My German visa appointment went smoothly and the visa was granted without any additional requests.",
    name: "Aisha K.",
    role: "Financial Analyst",
    initials: "AK",
    location: "Dublin, Ireland",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "What is a Schengen visa appointment and why do I need one?",
    answer:
      "A Schengen visa appointment is a mandatory in-person meeting at a visa application centre or consulate where you submit your biometrics and documentation. Most Schengen consulates in the UK and Ireland require this appointment before they process your visa. Appointment slots can be very limited, especially in peak periods, which is why securing one early is critical.",
  },
  {
    question: "I am based in the UK. Which visa centres can I apply from?",
    answer:
      "As a UK resident, you can apply at VFS Global or TLScontact centres depending on your destination country. We support applications from London (multiple locations), Manchester, Birmingham, and Edinburgh. Different Schengen countries have their consulates or partner centres in different cities.",
  },
  {
    question: "I am based in Ireland. Where can I apply?",
    answer:
      "Ireland-based applicants typically apply through visa application centres in Dublin. We support Dublin-based applications for all major Schengen destinations. Some consulates may also have direct appointment systems which we help you navigate.",
  },
  {
    question: "What documents are required for a Schengen visa?",
    answer:
      "The standard requirements include a valid passport with at least 3 months validity beyond your return date, UK or Irish residence permit/visa, recent passport photos, travel insurance with minimum €30,000 cover, confirmed flight reservations, hotel bookings or accommodation proof, bank statements from the last 3–6 months, employment letter or payslips, and a cover letter explaining your travel purpose. Additional documents may be required by specific countries.",
  },
  {
    question: "Does Schengen Journey submit my visa application on my behalf?",
    answer:
      "No. We are an appointment support and document preparation service. We help you prepare a thorough, complete application and guide you through the appointment process. You attend the appointment in person and submit your documents directly to the consulate or visa centre. This is required by all Schengen countries for biometric collection.",
  },
  {
    question: "What is travel medical insurance and why is it mandatory?",
    answer:
      "Schengen travel insurance is a mandatory requirement for all visa applicants. It must cover medical expenses of at least €30,000, including emergency repatriation, and be valid in all 27 Schengen member states for the full period of your stay. We help you obtain a qualifying policy from a recognised insurer.",
  },
  {
    question: "What is a flight reservation and is it the same as a ticket?",
    answer:
      "A flight reservation (also called a dummy ticket or flight itinerary) is a confirmed booking showing your planned travel dates, routes, and passenger details, but it is not a purchased ticket. Most consulates accept a reservation rather than a full paid ticket, as purchasing a ticket before visa approval carries financial risk. We provide genuine reservations accepted by all Schengen consulates.",
  },
  {
    question: "How long does the Schengen visa process take?",
    answer:
      "Processing times vary by destination country and consulate. On average, Schengen visas are processed within 15 calendar days of your appointment. Some consulates process within 5–7 working days. We always recommend applying at least 4–6 weeks before your intended travel date to allow sufficient time.",
  },
  {
    question: "What is included in the Platinum Complete Plan?",
    answer:
      "The Platinum Complete Plan is our most comprehensive service. It includes appointment scheduling, full document review, visa application form assistance, a professionally written cover letter, travel medical insurance, confirmed flight reservation, hotel reservations for your full itinerary, real-time application tracking, and dedicated client support throughout your entire process.",
  },
  {
    question: "Are your prices one-time fees or recurring charges?",
    answer:
      "All our packages are one-time fees per application. There are no hidden charges, subscriptions, or recurring costs. UK applicants are charged in GBP and Irish applicants in EUR at the rates shown on our pricing page.",
  },
];
