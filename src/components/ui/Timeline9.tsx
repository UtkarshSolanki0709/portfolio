import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type TimelineEntry = {
  date: string;
  title: string;
  content: string;
};

const timelineData: TimelineEntry[] = [
  {
    date: "1956",
    title: "The Birth of AI",
    content:
      "The term 'Artificial Intelligence' was coined at the Dartmouth Conference, marking the official beginning of AI as a field. John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon organized this seminal event, setting the stage for decades of research and development.",
  },
  {
    date: "1966-1973",
    title: "Early Optimism and First AI Winter",
    content:
      "The early years saw significant optimism with programs like ELIZA (the first chatbot) and SHRDLU (a natural language understanding system). However, by the early 1970s, funding dried up as researchers faced the limitations of early computing power and the complexity of human intelligence.",
  },
  {
    date: "1980-1987",
    title: "Expert Systems and Revival",
    content:
      "AI experienced a revival with the development of expert systems like MYCIN (for medical diagnosis) and XCON. These systems used rules to mimic human expertise in specific domains. The Japanese Fifth Generation Computer systems project also stimulated global research interest.",
  },
  {
    date: "1987-1993",
    title: "Second AI Winter",
    content:
      "A second AI winter occurred as expert systems proved difficult to maintain, update, and scale. Specialized AI hardware markets collapsed, and the high costs of these systems led to widespread disillusionment and reduced funding from both governments and corporations.",
  },
  {
    date: "1997",
    title: "Deep Blue Defeats Kasparov",
    content:
      "IBM's Deep Blue defeated world chess champion Garry Kasparov in a highly publicized match. This milestone demonstrated the power of brute-force search and heuristic evaluation, proving that computers could master highly complex games previously thought to require human intuition.",
  },
  {
    date: "2011",
    title: "Watson Wins Jeopardy!",
    content:
      "IBM's Watson won the Jeopardy! quiz show against former champions Ken Jennings and Brad Rutter. Watson processed natural language questions, retrieved information from a massive offline database, and calculated probabilities to buzz in and answer, showcasing advances in question answering.",
  },
  {
    date: "2012",
    title: "Deep Learning Breakthrough",
    content:
      "The AlexNet convolutional neural network won the ImageNet challenge by a wide margin, triggering the modern deep learning boom. Geoffrey Hinton, Alex Krizhevsky, and Ilya Sutskever demonstrated that training deep networks on GPUs could achieve unprecedented accuracy in image recognition.",
  },
  {
    date: "2016",
    title: "AlphaGo Defeats Lee Sedol",
    content:
      "Google DeepMind's AlphaGo defeated 18-time world Go champion Lee Sedol in Seoul, South Korea. AlphaGo combined deep neural networks with Monte Carlo Tree Search, learning from historical games and self-play, surpassing expectations for when AI could master the game of Go.",
  },
  {
    date: "2020",
    title: "GPT-3 and Large Language Models",
    content:
      "OpenAI released GPT-3, a model with 175 billion parameters, demonstrating remarkable natural language generation and few-shot learning capabilities. This marked a shift toward massive transformer-based models capable of performing a wide range of tasks without task-specific training.",
  },
  {
    date: "2022",
    title: "ChatGPT and Generative AI Boom",
    content:
      "OpenAI launched ChatGPT, bringing conversational AI to the general public. ChatGPT quickly became the fastest-growing consumer application in history, accelerating global interest, investment, and research in generative AI and leading to widespread deployment across industries.",
  },
];

interface Timeline9Props {
  className?: string;
}

const Timeline9 = ({ className }: Timeline9Props) => {
  return (
    <section className={cn("bg-background py-32", className)}>
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The History of Artificial Intelligence
          </h2>
          <p className="mt-4 text-muted-foreground">
            Key milestones and breakthroughs that shaped the field of AI.
          </p>
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Separator
            orientation="vertical"
            className="absolute top-4 left-2 bg-muted h-[calc(100%-2rem)]"
          />
          {timelineData.map((entry, index) => (
            <div key={index} className="relative mb-10 pl-8 last:mb-0">
              <div className="absolute top-3.5 left-0 flex size-4 items-center justify-center rounded-full bg-foreground border border-background" />
              <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-2 xl:px-3">
                {entry.title}
              </h4>

              <h5 className="text-md top-3.5 -left-34 rounded-xl tracking-tight text-muted-foreground xl:absolute">
                {entry.date}
              </h5>

              <Card className="my-5 border-none shadow-none">
                <CardContent className="px-0 xl:px-2">
                  <div
                    className="prose text-foreground dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Timeline9 };
