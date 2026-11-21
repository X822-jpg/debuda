DEBUDA ALPHA - VISUAL-ONLY LUA FILE

Files:
- debuda.lua: visual-only Roblox UI prototype.
- debuda.lua: copy intended to be served as a static raw file by Vercel.

For a normal Roblox Studio experience:
1. Create a LocalScript under StarterPlayer > StarterPlayerScripts.
2. Paste the contents of debuda.lua into it.
3. Press Play to preview the interface.

This script is a UI prototype only. The profile level and XP are placeholders.
The shop only previews plan selection; it does not process payments.
No external code is downloaded or executed.

Vercel:
Deploy the folder as a static project. The debuda.lua file will be served
at /debuda.lua on the deployed domain. This is a raw text file, not a payment
system or Roblox executor. For a production Roblox game, keep UI code in your
own experience and use trusted RemoteEvents/server-side validation for real data.

Supported games shown in the UI: Murder Mystery 2, Deagle Duels, Da Hood. The script stays a visual-only menu.
