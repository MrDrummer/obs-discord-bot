# Purpose
This bot is designed to run on a server, next to OBS. This is ideal for situations where you're streaming remote and send the camera feed to the server, which then processes the output to the streaming platform. Designed for use with Windows, but no reason this code wouldn't work on linux/mac. Verify OBS & obs-websocket work first though!
# Installation
## Set up
1. Install [obs-websocket](https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/) (seems to only work on OBS version 27 or greater).
2. Clone this repo with git: `https://github.com/MrDrummer/obs-discord-bot.git`
3. Assuming you don't already have node.js installed, download and install [NVM For Windows](https://github.com/coreybutler/nvm-windows). This allows easy switching between node.js versions. It must be Node 16 or greater.
4. Open a command prompt, run `nvm install 16.7.0` and then `nvm use 16.7.0`. Validate it switched with `node -v` and it should respond with `16.7.0` (cmd prompt restart may be needed?)
5. Run `npm install -g yarn typescript pm2 cpy-cli`
6. Go to `src`, copy `config-template.json` to `config.json`. Edit the values.
7. Navigate to the root of this repo within command prompt and run `yarn`. This will install all packages required to run this bot.
8. `yarn start` will build and then start the bot with pm2. It will restart if it is already running.

## Bot Setup
You of course need to create an application under your Discord account, set it as a bot, and then invite it to your discord server.

There is more to it than a normal bot, since it utilises slash commands. [This guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html) helps perfectly.
## pm2
PM2 is the tool used to keep the bot running even when there is no active connection. Basically treats the bot like a service.

If you need to restart the bot then from a terminal run `pm2 restart bot`, to get logs `pm2 logs bot`. More information can be found on their [wiki](https://pm2.keymetrics.io/docs/usage/process-management/).

You can safely exit the command prompt and the bot will continue to run. Running `pm2 list` will list the processes running. If `bot` isn't listed, then it isn't running (see set up step 7.)

## Server restarts
If the server is restarted for whatever reason, you'll need to go to the location of this repo and follow step 7.

## Bot updates
If there is an update to the bot
1. Run a `git pull` in the repo directory
2. Follow steps 6 & 7.

# Terminology
- scenes - same as OBS - a template that includes many sources
- source - same as OBS - this could be a camera feed, text, audio etc.
- slot - The name for a camera feed in a layout with multiple camera feeds. See the OBS configuration section for more.
- layout - the type of template - e.g. one with 2 camera feeds. See the OBS configuration section for more.
- feed - like source, but strictly references the raw camera feed, in a fullscreen or slot scenario.

# OBS Configuration
For the purpose of demonstration, say we have 2 camera feeds: `FeedA` and `FeedB`. Both are able to be fullscreen, but we also have a 50/50 layout. This layout uses `SlotA` and `SlotB`.
## Basics
- You need a scene for each of the single full-screen perspectives

**If you have layouts:**
- You need a scene for each of the slots. If you have a layout that has max 5 sources in one screen, then you need 5 slots.
- You need a scene for each layout, where the sources are the slot scenes


Given the example, you would have a Scene for `FeedA` and `FeedB`, a Scene for `SlotA` and `SlotB` and a Scene called Split that includes `SlotA` and `SlotB` as sources.
## Theory
OBS smooth transitions work between top level scenes, but not when switching sub-scenes. This means that if we have a layout in a 2x2 of configuration, and switch one of the slots to a different source, it's a hard cut. That's why we need a top level scene for each of the full screen sources, so that you can cut from a layout to a fullscreen, change the slots, and then switch back.

The beauty of this script is that the choice is yours. You could have a fullscreen layout utilising a main slot and it'll work.

## How it works
When switching a slot, the software essentially controls which sources are hidden. It'll hide all of the other sources under the selected slot other than the one you're showing.

# Bot Configuration
After cloning, copy & rename the `config-template.yaml` to `config.yaml`. Do the same for `config-template.json` to `config.json`. These two files are gitignored.

The templates contains all of the information you need to know for what the keys are for. But essentially:
- secrets.json contains your Discord bot token, as well as Discord Guild/Channel IDs for various features and some metadata that helps identify which bot is running, should you have multiple bot instances.
- config.yaml contains preset information for your OBS scenes.

## Example Configuration
A configuration for the previously mentioned example would look like
```yaml
sources:
  - arg: feeda
    scene: SceneA
    source: FeedA_Raw
    desc: Camera Feed A
  - arg: feedb
    scene: SceneB
    source: FeedB_Raw
    desc: Camera Feed B
layouts:
  - arg: split
    scene: Split
    desc: "A 50/50 split utilising SlotA and SlotB."
    slots:
      - slota
      - slotb
slots:
  slota: SlotA
  slotb: SlotB
```
sources/layouts
- `arg`: the key that gets entered when you enter the command in Discord. Lowercase. One word.
- `scene`: The name of the source's fullscreen scene.
- `desc` is the description that shows up in the Discord slash command.

sources
- `source`: The name of the source - for toggling within slots.

layouts
- `slots`: List of pre-configured slots that the layout shows.


# Usage
When the script is running, you will see the bot as online in the server list.

The bot utilises slash commands, so as long as the user has the related slash command permissions, they are able to interact with the bot.

## Commands
- `/sc` - Switches a scene. Second argument is the display name of the scene and layouts, as defined in the config.
- `/slot` - Changes the source a slot is assigned to.

## Example usage

/sc is used to switch between scenes. Each source and layout are available to be selected as a quick execution.

Scenario: We're looking at Fullscreen `FeedA`, and wish to switch to a 50/50 split. Assume that `SlotA` and `SlotB` are on different feeds.

/slot scene:split slota:feeda slotb:feedb

This would switch slots A and B to their related feeds and then switch to that layout. As explained earlier, this to help avoid hard cuts. `SlotA` on the left would be `FeedA` and `SlotB` on the right would be `FeedB`.

Now say we were look at Split, and wanted to switch back to a fullscreen shot while also flipping the feeds. That would look like:

/slot scene:feeda slota:feedb slotb:feeda

This would switch to `FeedA` and then switch the slots around. `SlotA` on the left would be `FeedB` and `SlotB` on the right would be `FeedA`.
