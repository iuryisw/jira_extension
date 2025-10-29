# JIRA Sprint Details Display Extension

A Microsoft Edge browser extension that automatically extracts and displays Sprint Details information near the Quick Filters in JIRA boards.

## Features

- 🚀 **Automatic Display**: Automatically fetches sprint information when you load a JIRA board
- 📍 **Convenient Location**: Places sprint details near the quick filters for easy access
- 🎨 **Clean Design**: Beautiful, modern UI that matches JIRA's aesthetic
- 🔄 **Real-time Updates**: Updates when navigating between boards
- 📱 **Responsive**: Works on different screen sizes

## What It Shows

- Sprint name
- Sprint goal
- Days remaining
- Start date
- End date

## Installation

### Step 1: Download the Files

Create a new folder on your computer (e.g., `JiraSprintExtension`) and save these files:

1. `manifest.json` - Extension configuration
2. `content.js` - Main logic
3. `styles.css` - Styling
4. Create placeholder icon files (or use your own):
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

### Step 2: Create Icons (Optional)

You can create simple icon images or use any sprint/JIRA-related icon. If you don't have icons, you can create simple colored squares as placeholders:

- Open Paint or any image editor
- Create images with the sizes mentioned above
- Save them with the correct names

### Step 3: Load Extension in Edge

1. Open Microsoft Edge
2. Navigate to `edge://extensions/`
3. Enable **Developer mode** (toggle in the bottom-left corner)
4. Click **Load unpacked**
5. Select the folder containing your extension files
6. The extension should now be loaded and active

### Step 4: Test It

1. Go to your JIRA board (e.g., `https://yourcompany.atlassian.net/jira/software/...`)
2. The sprint details should automatically appear near the quick filters
3. If it doesn't appear immediately, refresh the page

## Troubleshooting

### Extension not working?

1. **Check the console**: Right-click on the page → Inspect → Console tab
   - Look for messages starting with "JIRA Sprint Extension:"
   
2. **Verify permissions**: Make sure the extension has permission to access your JIRA domain
   - Go to `edge://extensions/`
   - Click on the extension
   - Check "Site permissions"

3. **Try refreshing**: Sometimes JIRA's dynamic loading requires a page refresh

4. **Check JIRA version**: This extension works with modern JIRA Cloud instances. Some older or self-hosted versions may have different HTML structures.

### Sprint details not appearing?

- Make sure you're on an active sprint board
- Check that the sprint details button exists in JIRA (look for the circular arrow icon)
- The extension needs to click the sprint details button to extract information

## Technical Details

- **Manifest Version**: 3 (latest Edge extension standard)
- **Permissions**: Runs on Atlassian and JIRA domains
- **Approach**: Programmatically clicks the sprint details button, extracts information, and displays it in a custom element

## Customization

You can customize the appearance by editing `styles.css`:

- Change colors in the `background: linear-gradient(...)` property
- Adjust spacing with `padding` and `margin` values
- Modify font sizes in various classes

## Privacy

This extension:
- ✅ Runs entirely in your browser
- ✅ Does NOT send data to external servers
- ✅ Only accesses JIRA pages
- ✅ Does NOT store or transmit any information

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your JIRA version and structure
3. Try disabling and re-enabling the extension
4. Reload the extension after making changes

## Version

**1.0.0** - Initial release

---

**Note**: This is an unofficial extension and is not affiliated with or endorsed by Atlassian or JIRA.
