# MetaChampions – Play Beyond

**MetaChampions** is a next-generation gaming platform built on [Sui](https://sui.io/) to host and manage competitive championships for any online game. Our sleek, futuristic landing page (inspired by the screenshot below) captures the essence of what MetaChampions is all about—**epic esports**, **seamless onboarding**, and a **community-driven ecosystem** where skill meets blockchain technology.

> **Screenshot Preview**  
> <br>
> <img src="https://github.com/denyskozak/meta-champios/blob/main/image.png" alt="MetaChampions screenshot" width="600" />
> <br>
> A preview of the futuristic “Play Beyond” hero section on our landing page.

---

## What Is MetaChampions?

MetaChampions leverages the **Sui blockchain** and a **Move smart contract** for creating, managing, and rewarding participants in **esports championships**. Whether you’re a **solo** player, a **clan**, or a **professional team**, we’ve got you covered.

- **Create** a championship for any game (MOBA, FPS, or even retro classics).
- **Join** with your Sui coins and secure a slot in the competition.
- **Automated Payouts** to winners, guaranteed by Sui’s transparent, trustless infrastructure.

All powered by a visually stunning **React** front end that welcomes you with futuristic cityscapes, cyber-inspired typography, and a straightforward user experience.

---

## Features

1. **Heroic Landing Page**  
   A bold, neon-lit design that immerses you in a **cyber-fantasy** city. Our “Play Beyond” slogan sets the tone for cutting-edge esports and blockchain integration.

2. **One-Click Sign-On**  
   Options to **Sign In with Google** or **Twitch** (or any other OAuth provider you’d like to integrate). Get your players onboard quickly.

3. **Sui-Powered Tournaments**
    - **Move Smart Contracts** handle creation, updates, and reward distribution.
    - **High throughput** and low fees on Sui mean quick and cost-effective transactions.

4. **Flexible Team Sizes**  
   Create championships for 1v1, 3v3, 5v5, or **any** custom format.

5. **Seamless Rewards**
    - Rewards automatically paid to winners once the championship finishes.
    - Funds are secured and transparent in the **Move** contract’s `reward_pool`.

6. **Futuristic UI**  
   A **React** front end styled with a futuristic aesthetic. Perfect for gamers who love that sci-fi vibe.

---

## Architecture Overview

1. **Frontend** – A React-based site that:
    - Renders the hero section with stylized background and bold typography.
    - Integrates with the Sui SDK (`@mysten/sui.js`) to sign and submit transactions.
    - Provides forms to **Create**, **Join**, and **Finish** championships.

2. **Smart Contracts** – Move modules that:
    - **`create_championship`**: Creates a championship object, sets rules and entry fees.
    - **`join_championship`**: Allows participants to join, updates the `reward_pool`.
    - **`finish_championship`**: Distributes prizes to winners and closes the championship.

3. **Sui** – The blockchain layer for:
    - Fast, secure, low-fee transactions.
    - Immutable records of all championships, participants, and reward disbursements.

---

## Quick Start

1. **Clone the Repo**
   ```bash
   git clone https://github.com/YourGitHubUser/MetaChampions.git
   cd MetaChampions
