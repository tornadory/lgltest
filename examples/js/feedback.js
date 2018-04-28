function submitFeedback() {
    var message = document.getElementById("message_area").value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/cgi-bin/handle_feedback.py", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("comment='" + message + "'");
    document.getElementById("feedback-title").innerHTML = "Thank you!";
    document.getElementById("message_area").value = "";
}
