'use client';

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [imageSrc, setImageSrc] = useState('/logo.png'); // Default image

  const handleChangeImage = () => {
    // Array of image paths in the public folder
    const images = ['/logo.png', 
      '/image_1.jpg', 
      '/image_3.jpg', 
      '/image_4.jpg', 
      '/image_5.jpg', 
      '/image_6.jpg', 
      '/image_7.jpg', 
      '/image_8.jpg'];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setImageSrc(randomImage); // Set a random image
  };
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen[10px] p-8 pb-20 gap-0 sm:p-2 font-[family-name:var(--font-geist-sans)]">
      {/* Button in the top-right corner */}
      <button
        onClick={handleChangeImage}
        className="simpleButton"
        aria-label="Change Image"
      >
        🦞
      </button>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src={imageSrc}

          alt="Next.js logo"
          width={530}
          height={20}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Stay stoked by receiving mails from your favorite windspots. 🏄‍♂️
          </li>
          <li className="mb-2">
            Subscribe with your email.
          </li>
          <li className="mb-2">
            Choose your home spots.
          </li>
        </ol>

        <div className="row-start-3 flex gap-60 flex-wrap items-center justify-center">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="./register-step1"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Register now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="./login"
            rel="noopener noreferrer"
          >
            Log in
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-20 flex-wrap items-center justify-center mt-20">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="./station"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/windsock.png"
            alt="File icon"
            width={16}
            height={16}
          />
          Find your station
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="./donation"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/ehecatl.png"
            alt="Window icon"
            width={16}
            height={16}
          />
          Support us
        </a>
      </footer>
    </div>
  );
}
