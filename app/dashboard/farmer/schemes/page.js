"use client";
import { useState } from "react";

const schemeData = [
    {
      "name": "PM-Kisan Samman Nidhi",
      "description": "Provides ₹6,000 per year to eligible farmer families.",
      "eligibility": "All land-holding farmers.",
      "link": "https://pmkisan.gov.in/",
      "category": "Financial Support"
    },
    {
      "name": "Pradhan Mantri Fasal Bima Yojana",
      "description": "Crop insurance scheme for farmers.",
      "eligibility": "All farmers growing notified crops.",
      "link": "https://pmfby.gov.in/",
      "category": "Insurance"
    },
    {
      "name": "Soil Health Card Scheme",
      "description": "Provides soil health cards to farmers.",
      "eligibility": "All farmers.",
      "link": "https://soilhealth.dac.gov.in/",
      "category": "Soil Management"
    },
    {
      "name": "Kisan Credit Card (KCC)",
      "description": "Offers farmers timely access to credit for crops, equipment, and other needs.",
      "eligibility": "Farmers involved in agriculture and allied activities.",
      "link": "https://pmkisan.gov.in/KCC.aspx",
      "category": "Loans & Credit"
    },
    {
      "name": "e-NAM (National Agriculture Market)",
      "description": "Online trading platform for agricultural commodities to ensure better price discovery.",
      "eligibility": "Licensed farmers and traders.",
      "link": "https://enam.gov.in/",
      "category": "Marketing & Trade"
    },
    {
      "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
      "description": "Encourages organic farming practices through cluster-based approach.",
      "eligibility": "Farmers willing to adopt organic farming.",
      "link": "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
      "category": "Organic Farming"
    },
    {
      "name": "Rashtriya Krishi Vikas Yojana (RKVY)",
      "description": "Provides financial assistance for agricultural development and infrastructure.",
      "eligibility": "States/UTs propose projects; benefits trickle to farmers.",
      "link": "https://rkvy.nic.in/",
      "category": "Financial Support"
    },
    {
      "name": "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
      "description": "Aims to improve irrigation efficiency and ensure water access to every field.",
      "eligibility": "All farmers including small and marginal ones.",
      "link": "https://pmksy.gov.in/",
      "category": "Irrigation"
    },
    {
      "name": "Agri-Clinics and Agri-Business Centres (ACABC)",
      "description": "Promotes entrepreneurship among agriculture graduates to support farmers with services and advice.",
      "eligibility": "Agriculture graduates and diploma holders.",
      "link": "https://agricoop.nic.in/en/Agriclinics",
      "category": "Entrepreneurship & Training"
    },
    {
      "name": "Mukhya Mantri Krishi Ashirwad Yojana (Jharkhand)",
      "description": "Provides financial support to small and marginal farmers in Jharkhand.",
      "eligibility": "Farmers with up to 5 acres of land in Jharkhand.",
      "link": "https://mmkay.jharkhand.gov.in/",
      "category": "Financial Support"
    },
    {
      "name": "National Mission For Sustainable Agriculture (NMSA)",
      "description": "Promotes sustainable agriculture practices especially in rainfed areas.",
      "eligibility": "All farmers, especially in rainfed and degraded lands.",
      "link": "https://agricoop.nic.in/en/NMSA",
      "category": "Sustainable Agriculture"
    },
    {
      "name": "Integrated Scheme for Agricultural Marketing (ISAM)",
      "description": "Improves storage and marketing infrastructure for farm produce.",
      "eligibility": "Farmer Producer Organizations (FPOs), cooperatives, and state agencies.",
      "link": "https://agricoop.nic.in/en/ISAM",
      "category": "Marketing & Trade"
    },
    {
      "name": "PM Formalisation of Micro Food Processing Enterprises (PM FME)",
      "description": "Supports small food processing units including farmer groups with training and funds.",
      "eligibility": "Individual farmers, SHGs, cooperatives, and FPOs.",
      "link": "https://mofpi.nic.in/pmfme",
      "category": "Food Processing"
    },
    {
      "name": "National Mission on Oilseeds and Oil Palm (NMOOP)",
      "description": "Promotes oilseed cultivation and reduces dependency on imports.",
      "eligibility": "Farmers growing oilseeds or interested in oil palm cultivation.",
      "link": "https://nmoop.gov.in/",
      "category": "Crop Development"
    },
    {
      "name": "National Beekeeping & Honey Mission (NBHM)",
      "description": "Supports beekeeping infrastructure and training to increase farmers' income.",
      "eligibility": "Beekeepers, farmers, SHGs, FPOs.",
      "link": "https://nbb.gov.in/",
      "category": "Allied Activities"
    },
    {
      "name": "Micro Irrigation Fund (MIF)",
      "description": "Encourages micro-irrigation systems like drip and sprinkler irrigation.",
      "eligibility": "Small and marginal farmers.",
      "link": "https://pmksy.gov.in/microirrigation.aspx",
      "category": "Irrigation"
    },
    {
      "name": "Gramin Bhandaran Yojana",
      "description": "Helps farmers build storage godowns for storing produce and avoiding distress sale.",
      "eligibility": "All farmers and agriculture entrepreneurs.",
      "link": "https://agricoop.gov.in/en/gb",
      "category": "Storage & Infrastructure"
    },
    {
      "name": "National Agriculture Infra Financing Facility (Agri Infra Fund)",
      "description": "Provides long-term credit for post-harvest infrastructure like warehouses and cold storage.",
      "eligibility": "FPOs, PACS, cooperatives, agri-entrepreneurs.",
      "link": "https://www.agriinfra.dac.gov.in/",
      "category": "Storage & Infrastructure"
    },
    {
      "name": "Sub-Mission on Agricultural Mechanization (SMAM)",
      "description": "Offers subsidies on farm machinery to reduce manual labor and improve productivity.",
      "eligibility": "Small and marginal farmers, especially women and SC/STs.",
      "link": "https://agrimachinery.nic.in/",
      "category": "Machinery & Technology"
    },
    {
      "name": "Kisan Rail Yojana",
      "description": "Ensures fast transportation of perishable agri products across India via dedicated trains.",
      "eligibility": "Farmers and traders transporting agri-produce.",
      "link": "https://www.indianrailways.gov.in/",
      "category": "Transport & Logistics"
    },
    {
        "name": "National Food Security Mission (NFSM)",
        "description": "Aims to increase production of rice, wheat, pulses, and coarse cereals in a sustainable manner.",
        "eligibility": "All eligible farmers in focus districts.",
        "link": "https://nfsm.gov.in/",
        "category": "Crop Development"
      },
      {
        "name": "Mission for Integrated Development of Horticulture (MIDH)",
        "description": "Encourages holistic growth of the horticulture sector.",
        "eligibility": "Horticulture growers, SHGs, and cooperatives.",
        "link": "https://midh.gov.in/",
        "category": "Crop Development"
      },
      {
        "name": "Dairy Entrepreneurship Development Scheme (DEDS)",
        "description": "Promotes self-employment in dairy farming.",
        "eligibility": "Farmers, NGOs, SHGs, cooperatives.",
        "link": "https://nabard.org/",
        "category": "Allied Activities"
      },
      {
        "name": "National Mission on Agricultural Extension & Technology (NMAET)",
        "description": "Focuses on improving extension services and technology delivery to farmers.",
        "eligibility": "Farmers across the country.",
        "link": "https://agricoop.nic.in/en/NMAET",
        "category": "Extension & Training"
      },
      {
        "name": "Support to State Extension Programmes for Extension Reforms (ATMA)",
        "description": "Empowers farmers through training, demonstrations, and exposure visits.",
        "eligibility": "Farmers via state extension systems.",
        "link": "https://agricoop.nic.in/en/atma",
        "category": "Extension & Training"
      },
      {
        "name": "Biotech-KISAN",
        "description": "Bridges the gap between science and farmers through lab-to-land initiatives.",
        "eligibility": "Farmers in rural and underserved areas.",
        "link": "https://dbtindia.gov.in/schemes-programmes/agriculture/biotech-kisan",
        "category": "Research & Innovation"
      },
      {
        "name": "Pradhan Mantri Kisan Maan Dhan Yojana (PM-KMY)",
        "description": "Pension scheme for small and marginal farmers above 60 years of age.",
        "eligibility": "Small & marginal farmers aged 18–40 years.",
        "link": "https://maandhan.in/kisan",
        "category": "Pension & Insurance"
      },
      {
        "name": "Rural Infrastructure Development Fund (RIDF)",
        "description": "Provides loans to State Governments for rural infrastructure projects including agri infrastructure.",
        "eligibility": "Implemented through State Governments.",
        "link": "https://nabard.org/",
        "category": "Infrastructure"
      },
      {
        "name": "Startup Agri India",
        "description": "Supports agri-based startups through mentoring, funding, and incubation.",
        "eligibility": "Agri-tech entrepreneurs, startups, and innovators.",
        "link": "https://startupindia.gov.in/",
        "category": "Entrepreneurship & Training"
      },
      {
        "name": "National e-Governance Plan in Agriculture (NeGP-A)",
        "description": "Aims to provide information to farmers via digital platforms.",
        "eligibility": "All farmers using ICT tools.",
        "link": "https://agricoop.nic.in/en/NeGP-A",
        "category": "Digital Agriculture"
      }
];

const categories = ["All", ...Array.from(new Set(schemeData.map(s => s.category)))];


export default function FarmerSchemesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSchemes =
    selectedCategory === "All"
      ? schemeData
      : schemeData.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-green-800">
        Farmer Schemes
      </h1>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition duration-200 ${
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 border-green-600 hover:bg-green-100"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredSchemes.map((scheme) => (
          <a
            key={scheme.name}
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 rounded-2xl p-4 shadow hover:shadow-lg transition duration-300 bg-white"
          >
            <h3 className="text-xl font-semibold text-green-700 mb-1">{scheme.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
            <p className="text-xs text-gray-500 italic">
              Eligibility: {scheme.eligibility}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
