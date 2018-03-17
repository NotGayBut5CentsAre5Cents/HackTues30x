

/**
 * Get the current URL.
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {

    var tab = tabs[0];

    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

}

/**
 * Gets the text summarry
 *
 * @param {string} url of the current active tab
 * 
 * TO DO: find out if its possible
 * to add the url to permmisions programaticaly?
 */
function getSummarizedText(url) { 
  var text = "";
  chrome.tabs.executeScript( {
    code: "if (window.getSelection) { window.getSelection().toString();" +
    "} else if (document.selection && document.selection.type != \"Control\") {" +
    "  text = document.selection.createRange().text;}"
  }, function(selection) {
    //document.getElementById("response").innerHTML = selection[0];
  });
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/sum", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      console.log("Hello, world!")
      document.getElementById("response").innerHTML = xhr.responseText;
    }
  }
  xhr.send(text);
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var button = document.getElementById('summarize');
    
    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    button.addEventListener('click', () => {
        getSummarizedText(url);
    });
  });
});
