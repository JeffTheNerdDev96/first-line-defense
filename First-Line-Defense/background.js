/**
 * Handles the "scanUrl" action: retrieves the current tab's URL and opens
 * it in VirusTotal's search interface.
 * Includes robust URL parsing and error logging.
 */
async function handleScanUrl() {
  try {
    // Query for the currently active tab in the current browser window.
    // `chrome.tabs.query` is an asynchronous operation, so `await` is used.
    let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if a valid `currentTab` object was retrieved and if it has a `url` property.
    if (currentTab && currentTab.url) {
      // Create a new `URL` object from the current tab's URL for robust parsing.
      const urlObj = new URL(currentTab.url);
      
      // Construct the part of the URL that VirusTotal's search endpoint expects.
      // This typically involves the hostname and the pathname.
      const urlToScan = `${urlObj.hostname}${urlObj.pathname === '/' ? '' : urlObj.pathname}`;
      
      // Encode the `urlToScan` component to make it safe for inclusion in a URL.
      const encodedUrl = encodeURIComponent(urlToScan);
      
      // Construct the full VirusTotal scan URL using their search endpoint.
      const virustotalScanUrl = `https://www.virustotal.com/gui/search/${encodedUrl}`;
      
      // Open the constructed VirusTotal URL in a new browser tab.
      chrome.tabs.create({ url: virustotalScanUrl });
      
      // Log the URL that was initiated for scanning for debugging purposes.
      console.log(`Scanning URL: ${currentTab.url}`);
    } else {
      // Log a warning if the current URL could not be retrieved.
      console.warn("Could not get current URL from active tab. Opening default VirusTotal upload page.");
      // Fallback: open the general VirusTotal file upload page.
      chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" });
    }
  } catch (error) {
    // Catch and log any errors that occur during the URL scanning process.
    console.error("Error in 'scanUrl' action handler:", error);
    // Fallback in case of an error: open the default VirusTotal upload page.
    chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" }); 
  }
}

/**
 * Handles the "uploadFile" action: opens the VirusTotal file upload page in a new tab.
 * Includes error logging.
 */
async function handleUploadFile() {
  try {
    // Open the VirusTotal file upload page directly in a new tab.
    chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" });
    // Log a confirmation message to the console.
    console.log("Opened VirusTotal file upload page.");
  } catch (error) {
    // Catch and log any errors that occur while trying to open the tab.
    console.error("Error in 'uploadFile' action handler:", error);
  }
}

// Main message listener for the background script.
// It acts as a dispatcher, delegating tasks to specific handler functions
// based on the 'action' property of the received message.
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // Check the 'action' property of the message from the popup.
  if (request.action === 'scanUrl') {
    // If the action is 'scanUrl', call the dedicated handler function.
    await handleScanUrl();
  } else if (request.action === 'uploadFile') {
    // If the action is 'uploadFile', call the dedicated handler function.
    await handleUploadFile();
  }
  // No `sendResponse` is called here as the actions involve opening new tabs,
  // and the popup closes itself.
});