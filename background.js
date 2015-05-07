

var qsValue_background = "";
var user_text = "";


// function resetDefaultSuggestion() {
//   chrome.omnibox.setDefaultSuggestion({
//   description: 'qs: Quick search for %s'
//   });
// }

function navigate(url) {
    UrlExists(url, function(status){
                if(status === 200){
                   // file was found
                }
                else 
                {
                    //file was not found
                   url = '404.html';
                }
            });

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.update(tabs[0].id, {url: url});
      });
}

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 


chrome.omnibox.onInputEntered.addListener(
	//search through data else diplay aleart
	
    function(text)
    {
    	get_names_from_local();
    	user_text = text;
	});

//get the names from local storage.
function get_names_from_local()
{
  chrome.storage.local.get('qsValue', function (result) {
        qsValue_background = result.qsValue;
        console.log("Get info: " + qsValue_background);
        after_names_found();
    });
}

//check if valid url
function UrlExists(url, cb){
    jQuery.ajax({
        url:      url,
        dataType: 'text',
        type:     'GET',
        complete:  function(xhr){
            if(typeof cb === 'function')
               cb.apply(this, [xhr.status]);
        }
    });
}
// chrome.webRequest.onErrorOccurred.addListener(

// function ()
// {
// 	console.log("ERRRRRRRRRRRRRRRRRRRRRRRRror");
//     chrome.tabs.update(details.tabId, {url: "404.html"});
// });

//https://www.facebook.com/search/more/?q=
//http://stackoverflow.com/search?q=
function after_names_found() {
		var tempQS = qsValue_background;
    	var tempQS_array = tempQS.split(", ");
    	console.log("Length: "+ tempQS_array.length);
    	for(var i = 0; i < tempQS_array.length; i++)
        {
        	console.log("local:" + tempQS_array[i]+ "----");
            if (tempQS_array[i] == user_text.charAt(0).toLowerCase())
            {
                var link = tempQS_array[i+1];
                var temp = user_text;
                temp = temp.replace(tempQS_array[i] + " ", "");
                temp = temp.replaceAll(" ", "%20");

                navigate(link + temp);
                break;
            }
        }
}