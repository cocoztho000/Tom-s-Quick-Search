
var qsValue = "";

//set the names of the input boxes that are entered



function saveNames() 
{
  //counter to know how many links they have in storage

  //cleans inputs
  if($( "#input01" ).val() == "" || $( "#input01" ).val() == " " || $( "#input02" ).val() == "")
  {
    alert("Both fields have to be filled in");
    return;
  }


  console.log("QS Value: " + qsValue);

  if(qsValue == undefined)
  {
    qsValue = "";
  }

  //Append To string 
  if (qsValue !== "")
  {
      var found = false;
       
        //find the location find and replace
        var link_array = qsValue.split(", ");
        for(var i = 0; i < link_array.length; i++)
        {
            if (link_array[i] == $( "#input01" ).val())
            {
                link_array[i+1] = $( "#input02" ).val();
                qsValue = link_array.join(", ");
                found = true;
                break;
            }
        }
      
      if(!found)
        qsValue += ", " + $( "#input01" ).val() + ", " + $( "#input02" ).val();
  }
  else
      qsValue += $( "#input01" ).val() + ", " + $( "#input02" ).val();

  //addRow($( "#input01" ).val(), $( "#input02" ).val());
  //save items array to.local storage
  save();
}

function save() {
  chrome.storage.local.set({'qsValue': qsValue}, function() {
      // Notify that we saved.;
      console.log('Settings saved');
    });
  $('#input01').val('');
  $('#input02').val('');
  displayData();
}


//new button
//reset the fields to empty
$(document).on('click', ".button_New", function() {
    $('#input01').val('');
    $('#input02').val('');
});

$(document).on('click', ".button1", function() {
 	saveNames();
});
 

//get the names from local storage.
function getNames()
{
  chrome.storage.local.get('qsValue', function (result) {
        qsValue = result.qsValue;
        displayData();
        //console.log("Get info: "+ qsValue);
    });
}

//make links appear and go away
$(document).ready(function() {
    var up = true;
    $(".scroll_button").click(function() {
        $(this).next().slideToggle("fast");
        if (up) 
        {
          up = false;
          $(".rotate").html('&#9650;');
        }
        else 
        {
          up = true;
         $(".rotate").html('&#9660');
        }
    });

});


function displayData()
{ 
  $("#table_body").empty();

  if(qsValue != "")
  {
    var valueArray = qsValue.split(", ");
    for(var i = 0; i < valueArray.length; i=i+2)
    {
      //this is where we write a script to dynamically build data
      addRow(valueArray[i], valueArray[i+1])
    }
  }
}


function addRow(letter, link)
{
  var temp = '<tr class="table_row"><TD class="td1">' + letter + '</TD> <TD class="td2">' + link + '</TD><td class="delete">delete</td></tr>';
  $("#table_body").append(temp);

  $(".table_row").click( function() {
       var td1 = $(this).closest("tr").find(".td1").text();
       var td2 = $(this).closest("tr").find(".td2").text();
      $('#input01').val(td1);
      $('#input02').val(td2);
    });  

  $(".delete").click( function() {
        var id = $(this).closest("tr").find(".td1").text();
        var link_array = qsValue.split(", ");
        for(var i = 0; i < link_array.length; i++)
        {
            if (link_array[i] == id)
            {
                link_array.splice(i, 2);
                qsValue = link_array.join(", ");
                save();
                break;
            }
        }

        $(this).closest("tr").remove();
    });  
}







//remove what going off
function clearServer()
{
  chrome.storage.local.set({'qsValue': ""}, function() {
      // Notify that we saved.
      //console.log("Value: " + qsValue);
      //console.log('Settings saved');
    });
}

$( document ).ready(function() {
    getNames(); 
});




