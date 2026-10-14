---
title: "Claude Code Tips: 10 Settings and Habits I Use Daily"
description: "Ten Claude Code tips I use every day: auto mode setup, a global CLAUDE.md working agreement, critic agents, effort per model, and settings that cut noise."
pubDate: "2026-06-26T00:00:00.000Z"
updatedDate: "2026-10-14T00:00:00.000+08:00"
tags: ["ai"]
image: ../../assets/content/claude-code-tips.jpg
imageAlt: "Claude Code Tips social card with a code editor and actions for explaining, refactoring, and testing code."
---

Claude Code is an agentic coding tool that runs in your terminal. Out of the box it works well, but a few settings and habits make it noticeably better.

This is a running list of tips I keep coming back to.

Each tip carries a star rating from one to five. One star means a nice-to-have polish. Five stars means it changes how the tool feels day to day. Skim by rating if you are short on time.

## 1. Hide attribution in commits and pull requests

**Rating: ★★☆☆☆** — cosmetic, but a one-time fix for a cleaner history.

By default, Claude Code adds a co-author line to commits and a footer to pull requests it creates. On a personal repo or a clean history, you may not want that noise.

Add this to your settings to remove both:

```json
{
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```

The `commit` field controls the trailer appended to commit messages. The `pr` field controls the footer added to pull request descriptions. Setting either to an empty string removes it entirely.

Put this in `~/.claude/settings.json` to apply it everywhere, or in `.claude/settings.json` inside a project to scope it to that repo.

On Claude Code v2.1.281 or later, `"attribution": false` does the same in one line. Older versions reject that value and skip the whole settings file, so keep the two empty strings if you share settings across machines.

Reference: https://code.claude.com/docs/en/settings-reference#attribution

## 2. Opt out of telemetry

**Rating: ★★★☆☆** — set once, privacy for good.

Claude Code sends anonymous usage and error telemetry by default. You can turn it off with environment variables, set directly in your settings file so they apply on every run.

Any one of these disables nonessential traffic:

```json
{
  "env": {
    "DISABLE_TELEMETRY": "1",
    "DO_NOT_TRACK": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

`DISABLE_TELEMETRY` opts out of usage analytics. `DO_NOT_TRACK` is the cross-tool standard signal and Claude Code respects it. `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is the broadest switch: it disables telemetry, automatic updates, release notes, the `/feedback` command, and feature-flag fetching in one flag.

The broad flag does not turn off error reporting. Add `"DISABLE_ERROR_REPORTING": "1"` for that.

Set just the broad flag if you want almost everything off, or pick the narrower ones to keep some traffic. Any non-empty value counts, so `"0"` still opts out. Remove the variable to turn the traffic back on. Put them in `~/.claude/settings.json` for every project, or in a project's `.claude/settings.json` to scope it.

If you would rather not touch settings, set the variable on a shell alias instead:

```bash
alias claude='DISABLE_TELEMETRY=1 claude'
```

Add it to `~/.zshrc` or `~/.bashrc`. Every `claude` you launch then starts with telemetry off, no per-project config needed.

Reference: https://code.claude.com/docs/en/env-vars#variables

## 3. Run multiple accounts side by side

**Rating: ★★★★☆** — a lifesaver if you juggle work and personal subscriptions.

If you keep a personal and a work subscription, you can run both without logging in and out. `CLAUDE_CONFIG_DIR` overrides the configuration directory, which defaults to `~/.claude`. All settings, credentials, session history, and plugins live under that path.

Point each account at its own directory with an alias:

```bash
alias claude-personal='CLAUDE_CONFIG_DIR=~/.claude-personal claude'
alias claude-work='CLAUDE_CONFIG_DIR=~/.claude-work claude'
```

Add these to `~/.zshrc` or `~/.bashrc`. Run `claude-personal` and log in with your personal account, `claude-work` with your work account. Each keeps separate credentials, history, and settings, so you never collide between the two.

This also keeps work session history out of your personal projects, and lets each account carry its own permissions and plugins.

Two caveats. Set `CLAUDE_CONFIG_DIR` in your shell or user settings; Claude Code ignores it in a project's settings. And a Console login without an API key is stored outside the config directory, so this trick does not keep two Console logins apart.

