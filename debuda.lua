-- ROBLOX ONLY: do nothing if this is not running inside Roblox.
if not (game and game.GetService) then return end

--[[
    DEBUDA ALPHA - VISUAL UI ONLY
    Roblox LocalScript / visual prototype.
    This script creates an interface only. It does not modify gameplay,
    access player data, grant levels, process purchases, or load remote code.
]]

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
if not player then
    warn("[Debuda] Run this from a client-side LocalScript in your own Roblox experience.")
    return
end

local playerGui = player:WaitForChild("PlayerGui")
local old = playerGui:FindFirstChild("DebudaAlpha")
if old then old:Destroy() end

local PURPLE = Color3.fromRGB(151, 91, 255)
local PURPLE_DARK = Color3.fromRGB(75, 42, 130)
local BG = Color3.fromRGB(13, 12, 20)
local PANEL = Color3.fromRGB(23, 20, 34)
local PANEL_HOVER = Color3.fromRGB(37, 30, 54)
local WHITE = Color3.fromRGB(245, 241, 255)
local MUTED = Color3.fromRGB(157, 148, 177)

local gui = Instance.new("ScreenGui")
gui.Name = "DebudaAlpha"
gui.ResetOnSpawn = false
gui.IgnoreGuiInset = true
gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
gui.Parent = playerGui

local function make(className, props, parent)
    local obj = Instance.new(className)
    for key, value in pairs(props) do obj[key] = value end
    obj.Parent = parent
    return obj
end

local function corner(parent, radius)
    make("UICorner", {CornerRadius = UDim.new(0, radius or 10)}, parent)
end

local function stroke(parent, color, transparency)
    make("UIStroke", {
        Color = color or PURPLE,
        Transparency = transparency or 0.65,
        Thickness = 1
    }, parent)
end

local function label(parent, text, size, position, font, color)
    return make("TextLabel", {
        BackgroundTransparency = 1,
        Text = text,
        TextColor3 = color or WHITE,
        TextSize = size,
        Font = font or Enum.Font.Gotham,
        TextXAlignment = Enum.TextXAlignment.Left,
        Position = position,
        Size = UDim2.new(1, 0, 0, size + 8)
    }, parent)
end

local main = make("Frame", {
    Name = "Main",
    AnchorPoint = Vector2.new(0.5, 0.5),
    Position = UDim2.fromScale(0.5, 0.5),
    Size = UDim2.fromOffset(720, 465),
    BackgroundColor3 = BG,
    BorderSizePixel = 0
}, gui)
corner(main, 15)
stroke(main, PURPLE, 0.35)

local scale = make("UIScale", {Scale = 1}, main)
local function updateScale()
    local camera = workspace.CurrentCamera
    if not camera then return end
    local viewport = camera.ViewportSize
    scale.Scale = math.min(1, viewport.X / 760, viewport.Y / 520)
end
updateScale()
if workspace.CurrentCamera then
    workspace.CurrentCamera:GetPropertyChangedSignal("ViewportSize"):Connect(updateScale)
end

local top = make("Frame", {
    Size = UDim2.new(1, 0, 0, 58),
    BackgroundColor3 = Color3.fromRGB(19, 16, 29),
    BorderSizePixel = 0
}, main)
corner(top, 15)
make("Frame", {
    Position = UDim2.new(0, 0, 1, -14),
    Size = UDim2.new(1, 0, 0, 14),
    BackgroundColor3 = Color3.fromRGB(19, 16, 29),
    BorderSizePixel = 0
}, top)

local logo = make("Frame", {
    Position = UDim2.fromOffset(17, 11),
    Size = UDim2.fromOffset(36, 36),
    BackgroundColor3 = PURPLE_DARK,
    BorderSizePixel = 0
}, top)
corner(logo, 10)
label(logo, "D", 24, UDim2.fromOffset(0, 2), Enum.Font.GothamBlack, WHITE).TextXAlignment = Enum.TextXAlignment.Center

