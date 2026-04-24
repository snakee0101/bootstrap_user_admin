//1. Get Initial data

let users = [];

$.post("http://localhost:8000/queries/get_all_users.php", (data) => {
    users = data;

    console.log(users);
});