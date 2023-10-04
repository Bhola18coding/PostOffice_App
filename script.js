var token = "fbeb1484161e8c";

var ip = document.getElementById("ip");
var lat = document.getElementById("lat");
var long = document.getElementById("long");
var city = document.getElementById("city");
var region = document.getElementById("region");
var org = document.getElementById("org");
var host = document.getElementById("host");
var map = document.getElementById("view-map");
var timezone = document.getElementById("timezone");
var date_time = document.getElementById("date_time");
var pincode = document.getElementById("pincode");
var message = document.getElementById("message");
var container = document.getElementById("container");

document.addEventListener("DOMContentLoaded", loadFetchData);

function loadFetchData() {

    fetch('https://api.ipify.org?format=json')
            .then((response) => response.json())
            .then((data) => {
                ip.innerHTML = data.ip;
            })
            .catch((error) => {
                alert("Please Disable your anti-virus to work this site!");
            })
    
    
    var url = `https://ipinfo.io/${ip.innerHTML}/geo?token=${token}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            lat.innerHTML = data.loc.split(",")[0];
            long.innerHTML = data.loc.split(",")[1];
            city.innerHTML = data.city;
            region.innerHTML = data.region;
            org.innerHTML = data.org;
            host.innerHTML = data.org;

            map.setAttribute("src",
                "https://maps.google.com/maps?q=" + data.loc.split(",")[0] + ", "
                + data.loc.split(",")[1] + "&z=15&output=embed");

            timezone.innerHTML = data.timezone;
            date_time.innerHTML = getDateTime(data.timezone);
            pincode.innerHTML = data.postal;

            fetchPostalsNearBy(data.postal);
        })
        .catch((error) => {
            console.log(error);
        });
}

function getDateTime(time_zone) {
    return new Date().toLocaleString("en-US", { timeZone: time_zone });
}

function fetchPostalsNearBy(pincode) {
    var url = `https://api.postalpincode.in/pincode/${pincode}`;

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        message.innerHTML = data[0].Message;

        setCardsinUI(data[0].PostOffice);
    })
    .catch((error) => {
        console.log(error);
    })
}

function setCardsinUI(postOffices) {
    postOffices.forEach((postOffice) => {
        var card = document.createElement("div");
        card.className = "card";
        card.innerHTML = 
        `<p>Name: ${postOffice.Name}</p>
        <p>Branch Type: ${postOffice.BranchType}</p>
        <p>Delivery Status: ${postOffice.DeliveryStatus}</p>
        <p>District: ${postOffice.District}</p>
        <p>Division: ${postOffice.Division}</p>`;

        container.appendChild(card);
    })
}

function searchCards() {
    var input, filter;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    card = container.getElementsByTagName("div");

    // Loop through all table rows, and hide those who don't match the search query
    for (var i = 0; i < card.length; i++) {
        var post_name = card[i].getElementsByTagName("p")[0];
        var branch = card[i].getElementsByTagName("p")[1];
        var delivery_status = card[i].getElementsByTagName("p")[2];
        var district = card[i].getElementsByTagName("p")[3];
        var division = card[i].getElementsByTagName("p")[4];

        if (post_name || branch || delivery_status || district || division) {
            post_name = post_name.textContent || post_name.innerText;
            branch = branch.textContent || branch.innerText;
            delivery_status = delivery_status.textContent || delivery_status.innerText;
            district = district.textContent || district.innerText;
            division = division.textContent || division.innerText;


            if (post_name.toUpperCase().indexOf(filter) > -1
            || branch.toUpperCase().indexOf(filter) > -1
            || delivery_status.toUpperCase().indexOf(filter) > -1
            || district.toUpperCase().indexOf(filter) > -1
            || division.toUpperCase().indexOf(filter) > -1) {
                card[i].style.display = "";
            } else {
                card[i].style.display = "none";
            }
        }
    }
}

const search = document.getElementById("search");
search.addEventListener("keyup", searchCards);