local brand = label(top, "DEBUDA", 16, UDim2.fromOffset(63, 10), Enum.Font.GothamBold, WHITE)
brand.Size = UDim2.fromOffset(110, 20)
local alpha = label(top, "ALPHA", 9, UDim2.fromOffset(64, 31), Enum.Font.GothamBold, PURPLE)
alpha.Size = UDim2.fromOffset(70, 15)

local close = make("TextButton", {
    Text = "×",
    Font = Enum.Font.Gotham,
    TextSize = 26,
    TextColor3 = MUTED,
    BackgroundTransparency = 1,
    AnchorPoint = Vector2.new(1, 0.5),
    Position = UDim2.new(1, -13, 0.5, 0),
    Size = UDim2.fromOffset(34, 34)
}, top)
close.MouseButton1Click:Connect(function() gui:Destroy() end)

local sidebar = make("Frame", {
    Position = UDim2.fromOffset(14, 72),
    Size = UDim2.fromOffset(158, 378),
    BackgroundColor3 = PANEL,
    BorderSizePixel = 0
}, main)
corner(sidebar, 11)

label(sidebar, "MAIN MENU", 9, UDim2.fromOffset(13, 13), Enum.Font.GothamBold, MUTED)
local navHolder = make("Frame", {
    Position = UDim2.fromOffset(8, 39),
    Size = UDim2.new(1, -16, 0, 220),
    BackgroundTransparency = 1
}, sidebar)
make("UIListLayout", {Padding = UDim.new(0, 7), SortOrder = Enum.SortOrder.LayoutOrder}, navHolder)

local content = make("Frame", {
    Position = UDim2.fromOffset(186, 75),
    Size = UDim2.new(1, -202, 1, -92),
    BackgroundTransparency = 1
}, main)

local pages = {}
local function newPage(name)
    local page = make("Frame", {
        Name = name,
        Size = UDim2.fromScale(1, 1),
        BackgroundTransparency = 1,
        Visible = false
    }, content)
    pages[name] = page
    return page
end

local function makeButton(parent, text, position, size, primary)
    local button = make("TextButton", {
        Text = text,
        Position = position,
        Size = size,
        BackgroundColor3 = primary and PURPLE_DARK or PANEL,
        TextColor3 = WHITE,
        Font = Enum.Font.GothamSemibold,
        TextSize = 12,
        AutoButtonColor = false,
        BorderSizePixel = 0
    }, parent)
    corner(button, 8)
    if primary then stroke(button, PURPLE, 0.3) end
    button.MouseEnter:Connect(function()
        TweenService:Create(button, TweenInfo.new(0.15), {
            BackgroundColor3 = primary and PURPLE or PANEL_HOVER
        }):Play()
    end)
    button.MouseLeave:Connect(function()
        TweenService:Create(button, TweenInfo.new(0.15), {
            BackgroundColor3 = primary and PURPLE_DARK or PANEL
        }):Play()
    end)
    return button
end

local function showPage(name)
    for pageName, page in pairs(pages) do page.Visible = pageName == name end
    for _, child in ipairs(navHolder:GetChildren()) do
        if child:IsA("TextButton") then
            child.BackgroundColor3 = child.Name == name and PURPLE_DARK or PANEL
            child.TextColor3 = child.Name == name and WHITE or MUTED
        end
    end
end

local function nav(name, order)
    local button = makeButton(navHolder, "   " .. name, UDim2.new(), UDim2.new(1, 0, 0, 36), false)
    button.Name = name
    button.TextXAlignment = Enum.TextXAlignment.Left
    button.LayoutOrder = order
    button.MouseButton1Click:Connect(function() showPage(name) end)
end

nav("Home", 1)
nav("Profile", 2)
nav("Games", 3)
nav("Debuda Alpha", 4)
nav("Settings", 5)

local home = newPage("Home")
label(home, "HI, WELCOME TO DEBUDA", 23, UDim2.fromOffset(3, 8), Enum.Font.GothamBlack, WHITE)
label(home, "Your visual gaming dashboard.", 12, UDim2.fromOffset(4, 43), Enum.Font.Gotham, MUTED)

