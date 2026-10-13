---
id: 601055b7-150b-4e6e-876d-4106d75d1f30
title: Teaching Developers in the Age of AI: A Framework for Not Creating Dependency
date: Tue Dec 30 2025
duration: 5 min
categories: ai
---

I'm going to start with a confession: I've fallen into the AI dependency trap myself.

There was a period where I'd open Claude or ChatGPT before I'd even fully thought through a problem. Need a function? Ask AI. Debugging something? Paste it in. Writing a database query? Let the machine handle it. It felt productive. I was shipping code faster than ever.

Until I wasn't.

I started noticing gaps. Small ones at first. I'd get stuck on problems that, a year earlier, I would've solved in twenty minutes with a bit of Googling and some print statements. My debugging instincts had gotten lazy. I was outsourcing not just the typing, but the *thinking*. And that's when I realized something uncomfortable: I was becoming dependent on a tool I didn't fully control.

Now, here's the thing — I've been programming since I was nine. I have over four years of professional experience. I've built MVC frameworks from scratch, written my own ORM to understand how Eloquent works under the hood, and created an entire programming language using Nigerian Pidgin syntax just to see if I could. My fundamentals are solid. So when I caught myself slipping, I could course-correct. I knew *what* I was losing.

But what about someone who never built those fundamentals in the first place?

That's the question that keeps me up at night. Because I don't just write code — I teach people how to write code. I've trained many students in foundational web technologies and mentored interns through their first real projects. And I'm watching, in real-time, what happens when AI tools meet beginner developers.

It's not pretty.



**The Problem I'm Seeing**

Let me tell you about a pattern I've observed multiple times now.

A student is working on a project — maybe a simple CRUD application, maybe a landing page with some JavaScript interactivity. They hit a bug. The page isn't rendering correctly, or an API call is failing, or a loop isn't behaving the way they expect.

In the pre-AI era, this is where learning happened. They'd read the error message. Google it. Find a Stack Overflow thread from 2017 that's *almost* relevant. Try a few things. Break the code worse. Fix it. Celebrate. That struggle — frustrating as it was — was the process of building mental models.

Now? They paste the code into ChatGPT. The AI spits out a fix. They copy it back. The code works.

But here's what didn't happen: they didn't understand *why* it was broken. They didn't build the pattern recognition that would help them avoid the same mistake next time. They didn't learn to read error messages. They just... moved on.

And then they hit another bug. And another. Each time, the AI bails them out. They're shipping code, technically. But they're not becoming developers. They're becoming AI operators who happen to work with code.

I've seen students who can build a full application with AI assistance but can't explain what a callback function does. Students who use async/await everywhere but don't understand why JavaScript needed it in the first place. Students who can prompt their way to a working REST API but freeze up when you ask them to debug a 500 error without AI help.

This isn't the students' fault. They're being rational. AI tools are powerful, they're available, and nobody told them there was a downside. The tools themselves are designed to be helpful — aggressively helpful. They *want* to give you the answer. And when you're a beginner, taking the answer feels a lot better than struggling for three hours on something an AI can solve in three seconds.

But struggling is the point. That's where the learning lives.


**The Counterexample: When AI Actually Works**

Now, I don't want to sound like I'm anti-AI. I'm not. AI tools have genuinely accelerated my learning in ways that wouldn't have been possible five years ago.

Let me give you an example.

When I decided to build Pidgin-Lang — a complete programming language with Nigerian Pidgin syntax — I made a deliberate choice to write it in Go. I'd never written Go before. Not a single line. I knew it was a good fit for the project because of its performance characteristics and how it handles strings, but I'd need to learn the language from scratch.

Here's what happened: I went from writing "Hello, World" to implementing a working tokenizer in about thirty minutes.

Thirty minutes. For a language I'd never touched.

How? AI. I asked Claude to explain Go's syntax. I asked it to show me how Go handles strings, how slices work, how to structure a project. When I wrote something that didn't compile, I asked why. When I didn't understand an error message, I asked for clarification.

But here's the critical difference: I already knew what a tokenizer was. I understood lexical analysis. I'd built interpreters before. I had the *mental model* — I just needed to translate it into a new syntax. The AI wasn't teaching me how to think about the problem. It was teaching me how to express my thoughts in Go.

That's a fundamentally different use case than a beginner asking "how do I make a login page" and copying whatever the AI generates.

AI accelerated my learning because I had a foundation to build on. The foundation came first. The AI came second.


**The Framework: Four Phases of AI Integration**

