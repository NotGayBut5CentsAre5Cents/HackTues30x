

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
  var textDiv = document.getElementById("text");
  //var xhr = new XMLHttpRequest();
  // xhr.open("POST", "http://localhost:3000/sum", true);
  // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // xhr.onreadystatechange = function() {
    // if (xhr.readyState == XMLHttpRequest.DONE) {
      // console.log("Hello, world!")
      //document.getElementById("response").innerHTML = xhr.responseText;
    // }
  // }

  if(textDiv.innerHTML != "") {
    text = textDiv.innerHTML;
    //xhr.send(JSON.stringify({text: text}));
  }else {
    chrome.tabs.executeScript( {
      code: "if (window.getSelection) { window.getSelection().toString();" +
      "} else if (document.selection && document.selection.type != \"Control\") {" +
      " document.selection.createRange().text;}"
    }, function(selection) {
      text = selection[0]; 
      //xhr.send(JSON.stringify({ss: 1}));
      $.ajax({
        type: "post",
        url: 'http://localhost:3000/sum',
        data: {text: text},
        success: function(data) {
            console.log("Hello, world!")
            document.getElementById("response").innerHTML = data;
         }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var button = document.getElementById('buttonSubmit');
    
    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    button.addEventListener('click', () => {
        getSummarizedText(url);
    });
  });
});