local welcomeCard = make("Frame", {
    Position = UDim2.fromOffset(0, 83),
    Size = UDim2.new(1, 0, 0, 145),
    BackgroundColor3 = Color3.fromRGB(34, 22, 54),
    BorderSizePixel = 0
}, home)
corner(welcomeCard, 12)
stroke(welcomeCard, PURPLE, 0.55)
label(welcomeCard, "WELCOME TO THE", 10, UDim2.fromOffset(18, 20), Enum.Font.GothamBold, MUTED)
label(welcomeCard, "DEBUDA PLAYGROUND", 22, UDim2.fromOffset(18, 43), Enum.Font.GothamBlack, WHITE)
label(welcomeCard, "Explore the interface and customize your space.", 11, UDim2.fromOffset(18, 80), Enum.Font.Gotham, MUTED)
local homeShop = makeButton(welcomeCard, "Explore Alpha  →", UDim2.fromOffset(18, 108), UDim2.fromOffset(145, 28), true)
homeShop.MouseButton1Click:Connect(function() showPage("Debuda Alpha") end)

local profile = newPage("Profile")
label(profile, "YOUR PROFILE", 22, UDim2.fromOffset(3, 8), Enum.Font.GothamBlack)
label(profile, "A local visual profile preview.", 12, UDim2.fromOffset(4, 42), Enum.Font.Gotham, MUTED)
local profileCard = make("Frame", {
    Position = UDim2.fromOffset(0, 78),
    Size = UDim2.new(1, 0, 0, 175),
    BackgroundColor3 = PANEL,
    BorderSizePixel = 0
}, profile)
corner(profileCard, 11)
local avatar = make("Frame", {
    Position = UDim2.fromOffset(18, 18),
    Size = UDim2.fromOffset(54, 54),
    BackgroundColor3 = PURPLE_DARK,
    BorderSizePixel = 0
}, profileCard)
corner(avatar, 14)
label(avatar, string.sub(player.DisplayName, 1, 1):upper(), 25, UDim2.fromOffset(0, 9), Enum.Font.GothamBlack).TextXAlignment = Enum.TextXAlignment.Center
label(profileCard, player.DisplayName, 16, UDim2.fromOffset(86, 20), Enum.Font.GothamBold)
label(profileCard, "@" .. player.Name, 11, UDim2.fromOffset(87, 45), Enum.Font.Gotham, MUTED)
label(profileCard, "LEVEL 1  •  BEGINNER", 11, UDim2.fromOffset(18, 91), Enum.Font.GothamBold, PURPLE)
label(profileCard, "XP display is a visual placeholder", 10, UDim2.fromOffset(18, 119), Enum.Font.Gotham, MUTED)
local xpBack = make("Frame", {Position = UDim2.fromOffset(18, 148), Size = UDim2.new(1, -36, 0, 8), BackgroundColor3 = Color3.fromRGB(48, 42, 61), BorderSizePixel = 0}, profileCard)
corner(xpBack, 5)
local xpFill = make("Frame", {Size = UDim2.new(0.25, 0, 1, 0), BackgroundColor3 = PURPLE, BorderSizePixel = 0}, xpBack)
corner(xpFill, 5)

local gamesPage = newPage("Games")
label(gamesPage, "GAME COLLECTION", 22, UDim2.fromOffset(3, 8), Enum.Font.GothamBlack)
label(gamesPage, "Supported games (visual cards only).", 12, UDim2.fromOffset(4, 42), Enum.Font.Gotham, MUTED)
local gameNames = {"Murder Mystery 2", "Deagle Duels", "Da Hood"}
for i, gameName in ipairs(gameNames) do
    local y = 78 + (i - 1) * 76
    local card = make("Frame", {Position = UDim2.fromOffset(0, y), Size = UDim2.new(1, 0, 0, 62), BackgroundColor3 = PANEL, BorderSizePixel = 0}, gamesPage)
    corner(card, 9)
    label(card, gameName, 14, UDim2.fromOffset(15, 9), Enum.Font.GothamBold)
    label(card, "Supported Roblox game", 10, UDim2.fromOffset(15, 33), Enum.Font.Gotham, MUTED)
    local view = makeButton(card, "VIEW", UDim2.new(1, -75, 0.5, -13), UDim2.fromOffset(60, 26), false)
    view.MouseButton1Click:Connect(function()
        local oldText = view.Text
        view.Text = "SOON"
        task.delay(1.2, function() if view.Parent then view.Text = oldText end end)
    end)
