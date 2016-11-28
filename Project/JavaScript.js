var jsonData = {};

$(document).ready(function () {

    if (localStorage.length != 0) {
        var tableData = JSON.parse(sessionStorage.getItem("tableData"));
        $.each(tableData, function (i, item) {
            updateDetailsTable(tableData[i].fName, tableData[i].lName, tableData[i].uEmail, tableData[i].mNumber);
        });

    }
    $("#userDetails").click(function () {
        $("#myForm").show();
        $("#formDetails").hide();
    });

    $("#submittedDetails").click(function () {
        $("#formDetails").show();
        $("#myForm").hide();
    });

    $("#submitForm").click(function () {
        var x = $("#first-name").val();
        var y = $("#last-name").val();
        var z = $("#email").val();
        var w = $("#number").val();
        var emailRgExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var correctEmail = emailRgExp.test(z);
        var numberRgExp = /^\d+$/;
        var onlyNumber = numberRgExp.test(w);
        if (x == null || x == "") {
            alert("First Name must be filled out");
            return false;
        }
        else if (y == null || y == "") {
            alert("Last Name must be filled out");
            return false;
        }
        else if (z == null || z == "" || !correctEmail) {
            alert("Email must be filled out with valid email address");
            return false;
        }
        else if (w == null || w == "" || !onlyNumber) {
            alert("Number must be filled out and should contain numbers only");
            return false;
        }
        else {
            updateDetailsTable(x, y, z, w);
            jsonData = tableToJson();
            sessionStorage.setItem("tableData", JSON.stringify(jsonData));
            document.getElementById("dataForm").reset();
            alert("Form sucessfully submitted. Clik View Details to see submission");
        }
    });

    $('th').click(function () {
        var table = $(this).parents('table').eq(0);
        var rows = table.find("tr:not(:has('th'))").toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        if (!this.asc) {
            rows = rows.reverse();
        }
        for (var i = 0; i < rows.length; i++) {
            table.append(rows[i]);
        }

        jsonData = tableToJson();
        sessionStorage.setItem("tableData", JSON.stringify(jsonData));
    });

    $('table').each(function () {
        var table = $(this);
        var headers = table.find('th').length;
        var filterrow = $('<tr>').insertAfter($(this).find('th:last()').parent());
        for (var i = 0; i < headers; i++) {
            filterrow.append($('<th>').append($('<input>').attr('type', 'text').keyup(function () {
                table.find('tr').show();
                filterrow.find('input[type=text]').each(function () {
                    var index = $(this).parent().index() + 1;
                    var filter = $(this).val() != '';
                    $(this).toggleClass('filtered', filter)
                    if (filter) {
                        var el = 'td:nth-child(' + index + ')';
                        var criteria = ":contains('" + $(this).val() + "')";
                        table.find(el + ':not(' + criteria + ')').parent().hide();
                    }
                });
            })));
        }
    });

});

function updateDetailsTable(first, last, email, number) {
    var template = '<tr>' +
                        '<td>{0}</td>' +
                        '<td>{1}</td>' +
                        '<td>{2}</td>' +
                        '<td>{3}</td>' +
                    '</tr>';
    var dataTemplate = template.replace("{0}", first).replace("{1}", last).replace("{2}", email).replace("{3}", number);
    $("#tableBody").append(dataTemplate);

}

function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index);
        var valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
    }
}

function getCellValue(row, index) {
    return $(row).children('td').eq(index).html();
}

function tableToJson() {

    var firstName = "";
    var lastName = "";
    var email = "";
    var number = "";
    var jsonArr = [];

    var tbl2 = $('table tr').each(function (i) {

        if (i > 1) {
            x = $(this).children();
            firstName = x[0].innerHTML;
            lastName = x[1].innerHTML;
            email = x[2].innerHTML;
            number = x[3].innerHTML;
            jsonArr.push({
                fName: firstName,
                lName: lastName,
                uEmail: email,
                mNumber: number
            });

        }
    })

    return jsonArr;
}