Reference: https://code.claude.com/docs/en/authentication#log-in-with-multiple-accounts

## 4. Start in auto mode by default

**Rating: ★★★★★** — the single biggest upgrade to how Claude Code feels.

Older versions of Claude Code start in a mode that asks permission before every edit and command. Since v2.1.283, terminal and VS Code sessions start in auto mode by default. If yours does not, or you want to pin it, set the default mode in `~/.claude/settings.json`:

```json
{
  "permissions": {
    "defaultMode": "auto"
  }
}
```

Every session then opens in auto mode instead of the prompt-on-each-action mode. Press `Shift+Tab` to cycle modes mid-session: from auto to default, accept edits, and plan.

Auto mode is where Claude Code gets genuinely fun to use. Instead of babysitting a permission prompt on every edit and command, you describe what you want and let the agent run. It reads files, writes code, runs tests, and iterates on failures without stopping to ask each step.

That changes how the work feels. You stay in the planning and reviewing seat instead of the clicking-approve seat. The agent can chase a bug across several files, run the test suite, see it fail, and fix it again before you would have finished approving the first edit. Long multi-step tasks that used to mean a dozen interruptions now happen in one continuous flow.

The tradeoff is control. Auto mode acts without waiting for you, so use it where mistakes are cheap and recoverable: a clean git tree, a branch you can reset, a project under version control. There you get the speed with none of the regret.

This setting only works in user settings (`~/.claude/settings.json`) or managed settings. Claude Code ignores `auto` in a project's `.claude/settings.json`, so a repo cannot switch it on for you. To keep auto mode out of a project you do not trust, press `Shift+Tab` and pick another mode when you open it.

Auto mode needs a recent model, such as Opus 4.6 or Sonnet 4.6 and later on the Anthropic API. On Team and Enterprise plans an admin can turn it off.

Reference: https://code.claude.com/docs/en/permission-modes

## 5. Tell auto mode about your environment

**Rating: ★★★★☆** — auto mode stops guessing what is routine in your setup.

Before each action, auto mode runs a classifier that decides whether the action is safe or needs your approval. Out of the box it knows nothing about your setup: which repos are yours, which branch deploys, which remote is public.

`autoMode.environment` tells it. Each entry is a plain-English sentence:

```json
{
  "autoMode": {
    "environment": [
      "$defaults",
      "Repos under ~/code are mine. Editing, testing, and committing there is routine.",
      "github.com/you/blog is public. Any push there publishes it.",
      "main and release/* are protected. Never push to them directly.",
      "Treat any host, branch, or database with prod in its name as production."
    ]
  }
}
```

Keep `"$defaults"` in the list. Without it, your entries replace the built-in ones instead of adding to them.

You do not have to write the list by hand. Run `/auto-mode-setup` and Claude drafts entries from your project and recent sessions, then writes them to `~/.claude/settings.json` once you accept. That is how I made mine. The command needs a Pro, Max, or Team plan.

Like `defaultMode`, `autoMode` only works in user or managed settings. Claude Code ignores it in a project's `.claude/settings.json`.

Reference: https://code.claude.com/docs/en/auto-mode-config

## 6. Write a working agreement in your global CLAUDE.md

**Rating: ★★★★★** — the tip that saves me the most typing.

`~/.claude/CLAUDE.md` loads into every session in every project. Most people keep build commands and code style in project memory files. I use the global file for how I want Claude to work with me: how to report, when to stop and ask, and what "done" means.

Mine grew from corrections. Each time I told Claude the same thing twice, it became a rule. A few of them:

```markdown
## Working agreements

- Briefly restate your understanding of my goal and the problem before starting work.
- Report to me in ASD-STE100 Simplified Technical English.
- When implementation is complete and relevant local checks pass, push the branch and create or update the PR.
- Work autonomously whenever possible, and when my input or action is needed, provide a concise executive summary with sufficient context, a clear recommendation, and key trade-offs so I can make an informed decision quickly.
```