end

local shop = newPage("Debuda Alpha")
label(shop, "DEBUDA ALPHA", 22, UDim2.fromOffset(3, 8), Enum.Font.GothamBlack)
label(shop, "Choose a plan preview.", 12, UDim2.fromOffset(4, 42), Enum.Font.Gotham, MUTED)
local selectedPlan = "Month"
local plans = {"Day", "Week", "Month", "Year", "Lifetime"}
local planButtons = {}
for i, planName in ipairs(plans) do
    local col = (i - 1) % 3
    local row = math.floor((i - 1) / 3)
    local button = makeButton(shop, planName, UDim2.fromOffset(col * 145, 80 + row * 48), UDim2.fromOffset(132, 36), planName == selectedPlan)
    planButtons[planName] = button
    button.MouseButton1Click:Connect(function()
        selectedPlan = planName
        for name, b in pairs(planButtons) do b.BackgroundColor3 = name == selectedPlan and PURPLE_DARK or PANEL end
    end)
end
local planInfo = make("Frame", {Position = UDim2.fromOffset(0, 185), Size = UDim2.new(1, 0, 0, 105), BackgroundColor3 = PANEL, BorderSizePixel = 0}, shop)
corner(planInfo, 10)
label(planInfo, "SELECTED PLAN", 9, UDim2.fromOffset(15, 12), Enum.Font.GothamBold, MUTED)
local selectedLabel = label(planInfo, selectedPlan, 18, UDim2.fromOffset(15, 34), Enum.Font.GothamBold, WHITE)
local preview = makeButton(shop, "Preview selection", UDim2.fromOffset(0, 305), UDim2.fromOffset(160, 36), true)
preview.MouseButton1Click:Connect(function()
    selectedLabel.Text = selectedPlan
    preview.Text = "Preview: " .. selectedPlan
end)
label(shop, "DEMO ONLY • NO PAYMENTS OR PURCHASES", 9, UDim2.fromOffset(0, 350), Enum.Font.GothamBold, MUTED)

local settings = newPage("Settings")
label(settings, "SETTINGS", 22, UDim2.fromOffset(3, 8), Enum.Font.GothamBlack)
label(settings, "Simple visual preferences.", 12, UDim2.fromOffset(4, 42), Enum.Font.Gotham, MUTED)
local toggle = makeButton(settings, "Hide / show Debuda UI", UDim2.fromOffset(0, 82), UDim2.fromOffset(190, 38), true)
toggle.MouseButton1Click:Connect(function()
    main.Visible = false
    local reopen = makeButton(gui, "OPEN DEBUDA", UDim2.new(0, 20, 0.5, -20), UDim2.fromOffset(130, 40), true)
    reopen.MouseButton1Click:Connect(function()
        main.Visible = true
        reopen:Destroy()
    end)
end)

-- Drag the window using its top bar.
local dragging, dragStart, startPos
top.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
        dragging = true
        dragStart = input.Position
        startPos = main.Position
    end
end)
top.InputEnded:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
        dragging = false
    end
end)
UserInputService.InputChanged:Connect(function(input)
    if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
        local delta = input.Position - dragStart
        main.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
    end
end)

showPage("Home")
main.BackgroundTransparency = 1
TweenService:Create(main, TweenInfo.new(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {BackgroundTransparency = 0}):Play()
print("[Debuda] Visual interface loaded.")
