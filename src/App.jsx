// src/App.jsx

/*
 * This source file was developed by Monish Shanmugham Suresh with assistance from OpenAI tools
 * (ChatGPT and Codex). These tools were used for code suggestions and refactoring;
 * the human author is responsible for all design decisions and final content.
 */

import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MapChart from './MapChart'
import LogoSection from './LogoSection'
import usData from './assets/states-albers-10m.json'
//import ProtestantLabel from './ProtestantLabel'

import ProtestantLabel from "./components/ProtestantLabel";


function App() {
  const [displayText, setDisplayText] = useState("");

  const [selectedState, setSelectedState] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [mapMetric, setMapMetric] = useState("total"); // "total" | "perCapita"

  const [index, setIndex] = useState(0);
  const message = "Hi my name is monish";
  useEffect(() => {
    if (index >= message.length) return;

    const timeoutID = setTimeout(() => {
      setDisplayText((prev) => prev + message[index]);
      setIndex((pi) => pi + 1);
    }, 100);

    return () => clearTimeout(timeoutID);
  }, [index]);

  const isPerCapita = mapMetric === "perCapita";
  const mapFigureTitle = selectedFamily
    ? `${selectedFamily} ${isPerCapita ? "share of population" : "adherents"} by state.`
    : `Protestant ${isPerCapita ? "share of population" : "presence"} by state.`;

  const mapFigureDescription = selectedFamily
    ? `This choropleth map highlights where ${selectedFamily} communities concentrate across the United States. Darker shading indicates states with ${isPerCapita ? "a larger per-capita presence" : "more adherents"} in this family, while lighter shading marks smaller presences.`
    : `This choropleth map shows the ${isPerCapita ? "share of residents" : "number of adherents"} in each U.S. state who identify with a Protestant tradition. Darker shading indicates a higher ${isPerCapita ? "per-capita presence" : "total"}, while lighter shading marks states where Protestants make up a smaller share of the population. Use this map as a snapshot of the current religious landscape across the country.`;

  return (
    <div className='min-h-screen bg-slate-200 flex justify-center py-10'>
      <main className='bg-white shadow-lg border-slate-300 
       w-[794px] min-h-[1123px]
       rounded-sm px-12 py-16
      '>

        <LogoSection />
        <br />
        <p className='text-[purple] text-2xl font-bold'>Mapping Protestantism in the United States</p>
        <p className=" text-xl text-[purple]">
          How today’s religious landscape reflects region, denomination, and history.
        </p>
        <br />
        {/* <h1 className='xl text-black'>{displayText}</h1> */}
        <section className='text-black font-sans text-justify'>
          <p className=" text-xl text-[purple]">Introduction</p>
          <p>Protestantism has been woven into U.S. life for centuries, but its presence is uneven and often hard to see beyond local experience. Some regions feel saturated with churches; others do not.

            This article offers a present-day snapshot of Protestantism across the United States using state-level data. Interactive maps and linked charts show where Protestants are most numerous, which denominational families dominate each state, and how much diversity exists inside broad labels like “Baptist” or “Methodist.”

            The goal is not to rank traditions or make theological claims. Instead, the visuals give readers an accessible way to compare intuition with data and to notice where history, migration, and denomination still shape the religious map of the country.
          </p>
          <br />
          <p className=" text-xl text-[purple]">Historical Overview</p>
          <p>
            The visuals on this page show one moment in time, but today’s patterns are rooted in older histories. Early English colonies brought Anglican, Congregational, and Presbyterian churches to the Atlantic coast. As settlers moved inland, congregations became smaller, more independent, and less tightly controlled, and itinerant preachers carried revival movements across the frontier.

            During the First and Second Great Awakenings, Baptists and Methodists grew especially quickly in the South and interior, while Lutheran and Reformed churches took hold in the Upper Midwest alongside German and Scandinavian immigration. Historically Black Protestant churches formed and expanded under slavery, segregation, and migration to Northern cities, building dense networks of congregations and institutions.

            None of this appears as a time-series in the charts, but these histories help explain why certain Protestant families remain especially strong in some regions and relatively rare in others.

          </p>
          <br />
          <p className='text-xl text-[purple]'>The Religious Landscape Today</p>
          {/* <MapChart us={usData} /> */}
          <p className="mt-4 text-sm text-gray-500">
            Selected state: {selectedState || "None"}
          </p>

          <section className="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-12">
            {/* Map */}
            <div className="relative h-[400px] lg:col-span-8 col-span-12">
              <div className="absolute right-0 top-0 z-10 flex justify-end bg-transparent px-1 py-1 shadow-none border-none">
                <div className="metric-toggle inline-flex border border-slate-300 bg-slate-50 text-xs font-semibold">
                  <button
                    className={`toggle-btn px-2.5 py-1 transition-colors ${!isPerCapita ? "is-active" : ""
                      }`}
                    onClick={() => setMapMetric("total")}
                  >
                    Totals
                  </button>
                  <button
                    className={`toggle-btn px-2.5 py-1 transition-colors ${isPerCapita ? "is-active" : ""
                      }`}
                    onClick={() => setMapMetric("perCapita")}
                  >
                    Per capita
                  </button>
                </div>
              </div>
              <MapChart
                us={usData}
                selectedState={selectedState}
                selectedFamily={selectedFamily}
                metric={mapMetric}
                onStateClick={setSelectedState}
              />

              <p className='w-full text-[0.7em] font-extrabold'>Figure: {mapFigureTitle}</p>
              <p className='w-full text-[0.6em]'>{mapFigureDescription}</p>

            </div>

            {/* Label + Bar chart */}

            <div className={`lg:col-span-4 col-span-12 flex justify-start ${selectedState ? "-mb-25" : ""}`}>
              <div className="scale-[0.7] origin-top-left w-full -mb-25">
                <ProtestantLabel
                  selectedState={selectedState}
                  selectedFamily={selectedFamily}
                  onFamilySelect={setSelectedFamily}
                />
              </div>
            </div>
          </section>

          <p className=" text-xl text-[purple]">Data and Definitions</p>
          <p className="text-sm md:text-base text-gray-800 mb-3">
            All of the visualizations in this project depend on how we count and classify
            religious identity, so it is important to be explicit about sources and
            categories. Population estimates for Protestant affiliation are drawn primarily
            from large survey projects and religion censuses that report state-level
            breakdowns, such as national religious landscape studies and the U.S. Religion
            Census.
          </p>

          <p className="text-sm md:text-base text-gray-800 mb-2">
            In this article, <span className="font-semibold">“Protestant”</span> is used
            as an umbrella term, but the main structure focuses on six broad families, plus
            an “Other” group that bundles smaller or less easily classified Protestant and
            non-denominational churches. This is not the only way to slice the data, but it
            gives a manageable set of “macros” for the Protestant landscape: large enough
            to see national patterns, specific enough to notice regional differences.
          </p>

          <ul className="list-disc list-inside text-sm md:text-base text-gray-800 mb-3">
            <li>Anglicanism</li>
            <li>Lutheranism</li>
            <li>Reformed</li>
            <li>Methodism</li>
            <li>Baptist</li>
            <li>Restoration</li>
          </ul>

          <p className="text-sm md:text-base text-gray-800">
            The “nutrition label”–style panel is intentional. It acts like a quick health
            check of Protestantism in the United States, summarizing its overall size and
            how it is distributed across these families before you dive into the detailed
            maps and bar charts. Just as a food label turns complex ingredients into a
            compact snapshot, this layout turns dense religious statistics into something
            scannable and comparable at a glance. All counts are approximate, rounded for
            readability, and reflect self-identification rather than formal membership
            rolls, so the visuals should be read as informed snapshots of broad patterns
            rather than precise theological or institutional boundaries.
          </p>
          <br />

          <section>
            <p className="text-xl text-[purple]">References</p>
            <p>US Religion Census - <a className='text-[#00008b]' href="https://www.usreligioncensus.org/node/1639" target="_blank" rel="noopener noreferrer">2020 U.S. Religion Census: Religious Congregations & Adherents Study. Association of Statisticians of American Religious Bodies.</a></p>
            {/* <p>Pew Research Center - <a className='text-[#00008b]' href="https://www.pewresearch.org/religious-landscape-study/?gad_source=1&gad_campaignid=22378837192&gbraid=0AAAAA-ddO9ENPLuTQ1VMpTLSt_E-sOSXb&gclid=Cj0KCQiA5uDIBhDAARIsAOxj0CGNxYSMKe41sXcLeCBwAEC5uuG9kWKCpcLKa7bD0NM5ej6xyjftuw8aAhIqEALw_wcB">Religious Landscape Study 2023-24</a></p> */}

          </section>

        </section>
      </main>

    </div>
  )
}

export default App
