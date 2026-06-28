---
title: "Claude Code Tips"
description: "A growing list of practical tips for developers running Claude Code day to day. Small settings and habits that make the agent faster, cleaner, and less noisy."
pubDate: "2026-06-26T00:00:00.000Z"
tags: ["ai"]
image: ../../assets/content/claude-code-tips.jpg
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

Reference: https://code.claude.com/docs/en/settings#attribution-settings

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

`DISABLE_TELEMETRY` opts out of usage analytics. `DO_NOT_TRACK` is the cross-tool standard signal and Claude Code respects it. `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is the broadest switch: it disables telemetry, error reporting, and automatic update checks in one flag.

Set just the broad flag if you want everything off, or pick the narrower ones to keep some traffic. Put them in `~/.claude/settings.json` for every project, or in a project's `.claude/settings.json` to scope it.

If you would rather not touch settings, set the variable on a shell alias instead:

```bash
alias claude='DISABLE_TELEMETRY=1 claude'
```

Add it to `~/.zshrc` or `~/.bashrc`. Every `claude` you launch then starts with telemetry off, no per-project config needed.

Reference: https://code.claude.com/docs/en/settings#environment-variables

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

Reference: https://code.claude.com/docs/en/settings#environment-variables

## 4. Start in auto mode by default

**Rating: ★★★★★** — the single biggest upgrade to how Claude Code feels.

Claude Code starts in a mode that asks permission before edits and commands. If you trust the agent in a given project and want fewer interruptions, set the default mode to `auto`:

```json
{
  "permissions" : {
    "defaultMode" : "auto"
  },
}
```

Every session in that scope then opens in auto mode instead of the standard prompt-on-each-action mode. You can still switch modes mid-session.

Auto mode is where Claude Code gets genuinely fun to use. Instead of babysitting a permission prompt on every edit and command, you describe what you want and let the agent run. It reads files, writes code, runs tests, and iterates on failures without stopping to ask each step.

That changes how the work feels. You stay in the planning and reviewing seat instead of the clicking-approve seat. The agent can chase a bug across several files, run the test suite, see it fail, and fix it again before you would have finished approving the first edit. Long multi-step tasks that used to mean a dozen interruptions now happen in one continuous flow.

The tradeoff is control. Auto mode acts without waiting for you, so use it where mistakes are cheap and recoverable: a clean git tree, a branch you can reset, a project under version control. There you get the speed with none of the regret.

Put it in a project's `.claude/settings.json` to auto-run only where you trust it, or in `~/.claude/settings.json` to make it global. Scope it to projects you trust rather than turning it on everywhere.

Reference: https://code.claude.com/docs/en/settings#available-settings

## More tips coming

I will keep adding to this list as I find settings and workflows worth sharing.
