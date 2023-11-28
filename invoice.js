var AppsScriptLink = "AKfycbyWQXwDS6_fzHmOvVIxqCOLHjRSD5RZE_yBlFrblxD-GVRMbURTRDdUdvTTVKUMQWMZ";

// Function to call the Search function whenever the input field value changes
$('#rfq_no').on('input', function() {
  // Get the value from the input field
  var inputValue = $(this).val();

  // Call the Search function with the input value
  Search(inputValue);
});

function GetPrint()
{
    /*For Print*/
    window.print();
}

function BtnAdd()
{
    /*Add Button*/
    var v = $("#TRow").clone().appendTo("#TBody") ;
    $(v).find("input").val('');
    $(v).removeClass("d-none");
    $(v).find("th").first().html($('tr').length - 2);
}

function BtnDel(v)
{
    /*Delete Button*/
    $(v).parent().parent().remove();
    GetTotal();
    ReGenSrNo();
}

function ReGenSrNo()
{
     $("#TBody").find("tr").each(
     function(index)
     {
          $(this).find("th").first().html(index);
     }
     );
}



$(document).ready(function () {
    FormValidation();
    SetCurrentDate();
    BtnAdd();
    FillDataList();
    MaxInv();
      
       
});


function FillDataList()
{
        $.getJSON("https://script.google.com/macros/s/"+AppsScriptLink+"/exec?page=dropdown",
       
        function (data) {

          var Options="";

          $.each(data, function(key, value)
          {
            Options = Options + '<option>' + value + '</option>';
          });

          $("#mylist").append(Options);
         
        });
}

function MaxInv()
{
        $.getJSON("https://script.google.com/macros/s/"+AppsScriptLink+"/exec?page=max",
        function (data) {
         
          $("input[name='rfq_no']").val(data);

        });
}


function SetCurrentDate()
{
    const date = new Date();
    console.log(date);

    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();

    if (d < 10) d = '0' + d;
    if (m < 10) m = '0' + m;

    let CurrDate = y + '-' + m + '-' + d;

    $('input[name="inv_dt"]').val(CurrDate);

}


function FormValidation()
{
    // Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
 
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
 
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
 
          form.classList.add('was-validated')
        }, false)
      })
  })()
}

function Search(pNo="")
{
        var no = $('#rfq_no').val();

		if (pNo != "") no = pNo;

        $.getJSON("https://script.google.com/macros/s/"+AppsScriptLink+"/exec?page=search&no="+no,
        function (data) {

         
        alert(data);
         console.log(data);
          if (data == "NOT FOUND")
          {
            alert('Invoice No. Not Found...');

          }
          else
          {
            //var record = data;
            var record   = data.record;

            var StartRow = data.SR;
            var RowCount = data.CNT;

            $('#IsNew').val('N');
            $('#StartRow').val(StartRow);
            $('#RowCount').val(RowCount);
         
            var i = 0;
            $.each(record, function(key, value)
            {
           
              if (i == 0)
              {
                var dt = value[1].substring(0,10);
                document.getElementsByName("rfq_no")[0].value = value[0];
                document.getElementsByName("inv_dt")[0].value = dt;
                document.getElementsByName("cust_nm")[0].value = value[2];
                document.getElementsByName("addr")[0].value = value[3];
                document.getElementsByName("city")[0].value = value[4];
              }
              else
              {
                if (i > 1) BtnAdd();
               
             
                document.getElementsByName("item_nm")[i].value = value[5];
                document.getElementsByName("qty")[i].value     = value[6];
                document.getElementsByName("rate")[i].value    = value[7];
                document.getElementsByName("amt")[i].value     = value[8];

              }

              i = i + 1;
            });

            GetTotal();
			ReGenSrNo();

          }
        });
		$('#exampleModal').modal('hide');
		 
}

function ShowAllData()
{
	$(document).ready(function (){
		
		$.getJSON("https://script.google.com/macros/s/"+AppsScriptLink+"/exec?page=all",
        function (data) {
	
		var Table="", Rows="", Columns="";
		$.each(data, function(key, value)
		{
			var InvNo="";
			Columns ="";
			i=0;
			$.each(value, function(key1, value1)
			{
				i++;
				if (i ==2) 
				{
					value1 = "" + value1;
					value1 = value1.substring(0, 10);	
				}
				Columns = Columns + '<td>' + value1 + '</td>';
				if (InvNo == "") InvNo = value1;
				
				
			});
			Rows = Rows + '<tr onclick="Search('+InvNo+')">' + Columns + '</tr>';
		});
		
		$("#MyTBody").html(Rows);
		$('#exampleModal').modal('show');
	});	
	});			

}

