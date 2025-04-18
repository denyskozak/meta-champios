import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";
import "@mysten/dapp-kit/dist/index.css";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo_big.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased ",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className=" h-screen w-screen">
            <Navbar />
            <div className="relative justify-center flex flex-col w-full h-[calc(100%-64px)]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="blur-sm absolute top-0 left-0 w-full h-full object-cover z-[0]"
              >
                <source src="/bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <main className="z-[1] flex justify-center items-center w-full h-full overflow-y-scroll">
                {children}
              </main>

              {/*<footer className="w-full flex items-center justify-center py-3">*/}
              {/*  <Link*/}
              {/*    isExternal*/}
              {/*    className="flex items-center gap-1 text-current"*/}
              {/*    href="https://heroui.com?utm_source=next-app-template"*/}
              {/*    title="heroui.com homepage"*/}
              {/*  >*/}
              {/*    <span className="text-default-600">Powered by</span>*/}
              {/*    <p className="text-primary">HeroUI</p>*/}
              {/*  </Link>*/}
              {/*</footer>*/}
            </div>
          </div>
        </Providers>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/TextPlugin.min.js" />
      </body>
    </html>
  );
}
