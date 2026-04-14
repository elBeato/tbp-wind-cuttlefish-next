import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [imageSrc, setImageSrc] = useState("/logo.png");

  const images = [
    "/logo.png",
    "/image_1.jpg",
    "/image_3.jpg",
    "/image_4.jpg",
    "/image_5.jpg",
    "/image_6.jpg",
    "/image_7.jpg",
    "/image_8.jpg",
  ];

  const handleChangeImage = () => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setImageSrc(randomImage);
  };

  return (
    <div className="flex flex-col items-center gap-10 py-6">

      {/* Random Image Button */}
      <button
        onClick={handleChangeImage}
        className="simpleButton"
        aria-label="Change Image"
      >
        🦞
      </button>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-8 text-center sm:text-left">

        <img
          className="dark:invert max-w-full h-auto"
          src={imageSrc}
          alt="Windseeker logo"
        />

        <ol className="list-decimal list-inside text-sm space-y-2 font-[family-name:var(--font-geist-mono)]">
          <li>Stay stoked by receiving mails from your favorite windspots. 🏄‍♂️</li>
          <li>Subscribe with your email.</li>
          <li>Choose your home spots.</li>
        </ol>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Link
            to="/register-step1"
            className="rounded-full bg-foreground text-background px-5 h-12 flex items-center gap-2 text-sm sm:text-base hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            <img
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Register now
          </Link>

          <Link
            to="/login"
            className="rounded-full border border-black/[.08] dark:border-white/[.145] px-5 h-12 flex items-center text-sm sm:text-base hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Secondary Links */}
      <div className="flex flex-wrap items-center justify-center gap-10 pt-6 text-sm">
        <Link
          to="/station"
          className="flex items-center gap-2 hover:underline"
        >
          <img src="/windsock.png" alt="" width={16} height={16} />
          Find your station
        </Link>

        <Link
          to="/donation"
          className="flex items-center gap-2 hover:underline"
        >
          <img src="/ehecatl.png" alt="" width={16} height={16} />
          Support us
        </Link>
      </div>

    </div>
  );
}