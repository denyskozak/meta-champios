"use client";

import {Link} from "@heroui/link";
import {Snippet} from "@heroui/snippet";
import {Code} from "@heroui/code";
import {button as buttonStyles} from "@heroui/theme";
import {generateRandomness} from "@mysten/sui/zklogin";
import {ZKLogin, useZKLogin} from "react-sui-zk-login-kit";

import {siteConfig} from "@/config/site";
import {title, subtitle} from "@/components/primitives";
import {GithubIcon} from "@/components/icons";
import {useEffect} from "react";
import General from "@/app/champion-ships/general";

const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';

// values can be stored in .env
const providers = {
    google: {
        clientId: "648851101099-uit5tqa2gf0nr1vvpjorc87k2u4minip.apps.googleusercontent.com",
        redirectURI: "http://localhost:3000",
    },
    twitch: {
        clientId: "ltu7mhvfj4l04maulcjcqx1wm5e5zh",
        redirectURI: "http://localhost:3000",
    }
}


export default function Home() {
    const {encodedJwt, userSalt, setUserSalt, address, logout} = useZKLogin();

    useEffect(() => {
        if (encodedJwt) {
            // make you request to your server
            // for recive useSalt by jwt.iss (issuer id)
            const requestMock = new Promise(
                (resolve): void =>
                    resolve(localStorage.getItem("userSalt") || generateRandomness())
            );

            requestMock.then(salt => setUserSalt(String(salt)))
        }
    }, [encodedJwt]);

    return (
        <section className="flex flex-col items-center justify-center  pt-8">
        {/*    <div className="inline-block max-w-xl text-center justify-center ">*/}
        {/*        <span className={title()}>Join&nbsp;</span>*/}
        {/*        <span className={title({color: "violet"})}>Competitive&nbsp;</span>*/}
        {/*        <span className={title()}>Path&nbsp;</span>*/}
        {/*        <br/>*/}
        {/*        <span className={title()}>*/}
        {/*  with multi-game Championships&nbsp;*/}
        {/*</span>*/}
        {/*        /!*<div className={subtitle({class: "mt-4"})}>*!/*/}
        {/*        /!*    Hard, Blood, Money.*!/*/}
        {/*        /!*</div>*!/*/}
        {/*    </div>*/}

            {address
                ? (
                    <General/>
                )
                : (
                    <ZKLogin
                        providers={providers}
                        proverProvider={SUI_PROVER_ENDPOINT}
                    />
                )}

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
