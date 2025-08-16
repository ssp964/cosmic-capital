import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-neutral-700 dark:text-neutral-300 text-sm">
          © {new Date().getFullYear()} Cosmic Capital. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-black dark:hover:text-white transition"
          >
            Twitter
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-black dark:hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="mailto:hello@cosmic.capital"
            className="text-neutral-500 hover:text-black dark:hover:text-white transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
