// This is the main background script for the Chrome extension.
// Background scripts run continuously in the background and handle events,
// messages, and long-running tasks for the extension.
// In Manifest V3, background scripts are implemented as Service Workers.

// Listen for messages sent from other parts of the extension,
// such as the popup script (popup.js) or content scripts.
// The `addListener` function takes an asynchronous callback function.
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // `request`: The message object sent by another part of the extension.
  // `sender`: An object containing information about the sender of the message (e.g., tab ID, URL).
  // `sendResponse`: A function to send a response back to the sender (optional, not used here).

  // Check if the received message's 'action' property is 'scanUrl'.
  // This action is triggered when the user clicks the "Scan Current URL" button in the popup.
  if (request.action === 'scanUrl') {
    // Use a try-catch block to gracefully handle any potential errors that might occur
    // during the asynchronous operations within this block. This prevents the service worker
    // from crashing if, for example, a tab cannot be queried.
    try {
      // Query for the currently active tab in the current browser window.
      // `chrome.tabs.query` is an asynchronous operation, so `await` is used to pause
      // execution until the promise resolves.
      // It returns an array of Tab objects, so we destructure the first element `[currentTab]`
      // as we are only interested in the single active tab.
      let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Check if a valid `currentTab` object was retrieved and if it has a `url` property.
      // Some internal Chrome pages (e.g., `chrome://extensions/`) do not expose their URLs
      // to extensions for security reasons, even with `activeTab` permission.
      if (currentTab && currentTab.url) {
        // Create a new `URL` object from the current tab's URL.
        // The `URL` object provides robust and standardized methods for parsing and
        // manipulating URL components (hostname, pathname, search params, etc.),
        // making it safer and more reliable than manual string manipulation (e.g., using `replace()`).
        const urlObj = new URL(currentTab.url);
        
        // Construct the part of the URL that VirusTotal's search endpoint expects.
        // VirusTotal's search path typically uses the domain and full path.
        // We combine the `hostname` (e.g., "www.example.com") and the `pathname`
        // (e.g., "/path/to/resource.html").
        // A conditional check for `urlObj.pathname === '/'` is added to avoid
        // appending an extra slash if the URL is just the root domain (e.g., "example.com/").
        const urlToScan = `${urlObj.hostname}${urlObj.pathname === '/' ? '' : urlObj.pathname}`;
        
        // Encode the `urlToScan` component to make it safe for inclusion as part of another URL.
        // `encodeURIComponent` correctly handles special characters (like '/', '?', '&', '=', '#')
        // that might be present in the URL path or query parameters, preventing them from breaking
        // the target URL structure.
        const encodedUrl = encodeURIComponent(urlToScan);
        
        // Construct the full VirusTotal scan URL.
        // This uses the VirusTotal GUI's search endpoint, which allows directly navigating
        // to scan results for a given URL.
        const virustotalScanUrl = `https://www.virustotal.com/gui/search/${encodedUrl}`;
        
        // Open the constructed VirusTotal URL in a new browser tab.
        chrome.tabs.create({ url: virustotalScanUrl });
        
        // Log the URL that was initiated for scanning to the background script's console.
        // This is extremely helpful for monitoring the extension's activity and debugging.
        console.log(`Scanning URL: ${currentTab.url}`);
      } else {
        // If `currentTab` or `currentTab.url` is not available (e.g., the user is on
        // a `chrome://` page, the New Tab page, or an empty tab), log a warning.
        console.warn("Could not get current URL from active tab. Opening default VirusTotal upload page.");
        // As a fallback, open the general VirusTotal file upload page in a new tab.
        // This ensures the user can still perform an action even if URL scanning isn't possible.
        chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" });
      }
    } catch (error) {
      // If any unhandled error occurs within the try block during the 'scanUrl' action
      // (e.g., a network error, an unexpected API response), this block will catch it.
      // Log the specific error object to the console for detailed debugging.
      console.error("Error in 'scanUrl' action:", error);
      // In case of an error, also fallback to opening the default VirusTotal upload page.
      // This provides a consistent user experience even when errors occur.
      chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" }); 
    }
  } 
  // Check if the received message's 'action' property is 'uploadFile'.
  // This action is triggered when the user clicks the "Upload a File" button in the popup.
  else if (request.action === 'uploadFile') {
    // Use a try-catch block for robust error handling specific to the file upload action.
    try {
      // Open the VirusTotal file upload page directly in a new tab.
      // This is a simpler action as it doesn't require getting the current tab's URL.
      chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" });
      // Log a confirmation message to the console for debugging purposes.
      console.log("Opened VirusTotal file upload page.");
    } catch (error) {
      // Catch and log any errors that occur while trying to open the tab for file upload.
      console.error("Error in 'uploadFile' action:", error);
    }
  }
});