So how do we teach developers in the age of AI without creating dependency? After a lot of observation and experimentation at SoftSuite Academy, I've landed on a four-phase framework. It's not perfect, but it's working.

**Phase 1: Foundation (AI Off)**

In this phase, AI tools are restricted entirely. Students write code by hand. They debug with console.log and print statements. They read documentation. They suffer through Stack Overflow threads that are slightly outdated and don't quite match their problem.

This is where they learn to *think*. What does this error message actually mean? Why does this loop run one too many times? What happens if I change this variable?

The goal isn't to torture them. It's to build the neural pathways that will serve them for the rest of their careers. You can't outsource this part. There's no shortcut.

Skills developed: syntax, logic, debugging, reading documentation, problem decomposition.

**Phase 2: Comprehension (AI as Tutor)**

Once the fundamentals are solid, AI can enter the picture — but in a limited role. Students can ask AI to *explain* concepts, but not to write code for them.

"Why does JavaScript have both == and ===?"
"What's the difference between let and const?"
"Can you explain how the event loop works?"

These are legitimate uses. The AI becomes a tutor, a more patient and available version of a senior developer who can answer "stupid" questions without judgment.

But — and this is crucial — the student still writes the code themselves. They take the explanation and apply it. If they can't apply it, they don't understand it yet.

Skills developed: conceptual understanding, asking good questions, translating knowledge into code.

**Phase 3: Application (AI as Pair Programmer)**

Now the student has foundations and conceptual understanding. They're building real projects. Here, AI can function as a pair programmer — the student drives, the AI assists.

This looks like:
- Student writes the initial implementation
- Student uses AI to review and suggest improvements
- Student asks AI for help when genuinely stuck, but *after* attempting the problem solo
- Student must explain any AI-generated code before using it

The last point is non-negotiable. If you can't explain it, you can't use it. This forces students to engage with what the AI produces rather than blindly copying.

Skills developed: project architecture, code review, knowing when to ask for help, evaluating AI output critically.

**Phase 4: Acceleration (Full AI Access)**

This is the phase I was in when I learned Go for Pidgin-Lang. The student has transferable mental models. They understand programming, not just a programming language. They can learn new tools quickly because they grasp the underlying patterns.

At this point, full AI access makes sense. The student can use AI to rapidly acquire new syntax, explore unfamiliar frameworks, and prototype ideas quickly. They have the judgment to know when AI output is wrong, the skills to fix it, and the understanding to extend it.

This is where AI becomes genuinely powerful. But you can't skip to this phase. It has to be earned.



**Practical Recommendations for Educators**

If you're teaching developers — whether in a formal bootcamp, a university, or informally mentoring juniors — here are some concrete practices I'd recommend:

**1. Create "no AI" zones.** Certain exercises, especially early ones, should be done without AI assistance. Make this explicit. Explain *why*. Students are more likely to comply when they understand the reasoning.

**2. Require explanations.** If a student uses AI-generated code, they must explain it line by line before it counts as complete. This catches cargo-cult coding early.

**3. Design debugging exercises.** Give students broken code and ask them to fix it without AI. This builds the diagnostic skills that AI tends to atrophy.

**4. Progress gates.** Before a student "unlocks" AI assistance for projects, they should demonstrate foundational competence. This could be a test, a code review, or a live debugging session.

**5. Teach prompt engineering as a skill.** When students do use AI, teach them to use it well. Good prompts lead to better output. Vague prompts lead to generic, often wrong, code.

**6. Model healthy AI use.** Show students how *you* use AI. When do you reach for it? When do you deliberately avoid it? Let them see the judgment calls.



AI tools aren't going away. They're going to get better, faster, and more integrated into every part of the development workflow. That's fine. That's probably good.

But there's a real risk that we raise a generation of developers who can operate AI tools but can't actually program. Who can generate code but can't debug it. Who can ship features but can't architect systems. Who look like engineers on paper but collapse the moment the AI gives them something wrong.

The solution isn't to ban AI. It's to sequence it properly. Foundations first. Understanding second. AI third.

Think of it like power tools. A circular saw is incredibly useful if you already know how to work with wood — how to measure, how to account for the blade width, how to avoid kickback. Hand that same saw to someone who's never held a piece of lumber, and you're asking for disaster.

AI is a power tool for the mind. It's dangerous for beginners. It's transformative for those who already know how to think.

Our job as educators is to teach them how to think first.

---

*Abdiel Wilson is a software engineer. He's been programming since age 9 and has built projects including Pidgin-Lang, a programming language with Nigerian Pidgin syntax. He occasionally writes about technology, education, and building things from scratch.*

---
