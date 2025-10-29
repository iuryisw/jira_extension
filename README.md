# JIRA Sprint Details Display Extension

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-orange)

A browser extension that automatically extracts and displays Sprint Details information near the Quick Filters in JIRA boards, making sprint information easily accessible without manual clicks.

## ✨ Features

- 🚀 **Automatic Display**: Automatically fetches sprint information when you load a JIRA board
- 📍 **Convenient Location**: Places sprint details near the quick filters for easy access
- 🎨 **Clean Design**: Beautiful, modern UI that matches JIRA's aesthetic
- 🔄 **Real-time Updates**: Updates when navigating between boards
- 📱 **Responsive**: Works on different screen sizes
- 🌙 **Dark Mode Support**: Automatically adapts to your system theme
- ⚙️ **Configurable**: Toggle notifications on/off via extension popup

## 📋 What It Shows

The extension displays the following sprint information:

- Sprint name
- Sprint goal
- Days remaining
- Start date
- End date

## 🚀 Installation

### For Microsoft Edge

1. **Download the Extension Files**
   - Clone or download this repository
   - Create a folder on your computer (e.g., `JiraSprintExtension`)
   - Copy all files to this folder

2. **Load Extension in Edge**
   - Open Microsoft Edge
   - Navigate to `edge://extensions/`
   - Enable **Developer mode** (toggle in the bottom-left corner)
   - Click **Load unpacked**
   - Select the folder containing the extension files
   - The extension should now be loaded and active

3. **Test It**
   - Go to your JIRA board (e.g., `https://yourcompany.atlassian.net/jira/software/...`)
   - The sprint details should automatically appear near the quick filters
   - If it doesn't appear immediately, refresh the page

### For Chrome

The installation steps are similar to Edge:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the folder containing the extension files

## 🛠️ Technical Details

### Files Overview

- **`manifest.json`** - Extension configuration and metadata (Manifest V3)
- **`content.js`** - Main logic that extracts and displays sprint information
- **`styles.css`** - Styling for the sprint details display
- **`popup.html`** - Settings page UI
- **`popup.js`** - Settings page logic
- **`icon16.png`, `icon48.png`, `icon128.png`** - Extension icons in various sizes
- **`icon16.svg`, `icon48.svg`, `icon128.svg`** - Vector versions of the icons

### Permissions

The extension requires:
- **`activeTab`** - To interact with the current JIRA page
- **`storage`** - To save user preferences (notification settings)
- **`*://*.atlassian.net/*`** - To access JIRA Cloud instances

### How It Works

1. The extension monitors JIRA board pages for the sprint details button
2. Programmatically clicks the sprint details button to open the popup
3. Extracts sprint information from the popup
4. Creates a custom display element with the sprint data
5. Inserts the element near the quick filters for easy access
6. Monitors for page navigation and updates accordingly

## ⚙️ Configuration

Click the extension icon in your browser toolbar to access settings:

- **Show Notifications**: Toggle debug/status notifications on or off

## 🎨 Customization

You can customize the appearance by editing `styles.css`:

- Change colors in the `background: linear-gradient(...)` property
- Adjust spacing with `padding` and `margin` values
- Modify font sizes in various classes
- Customize dark mode theme (note: there are duplicate dark mode sections at lines 57-66 and 100-109 in the CSS file)

## 🐛 Troubleshooting

### Extension not working?

1. **Check the console**: Right-click on the page → Inspect → Console tab
   - Look for messages starting with "JIRA Sprint Extension:"

2. **Verify permissions**: Make sure the extension has permission to access your JIRA domain
   - Go to your browser's extensions page
   - Click on the extension
   - Check "Site permissions"

3. **Try refreshing**: Sometimes JIRA's dynamic loading requires a page refresh

4. **Check JIRA version**: This extension works with modern JIRA Cloud instances. Some older or self-hosted versions may have different HTML structures.

### Sprint details not appearing?

- Make sure you're on an active sprint board
- Check that the sprint details button exists in JIRA (look for the circular arrow icon)
- The extension needs to click the sprint details button to extract information
- Enable notifications in settings to see debug messages

## 🔒 Privacy

This extension:
- ✅ Runs entirely in your browser
- ✅ Does NOT send data to external servers
- ✅ Only accesses JIRA pages
- ✅ Does NOT store or transmit sprint information (only saves user preferences locally)

## 📝 Version History

**1.0.0** - Initial release
- Sprint details automatic display
- Configurable notifications
- Dark mode support
- Responsive design

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This is an unofficial extension and is not affiliated with or endorsed by Atlassian or JIRA.

## 🙋 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your JIRA version and structure
3. Try disabling and re-enabling the extension
4. Reload the extension after making changes

For detailed installation and troubleshooting instructions, see [jira_sprint_readme.md](jira_sprint_readme.md).