The last rule does the most work. When Claude needs decisions, it numbers them and recommends an answer for each. My reply is often three words: "follow your rec". Or "1. yes 2. skip 3. follow your rec". I have typed some form of that dozens of times.

ASD-STE100 is the controlled English written for aircraft maintenance manuals: short sentences, one instruction per sentence, active voice. Asking for it keeps reports short and easy to scan.

The full file is in [this gist](https://gist.github.com/jewei/ba227fbc180041a733c5d3e67d018437). Copy it and change the rules to fit how you work. Inside a repo, Claude Code also reads `AGENTS.md`, so one file of project rules can serve Claude and Codex.

Reference: https://code.claude.com/docs/en/memory

## 7. Review with independent critic agents

**Rating: ★★★★☆** — catches the mistakes the author cannot see.

When Claude reviews its own work in the same session, it brings the same assumptions that produced the mistakes. A fresh subagent starts without them. For work that matters, I end the prompt with:

> Use independent critic agents to review the work. Continue until they find no more problems.

Claude briefs a few reviewer subagents, fixes the valid findings, then starts new reviewers for the next round. It stops when a round finds only nitpicks. My global CLAUDE.md asks it to report the number of rounds and the findings it rejected, so I can check its judgement.

One gotcha: tell the critics to read files from disk. Mine once quoted an old version of `AGENTS.md` from their context instead of the current file.

Reference: https://code.claude.com/docs/en/sub-agents

## 8. Set effort per model

**Rating: ★★★☆☆** — the right amount of thinking without touching `/effort` every session.

Effort controls how much Claude thinks before it acts: `low`, `medium`, `high`, or `xhigh`. High effort helps on hard problems. On easy ones it is slower and costs more.

`effortLevel` sets a default, but a top-level `effortLevel` does not apply to Opus 5.5. Set effort per model with `modelSettings` (v2.1.288 or later):

```json
{
  "model": "opus",
  "effortLevel": "high",
  "modelSettings": {
    "claude-opus-5-5": {
      "effortLevel": "medium"
    }
  }
}
```

My personal account runs Opus 5.5 at medium. My work account runs it at xhigh.

I still switch by hand when a task needs it. `/model` opens the model picker. `/effort xhigh` raises effort: press Enter to save it as the default, or `s` to keep it for this session only.

Reference: https://code.claude.com/docs/en/model-config#adjust-effort-level

## 9. Deny the MCP servers you do not use

**Rating: ★★★☆☆** — fewer tools in Claude's way.

Claude Code picks up MCP servers from several places: your claude.ai connectors (Gmail, Calendar, Drive), plugins, and project `.mcp.json` files. Each one adds tools Claude can call. I wanted only the ones I use.

`deniedMcpServers` blocks servers by name:

```json
{
  "deniedMcpServers": [
    { "serverName": "claude.ai Gmail" },
    { "serverName": "claude.ai Google Calendar" },
    { "serverName": "computer-use" }
  ]
}
```

Run `/mcp` to see the exact names. Turning a server off in `/mcp` only affects the current project. The deny list in `~/.claude/settings.json` applies everywhere.

Reference: https://code.claude.com/docs/en/settings-reference#deniedmcpservers

## 10. Hand off long tasks to a fresh session

**Rating: ★★★☆☆** — long tasks survive full context windows and rate limits.

Long tasks hit limits. The context window fills up, or the account reaches its rate limit. I do not start over.

The first option is a handoff note. Ask Claude to write one: the goal, what is done, what is left, the decisions made, and the branch. Paste it into a new session. A fresh session with a good handoff often works better than a long one full of old tool output.

The second option is to continue on your other account. Claude Code stores each session as a JSONL file under `<config dir>/projects/<project>/`, where `<project>` is the working directory with every character that is not a letter or number replaced by `-`. With two account aliases like the ones in tip 3, the second account can resume a session from the first by the absolute path of its transcript:

```bash
claude-account-two --resume ~/.claude-account-one/projects/PROJECT/SESSION_ID.jsonl
```

The transcript format is internal and can change between versions, so treat this as a convenience, not a backup.

Reference: https://code.claude.com/docs/en/sessions#resume-a-session

## More tips coming

I will keep adding to this list as I find settings and workflows worth sharing.
