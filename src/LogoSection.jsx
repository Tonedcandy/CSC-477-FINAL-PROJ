import banner1 from "./assets/banner/1.png";
import banner2 from "./assets/banner/2.png";
import banner3 from "./assets/banner/3.gif";
import banner4 from "./assets/banner/4.jpg";
import banner5 from "./assets/banner/5.webp";
import banner6 from "./assets/banner/6.png";
import banner7 from "./assets/banner/7.png";
import banner8 from "./assets/banner/8.png";
import banner9 from "./assets/banner/9.jpg";
import banner10 from "./assets/banner/10.webp";
import banner11 from "./assets/banner/11.jpg";
import banner12 from "./assets/banner/12.svg";
import banner13 from "./assets/banner/13.png";
import banner14 from "./assets/banner/14.png";
import banner15 from "./assets/banner/15.png";
import banner16 from "./assets/banner/16.png";

const rowOne = [
  { src: banner1, bg: "bg-white" },
  { src: banner2, bg: "bg-white" },
  { src: banner3, bg: "bg-white" },
  { src: banner4, bg: "bg-yellow-400" },
  { src: banner5, bg: "bg-white" },
  { src: banner6, bg: "bg-white" },
  { src: banner7, bg: "bg-white" },
  { src: banner8, bg: "bg-white" },
];

const rowTwo = [
  { src: banner9, bg: "bg-amber-600" },
  { src: banner10, bg: "bg-white" },
  { src: banner11, bg: "bg-pink-300" },
  { src: banner12, bg: "bg-white" },
  { src: banner13, bg: "bg-white" },
  { src: banner14, bg: "bg-white" },
  { src: banner15, bg: "bg-white" },
  { src: banner16, bg: "bg-white" },
];

function BannerRow({ items }) {
  return (
    <div className="flex w-full flex-row bg-black">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`aspect-square flex-1 flex items-center justify-center ${item.bg}`}
        >
          <img className="max-w-full max-h-full" src={item.src} alt="" />
        </div>
      ))}
    </div>
  );
}

export default function LogoSection() {
  return (
    <div className="flex flex-col ">
      <BannerRow items={rowOne} />
      <BannerRow items={rowTwo} />
    </div>
  );
}
