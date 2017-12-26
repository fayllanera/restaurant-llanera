// function login() {
//     console.log($('#email').val());
//     console.log($('#password').val());
//     $.ajax({
//         url: 'http://127.0.0.1:5000/login/',
//         contentType: 'application/json; charset=utf-8',
//         data: JSON.stringify({
//             'email': $("#email").val(),
//             'password': $("#password").val()
//         }),
//         type: "POST",
//         dataType: "json",
//         success: function (resp) {
//             if (resp.status == 'ok') {
//                 window.location.replace('restaurant.html');
//             } else if (resp.status == 'error') {
//                 console.log('u7ykyiksd')
//                 window.location.replace('login.html');
//             }
//
//         },
//         error: function (resp) {
//             window.location.replace('/texts/404.html');
//         }
//     });
// }

function reservations() {
    $.ajax(
        {
            url: "http://127.0.0.1:5000/reservation/",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'diner': $("#diner").val(),
                'cus_name': $("#cus_name").val(),
                'attendees': $("#attendees").val(),
                'res_date': $("#res_date").val(),
                'res_time': $("#res_time").val()
            }),
            type: "POST",
            dataType: "json",

            error: function (resp) {
                //window.location.replace('404.html');
                alert("kapit lang!");
                 window.location.replace('home');
            },

            success: function (resp) {
               // alert(resp.status);
                alert("Reservation sent!");
                window.location.replace('/restaurant');
            }
        }
    );

}


function search() {

    $('#results').show();
    $.ajax(
        {
            url: "http://127.0.0.1:5000/search/",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'resname1': $("#resname1").val()
            }),
            type: "POST",
            dataType: "json",
            error: function (resp) {
                alert("Restaurant not found.");
            },
            success: function (resp) {
                if (resp.status == 'ok') {
                    for (i = 0; i < resp.count; i++) {
                        resname1 = resp.entries[i].resname1;
                        address = resp.entries[i].address;
                        contact = resp.entries[i].contact;
                        $("#results").append(results(resname1, address, contact));
                    }
                }
                else {
                    $("#results").html("");

                    alert("Successfully updated!");
                }
            }
        });
}

function results(res_name1, address, contact)
{
    return '<tr>'+
            '<td>' +resname1+ '</td>' +
            '<td>' +address+ '</td>' +
            '<td>' +contact+ '</td>' +
            '</tr>';

}

function rate() {
    $.ajax(
        {
            url: "http://127.0.0.1:5000/rating",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'answer': $("#rateYo").rateYo("option", "rating"),
                'diner': $("#diner_name").val()
            }),
            type: "POST",
            dataType: "json",
            error: function (e) {
            },
            success: function (resp) {
                if (resp.status == 'ok') {
                    alert("Thank you for your rating!");
                    window.location.replace('/restaurant');
                }
                else {
                    alert("ERROR");
                }
            }
        });
}


function myreservation(){

 	 $("#viewreserve").show();

 $.ajax({
     		url: 'http://127.0.0.1:5000/my_reservation',
     		type: "GET",
     		dataType: "json",
     		success: function(resp) {

 				if (resp.status  == 'ok') {
 				   for (i = 0; i < resp.count; i++)
                                   {
 									   diner = resp.entries[i].diner;
 									   cus_name = resp.entries[i].cus_name;
                                       attendees = resp.entries[i].attendees;
 									   res_date = resp.entries[i].res_date;
                                       res_time = resp.entries[i].res_time;
                                        $("#viewreserve").append(viewreserve(diner,cus_name,attendees,res_date,res_time));
                                   }
 				} else
 				{
                                        $("#viewreserve").html("");
 					alert(resp.message);
 				}
     		}
 		});
 }


function viewreserve(diner,cus_name,attendees,res_date,res_time)
{
       return '<tr>'+
             '<td>' +diner+ '</td>' +
             '<td>' +cus_name+ '</td>' +
             '<td>' +attendees+ '</td>' +
             '<td>' +res_date+ '</td>' +
             '<td>' +res_time+ '</td>'+
             '</tr>';
}


function view_ratings(){

 	 $("#viewratings").show();

 $.ajax({
     		url: 'http://127.0.0.1:5000/view_ratings',
     		type: "GET",
     		dataType: "json",
     		success: function(resp) {

 				if (resp.status  == 'ok') {
 				   for (i = 0; i < resp.count; i++)
                                   {
 									   diner_name = resp.entries[i].diner_name;
 									   answer = resp.entries[i].answer;
                                        $("#viewratings").append(viewratings(diner_name, answer));
                                   }
 				} else
 				{
                                        $("#viewratings").html("");
 					alert(resp.message);
 				}
     		}
 		});
 }


function viewratings(diner_name, answer)
{
       return '<tr>'+
             '<td>' +diner_name+ '</td>' +
             '<td>' +answer+ '</td>' +
             '</tr>';
}
