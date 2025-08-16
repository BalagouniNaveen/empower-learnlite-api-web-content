import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function load(locale: string) {
  const raw = fs.readFileSync(path.join(__dirname, "../../content/lessons."+locale+".json"), "utf-8");
  const data = JSON.parse(raw) as Array<{slug:string,topic:string,title:string,body:string,estMins?:number,questions:{prompt:string,options:string[],answer:number}[]}>;
  for (const l of data) {
    const lesson = await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: { title: l.title, body: l.body, topic: l.topic, locale, estMins: l.estMins ?? 3 },
      create: { slug: l.slug, topic: l.topic, locale, title: l.title, body: l.body, estMins: l.estMins ?? 3 }
    });
    // replace questions
    await prisma.question.deleteMany({ where: { lessonId: lesson.id } });
    for (const q of l.questions) {
      await prisma.question.create({ data: {
        lessonId: lesson.id,
        prompt: q.prompt,
        optionA: q.options[0], optionB: q.options[1], optionC: q.options[2], optionD: q.options[3],
        correct: q.answer
      }});
    }
  }
}

async function main(){
  await load("en");
  try { await load("te"); } catch { console.log("No Telugu content yet; skipping"); }
}

main().then(()=>prisma.$disconnect());
