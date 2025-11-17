import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MapChart from './MapChart'
import LogoSection from './LogoSection'
import usData from './assets/states-albers-10m.json'
import ProtestantLabel from './ProtestantLabel'


function App() {
  const [displayText, setDisplayText] = useState("");
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
          <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
          <br />
          <p className=" text-xl text-[purple]">Historical Overview</p>
          <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
          <br />
          <div className='relative'>
            <div className="origin-top-right scale-75 float-right ml-6">
              <ProtestantLabel />
            </div>
            <div className='text-start'>
              <ol className='space-y-2 list-decimal pl-4'>
                <li>1. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
                <li>2. Aliquam tincidunt mauris eu risus.</li>
                <li>3. Vestibulum auctor dapibus neque.</li>
              </ol>
              <br />
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
            </div>
            <p className='mt-4'>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
            <div className='clear-both' />
          </div>

          <br />
          <p className=" text-xl text-[purple]">Data and Definitions</p>
          <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
          <br />
          <p className='text-xl text-[purple]'>The Religious Landscape Today</p>
          <br />
          <MapChart us={usData} />
          <br />
          <section>
            <p className='font-bold'>Citations</p>
            <p>Pew Research Center - <a className='text-[#00008b]' href="https://www.pewresearch.org/religious-landscape-study/?gad_source=1&gad_campaignid=22378837192&gbraid=0AAAAA-ddO9ENPLuTQ1VMpTLSt_E-sOSXb&gclid=Cj0KCQiA5uDIBhDAARIsAOxj0CGNxYSMKe41sXcLeCBwAEC5uuG9kWKCpcLKa7bD0NM5ej6xyjftuw8aAhIqEALw_wcB">Religious Landscape Study 2023-24</a>
            </p>

          </section>

        </section>
      </main>

    </div>
  )
}

export default App
