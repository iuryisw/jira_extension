// popup.js - Handle extension settings

document.addEventListener('DOMContentLoaded', () => {
  const notificationsToggle = document.getElementById('showNotifications');
  const saveStatus = document.getElementById('saveStatus');
  
  // Load saved settings
  chrome.storage.sync.get(['showNotifications'], (result) => {
    // Default to false if not set
    notificationsToggle.checked = result.showNotifications || false;
  });
  
  // Save settings when toggle changes
  notificationsToggle.addEventListener('change', () => {
    const enabled = notificationsToggle.checked;
    
    chrome.storage.sync.set({ showNotifications: enabled }, () => {
      // Show save confirmation
      saveStatus.classList.add('show');
      setTimeout(() => {
        saveStatus.classList.remove('show');
      }, 2000);
      
      // Try to notify content script of the change (with error handling)
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            showNotifications: enabled
          }).catch(() => {
            // Ignore errors - content script might not be on a JIRA page
            console.log('Could not send message to content script (page might not be JIRA)');
          });
        }
      });
    });
  });
});