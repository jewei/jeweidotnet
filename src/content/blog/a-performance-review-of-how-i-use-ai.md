---
title: "A performance review of how I use AI"
description: "What I do well with AI coding agents, where my habits cause problems, and what I want to change. A personal review based on two assessments of my chat history."
pubDate: "2026-09-05T00:00:00.000Z"
tags: ["ai"]
---

I asked two AI models to review my local conversation histories and assess how I use AI. Not which model I should use or which prompt gets the best answer. I wanted a performance review: what am I good at, where do I fall short, and how can I improve?

The reviews covered different sets of readable conversations. Neither had a complete record of my work. These are observations about my recorded AI use, not a measure of my coding ability or business results.

Both pointed to a similar gap: **I am better at judging a result than defining the limits of the work before it starts.**

I bring evidence, catch mistakes, and keep pushing toward a working result. But I can also let planning run too long, add requirements during implementation, and give the agent too much room to decide what comes next.

Here is what I take from the reviews.

## What I do well

- **I bring evidence, not just complaints.** Screenshots, stack traces, failing commands, CI logs, and real-device behavior give the agent something it can check. My strongest sessions start with an observed problem and a concrete artifact, rather than “something is broken.”

- **I understand the business rules behind the code.** In payment reporting work, I caught the agent confusing a payment channel with the actual provider. I could point it to the data needed to answer the right question. Code that runs successfully can still produce the wrong report.

- **I can make requirements precise.** In survey work, I specified which purchase timestamp counts, which orders qualify, how participation limits work, and how to select the latest survey. These details determine whether a feature is correct. They are not decisions I should leave to the model.

- **I check the result and challenge weak answers.** I test in the app, return with specific corrections, and reject recommendations that do not fit. In database work, I used a separate review to check whether regression tests actually detected the old behavior. I do not have to accept “tests pass” as the end of the discussion.

- **I follow through.** I use AI for more than suggestions or a first draft. I take work through implementation, testing, review, and release. I also move between application code, databases, infrastructure, and product decisions when the task requires it.

## Where I fall short

These are habits I can change, not fixed traits.

- **I let the meaning of “done” grow.** A short “what’s next?” can invite another round of improvements without asking whether the current release needs them. The agent can always suggest more useful work. That does not make it necessary work.

- **I allow planning to continue after it stops helping.** One redesign conversation reached question 508. Later answers were often just “A,” which was also the agent’s recommended option. The agent should not have produced such a long process, but I could have stopped it and asked for something usable much earlier.

- **I state constraints too late.** I have had to remind an agent that an MVP is a small project maintained by one person, not a company with several teams. I have also stopped work because it was taking too much time and too many tokens. Those limits belong at the start, before they become corrections.

- **I rely too much on context staying intact.** “Proceed,” “fix it,” and “commit and push” are efficient when the task is fresh. After a long session, a summary, or an agent handoff, they can approve assumptions I no longer share. Short instructions are not the problem. Missing decisions are.

- **I do not consistently check the full production path.** In one permission incident, tests created records that deployment did not create. The feature passed in the test environment but failed in production. I checked a related repository after the fix, but that check would have been more useful before release.

- **I can turn AI tooling into another project.** Skills, agent coordination, usage tools, and configuration all interest me. Each addition can seem useful on its own. I need to check whether the whole setup saves more work than it creates.

## How I can get better

- **Define one usable result before delegating.** State who it is for, what they must be able to do, and the observable checks that mean it is complete. List what is excluded. Add the time, cost, and maintenance limits. A small edit does not need a long brief; a substantial task needs a clear boundary.

- **Ask for a working result sooner.** Start with at most three blocking questions, then ask for a small implementation or prototype. Use reasonable defaults for reversible details. If a decision is still unsafe, name the blocker rather than continuing an open-ended questionnaire.

- **Give research a decision and a budget.** Say what question it must resolve and how much time it can take. End with a recommendation, its main tradeoff, and any missing evidence. Reopen the question when new evidence matters, not because another comparison is possible.

- **Check how the change reaches production.** For relevant changes, inspect migrations, required records, caches, queues, deployment steps, and related implementations. Ask whether test setup supplies anything deployment omits. For a bug fix, require evidence that the regression test fails with the old behavior and passes with the fix.

- **Keep independent review focused.** Give a separate reviewer the original requirement, completion checks, and diff. Require evidence for defects and separate release blockers from optional improvements. After a fix, check the finding and affected behavior instead of automatically starting another general audit. A second model is another check, not proof.

- **Make authority and handoffs explicit.** Separate permission to edit locally from permission to change production, deploy, commit, or push. When the task changes or the session gets long, carry forward the current goal, decisions, changed files, checks, and remaining work. Check the handoff before trusting it.

- **Measure the tools and test the value.** Compare similar tasks by time to a correct result, corrections needed, defects found later, and cost. Once a usable flow exists, watch intended users try it without help. The reviews saw more engineering validation than customer validation, but that may reflect what the logs contain. It is a gap to check, not a conclusion to assume.

## My main goal

I do not need to make every prompt longer. I need to make the important decisions earlier: what I want, what can wait, what the agent may do, and what evidence will show that the work is complete.

I want to keep the habits that help me move quickly: concrete evidence, specific corrections, and testing real results. The improvement is to put clearer limits around that work.

Before I ask “what’s next?”, I want to ask:

> Which remaining task is required for this release, and what evidence makes it required?

If the completion checks pass, the next step can be to stop.
