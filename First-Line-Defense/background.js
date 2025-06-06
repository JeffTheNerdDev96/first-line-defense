chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'scanUrl') {
    // This block handles the "Scan Current URL" action
    try {
      // Query for the currently active tab in the current window
      let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Check if a current tab and its URL are available
      if (currentTab && currentTab.url) {
        let urlToScan = currentTab.url;

        // Strip "http://" or "https://" from the beginning of the URL
        urlToScan = urlToScan.replace(/^(https?:\/\/)/, '');

        // Encode the modified URL to ensure it's safe to incslude in another URL
        const encodedUrl = encodeURIComponent(urlToScan);
        // Construct the VirusTotal URL using the /search/ endpoint
        const virustotalScanUrl = `https://www.virustotal.com/gui/search/${encodedUrl}`;
        // Open the constructed URL in a new tab
        chrome.tabs.create({ url: virustotalScanUrl });
      } else {
        // If the current URL is not available (e.g., on a Chrome internal page),
        // log a warning and open the default VirusTotal upload page as a fallback.
        console.warn("Could not get current URL. Opening default VirusTotal page.");
        chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" });
      }
    } catch (error) {
      // Catch and log any errors during the process of getting the URL or opening the tab.
      console.error("Error getting current URL or opening VirusTotal:", error);
      // Fallback to the default VirusTotal upload page in case of an error.
      chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" });
    }
  } else if (request.action === 'uploadFile') {
    // This block handles the "Upload a File" action
    // Open the VirusTotal file upload page directly in a new tab.
    chrome.tabs.create({ url: "https://www.virustotal.com/gui/home/upload" });
  }
});