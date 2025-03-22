"use client";

import General from "@/components/general";

export default function Home() {
  return (
      <section className="flex flex-col items-center justify-center">
         <div className="z-[2]">
             <General/>
         </div>
          <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
          >
              <source src="/bg.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
          </video>
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
      </section>
  );
}
