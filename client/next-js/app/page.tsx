"use client";
import {generateRandomness} from "@mysten/sui/zklogin";
import {useZKLogin, ZKLogin} from "react-sui-zk-login-kit";

import {useEffect} from "react";

import General from "@/components/general";


export default function Home() {

    return (
        <section className="flex flex-col items-center justify-center">



            <General/>


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
