# 🚀 YARC Launcher

The official repository for the YARC launcher (a.k.a., YAL or Yet Another Launcher).

## 📥 Installation

Download the bundle or installer for your platform of choice, run it, and you're good to go! **Some platforms may have some issues, which are listed below.** If your platform is not listed, it should work without a problem.

### Linux

If you are on Linux, you need FUSE to use the `.AppImage` files. If you don't already have it, install it with `sudo apt install libfuse2`.

### SteamOS (Steam Deck)

Using the YARC Launcher on the Steam Deck desktop mode should work fine, however, in the normal mode you may need to add `WEBKIT_DISABLE_COMPOSITING_MODE=1 %command%` to the launch options in the game's properties. See [#42](https://github.com/YARC-Official/YARC-Launcher/issues/42) for more info.

## ⛔ Antivirus Warnings

> [!NOTE]
> If you don't trust us for whatever reason, the source code for the launcher is above, and you can see instructions on how to build the launcher above as well. Apologies for the inconvenience!

The YARC Launcher may get some antivirus warnings from Windows Defender, along with other antiviruses. **This is a false-positive! YARC Launcher is not a virus.** The main reason for this is that we are not certified with Microsoft, which immediately deems the program suspicious in some antiviruses. As this application increases in popularity, some antiviruses may start to trust the launcher more, and in which case, no issues will be found.

<details>
	<summary>If you get the following warning on Windows (click here to view), click on "More info" and then "Run anyway." This alert again happens because Microsoft does not recognize the launcher.</summary>
	
![image](https://github.com/YARC-Official/YARC-Launcher/assets/29520859/196d02ec-1bcf-4a78-a6b6-258fbbf1dab0)
</details>

## 🔨 Building

1. Install cargo from [here](https://www.rust-lang.org/tools/install).
	1. Download `rustup-init.exe` and run it
	2. Enter option 1 (`Proceed with installation (default)`)
	3. If you already had a shell open, you must restart it for the below to work.
2. Install NodeJS from [here](https://nodejs.org/). LTS version should do.
	1. If you already had a shell open, you must restart it for the below to work.
3. Open the command prompt in the directory you want to store the repository.
4. Type in `git clone https://github.com/YARC-Official/YARC-Launcher.git`.
5. Then run `npm install`.
6. You're done! To run, type `npm run dev`.
7. If you want to build an installer, run `npm run build`
	1. You may get a warning saying that an updater key has not been set. This is normal. This just means that a `.sig` file has not been produced (which is fine if you're not releasing it to the public). 

## 🛡️ License

YARC Launcher is licensed under the YARG License - see the [`LICENSE`](../master/LICENSE) file for details. Essentially, you can do whatever you want with any of the code, *except* for YARG (and related) logos. You DO NOT have permission to redistribute any YARG branding.
