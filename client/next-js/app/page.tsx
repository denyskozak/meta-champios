"use client";

import Image from "next/image";
import React from "react";

import General from "@/components/general";

export default function Home() {
  return (
    <div>
      <General />

      {/*<Card className="max-w-100">*/}
      {/*    <FAQ/>*/}
      {/*</Card>*/}

      {/*<div className="flex gap-3">*/}
      {/*    <Link*/}
      {/*        isExternal*/}
      {/*        className={buttonStyles({*/}
      {/*            color: "primary",*/}
      {/*            radius: "full",*/}
      {/*            variant: "shadow",*/}
      {/*        })}*/}
      {/*        href={siteConfig.links.docs}*/}
      {/*    >*/}
      {/*        Documentation*/}
      {/*    </Link>*/}
      {/*    <Link*/}
      {/*        isExternal*/}
      {/*        className={buttonStyles({variant: "bordered", radius: "full"})}*/}
      {/*        href={siteConfig.links.github}*/}
      {/*    >*/}
      {/*        <GithubIcon size={20}/>*/}
      {/*        GitHub*/}
      {/*    </Link>*/}
      {/*</div>*/}

      {/*  <div className="mt-8">*/}
      {/*      <Snippet hideCopyButton hideSymbol variant="bordered">*/}
      {/*<span>*/}
      {/*  Get started by editing <Code color="primary">app/page.tsx</Code>*/}
      {/*</span>*/}
      {/*      </Snippet>*/}
      {/*  </div>*/}
      <Image
        alt="Sui logo"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[2]"
        height={200}
        src="/Sui_Logo_White.svg"
        width={120}
      />
    </div>
  );
}
