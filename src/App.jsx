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
  return (
    <div className='min-h-screen bg-slate-200 flex justify-center py-10'>
      <main className='bg-white shadow-lg border-slate-300 
       w-[794px] min-h-[1123px]
       rounded-sm px-12 py-16
      '>

        <LogoSection />
        <br />
        <p className='text-[purple] text-2xl font-bold'>Tracing the Spread of Protestantism in the United States</p>
        <p className=" text-xl text-[purple]">
          History and Present-Day Footprint
        </p>
        <br />
        {/* <h1 className='xl text-black'>{displayText}</h1> */}
        <section className='text-black font-sans text-justify'>
          <p className=" text-xl text-[purple]">Introduction</p>
          <p>Protestantism has shaped the social, cultural, and political landscape of the United States in ways that are easy to feel but harder to see clearly. This project traces how Protestant traditions took root, spread, and shifted from the colonial era to the present, focusing on both geography and denominational families. Rather than telling the story only in words, it uses maps, charts, and symbols to highlight patterns that might otherwise be missed: regions where Protestant churches remain dominant, places where their presence has weakened, and the variety that exists inside the broad label “Protestant.” The goal is not to make theological claims or rank traditions, but to give readers an accessible visual starting point for thinking about religious change. By combining historical context with present-day data, the piece invites you to compare intuition with evidence and to notice where they line up or fall apart.
          </p>
          <br />
          <p className=" text-xl text-[purple]">Historical Overview</p>
          <p>From the beginning, Protestantism in the United States was tied to migration, empire, and local control. Early English colonies brought Anglican, Congregational, and Presbyterian traditions with them, but these churches quickly adapted to life on the frontier and the absence of a strong state church. Congregations were often small, scattered, and lay-led, and ministers had to travel long distances to serve people in rural settlements. Over time, this produced a religious culture that emphasized preaching, personal conviction, and voluntary association rather than centralized hierarchy. Even in this early period, different regions began to develop distinct profiles, with New England leaning toward Congregationalism, the Mid-Atlantic toward a mix of Reformed and pietist groups, and the South anchored by Anglican establishments that would later be reshaped.
          </p>
          <br />
          <div className='relative'>
            <div className="origin-top-right scale-75 float-right ml-6">
              {/* <ProtestantLabel /> */}

            </div>
            <div className='text-start'>
              <ol className='space-y-2 list-decimal pl-4'>
                <li>Each family in the chart traces back to these colonial and frontier churches.</li>
                <li>Their early growth followed settlement routes, from coastal towns into the interior.</li>
                <li>Over time they became tied to specific regions, communities, and local institutions.</li>
              </ol>
              <br />
              <p>In the eighteenth and nineteenth centuries, waves of revival known as the First and Second Great Awakenings helped transform Protestantism from a set of transplanted European churches into a mass, popular religious landscape. Revival preachers traveled across colonies and new states, organizing camp meetings and emphasizing conversion, personal holiness, and emotional expression. New movements such as the Baptists and Methodists grew rapidly, especially in the South and along the western frontier, where their flexible structures and lay preachers could reach people more effectively than older, more formal traditions. At the same time, Lutheran, Reformed, and other immigrant-rooted churches took shape in the Midwest and Great Lakes regions, following German, Scandinavian, and Dutch settlement patterns and establishing strong regional bases.
              </p>
            </div>
            <p className='mt-4'>By the twentieth century, the Protestant landscape had fractured and diversified even further, producing the familiar categories of “mainline,” “evangelical,” and historically Black Protestant churches. Mainline denominations often concentrated in older urban centers, college towns, and parts of the Northeast and Midwest, while evangelical and Pentecostal groups spread quickly through the South, Sunbelt, and growing suburbs. Historically Black churches, formed under and against the realities of slavery and segregation, built dense institutional networks in Southern states and major Northern cities. Immigration, urbanization, and religious switching have continued to reshape this picture, but many of these historical patterns still echo in today’s maps: regions that were evangelized by certain denominations, or shaped by particular waves of migration, often remain visibly marked by those histories in their present-day religious profiles.</p>
            <div className='clear-both' />
          </div>

          <br />
          <p className=" text-xl text-[purple]">Data and Definitions</p>
          <p>All of the visualizations in this project depend on how we count and classify religious identity, so it is important to be explicit about sources and categories. Population estimates for Protestant affiliation are drawn primarily from large survey projects and religion censuses that report state- or county-level breakdowns, such as national religious landscape studies and the U.S. Religion Census. In this article, “Protestant” is used as an umbrella term that includes mainline, evangelical, and historically Black Protestant traditions, as well as several smaller Reformed, holiness, and Pentecostal groups. Non-denominational churches with Protestant roots are grouped with evangelical or independent categories when possible, but some gray areas remain. All counts are approximate, rounded for readability, and reflect self-identification rather than formal membership rolls. The maps and charts should therefore be read as informed snapshots of broad patterns, not as precise theological or institutional boundaries.</p>
          <br />
          <p className='text-xl text-[purple]'>The Religious Landscape Today</p>
          {/* <MapChart us={usData} /> */}
          <p className="mt-4 text-sm text-gray-500">
            Selected state: {selectedState || "None"}
          </p>
          <section className="mt-6 gap-6 flex flex-row">
            {/* Map */}
            <div className="lg:w-8/12 w-full h-full">
              <MapChart
                us={usData}
                selectedState={selectedState}
                selectedFamily={selectedFamily}
                onStateClick={setSelectedState}
              />
              <br />
              <p className='w-full text-[0.7em] font-extrabold'>Figure: Protestant presence by state.</p>
              <p className='w-full text-[0.6em]'>
                This choropleth map shows the share of residents in each U.S. state who identify with a Protestant tradition. Darker shading indicates a higher proportion of Protestants, while lighter shading marks states where Protestants make up a smaller share of the population. Use this map as a snapshot of the current religious landscape across the country.</p>

            </div>

            {/* Label */}
            <div className="scale-[0.7] origin-top-left md:w-4/12 w-full flex justify-start">
              <ProtestantLabel
                selectedState={selectedState}
                selectedFamily={selectedFamily}
                onFamilySelect={setSelectedFamily}
              />
            </div>
          </section>


          <br />
          <section>
            <p className='font-bold'>References</p>
            <p>US Religion Census - <a className='text-[#00008b]' href="https://www.usreligioncensus.org/node/1639">2020 U.S. Religion Census: Religious Congregations & Adherents Study. Association of Statisticians of American Religious Bodies.</a></p>
            <p>Pew Research Center - <a className='text-[#00008b]' href="https://www.pewresearch.org/religious-landscape-study/?gad_source=1&gad_campaignid=22378837192&gbraid=0AAAAA-ddO9ENPLuTQ1VMpTLSt_E-sOSXb&gclid=Cj0KCQiA5uDIBhDAARIsAOxj0CGNxYSMKe41sXcLeCBwAEC5uuG9kWKCpcLKa7bD0NM5ej6xyjftuw8aAhIqEALw_wcB">Religious Landscape Study 2023-24</a></p>

          </section>

        </section>
      </main>

    </div>
  )
}

export default App
