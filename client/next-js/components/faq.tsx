import { Accordion, AccordionItem } from "@heroui/react";

export function FAQ() {
  const questions = [
    [
      "What is Meta Wars Championship?",
      "Meta Wars Championship is a first gaming tournament platform where players can earn from win",
    ],
    [
      "How I can earn?",
      "Win championships and get part of prize which spread over winners",
    ],
    [
      "How I can exchange Sui coin to Euro/USD?",
      "Withdraw your coins to any market like Binance, Crypto.com and exchange to fiat (Euro, USD)",
    ],
    [
      "What game titles can be hosted on this platform?",
      "Any game title can be hosted. Now prior League of Legends",
    ],
  ];

  return (
    <Accordion>
      {questions.map(([question, answer], index) => (
        <AccordionItem
          key={index + 1}
          aria-label={`Q${index + 1}: ${question}`}
          title={`Q${index + 1}: ${question}`}
        >
          {answer}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
