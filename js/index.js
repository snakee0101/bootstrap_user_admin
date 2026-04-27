let users = [];
let selected_user_ids = [];

function deleteUser() {
    const user_id = $("#deleteUserConfirmation").attr("data-user-id");

    $.post("http://localhost:8000/actions/delete.php?user_id=" + user_id, (data) => {
        $('#deleteUserConfirmation').modal('hide');

        $(`#users_table tbody tr[data-id=${user_id}]`).remove();
        users.splice(users.indexOf(users.find(user => user.id == user_id)), 1);

        console.log(users);
    });
}

function editUserDialog(user_record_id) {
    alert('edit dialog ' + user_record_id);
}

function getStatusClassname(is_active) {
    return is_active == 1 ? 'text-success' : 'text-secondary';
}

$(document).ready(function () {
    //preload all users
    $.post("http://localhost:8000/queries/get_all_users.php", (data) => {
        users = JSON.parse(data);

        //user record structure: {"id":5,"first_name":"Charlie","last_name":"Davis","status":1,"role":"admin"}
        //Prefill users table with initial data
        for (const user_record of users) {
            $("#users_table tbody").append(`<tr data-id="${user_record.id}">
                <th>
                    <div class="form-check">
                        <input class="form-check-input user-selection" type="checkbox" value="${user_record.id}">
                    </div>
                </th>
                <td>${user_record.first_name} ${user_record.last_name}</td>
                <td>
                    <i class="bi bi-circle-fill ${getStatusClassname(user_record.status)}"></i>
                </td>
                <td>${user_record.role}</td>
                <td>
                    <button type="button" class="btn btn-dark btn-sm" onclick="editUserDialog(${user_record.id})">Edit</button>
                    <button type="button" class="btn btn-dark btn-sm" data-bs-toggle="modal" data-bs-target="#deleteUserConfirmation" data-bs-user-id="${user_record.id}" data-bs-username="${user_record.first_name} ${user_record.last_name}">Delete</button>
                </td>
            </tr>`);
        }

        //TODO: ADD NEW EVENT LISTENERS FOR ALL INPUT EVENTS INSIDE A TABLE WHEN NEW ROW IS ADDED
        //Save/remove selected user id to/from array when checking/unchecking a checkbox in the table
        $(".user-selection").change(event => {
            //track selected user ids
             if(event.target.checked) {
                 selected_user_ids.push(event.target.value);
             } else {
                 selected_user_ids.splice(
                     selected_user_ids.findIndex(id => id == event.target.value),
                     1
                 );
             }

             //check "Select All checkbox" if all items are checked
            if($(`#users_table .user-selection:checked`).length === $(`#users_table .user-selection`).length) {
                //if all items are checked - manually check "Select All" checkbox (if it is not checked yet - otherwise we end up in infinite loop)
                if($("#selectAll").is(':checked') === false) {
                    $("#selectAll").click();
                }
            } else {
                //uncheck "Select All checkbox" if any item is unchecked (if it is not unchecked yet - otherwise we end up in infinite loop)
                if($("#selectAll").is(':checked') === true) {
                    $("#selectAll").click();
                }
            }

            console.log(selected_user_ids);
        });

        //When "Select All" checkbox ends up is checked state - manually click on those checkboxes that are unchecked (so it works only one-way)
        $("#selectAll").change(event => {
            const targetCheckedState = event.target.checked;

            //when Select All checkbox is unchecked no selection should be lost
            if(targetCheckedState === false) {
                return;
            }

            $("#users_table tbody tr").each(function() {
                const current_user_id = $(this).attr("data-id");

                const actualCheckedState = $(`#users_table tbody tr[data-id="${current_user_id}"] .user-selection`).is(':checked');

                //if intended checkbox state is incorrect - invert it forcefully, thereby triggering an event that adds an id to selected users array
                if(actualCheckedState != targetCheckedState) {
                    $(`#users_table tbody tr[data-id="${current_user_id}"] .user-selection`).click();
                }
            });
        });
    });

    //user deletion modal
    const userDeletionConfirmationModal= document.getElementById('deleteUserConfirmation');

    if (userDeletionConfirmationModal) {
        userDeletionConfirmationModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget
            const user_id= button.getAttribute('data-bs-user-id')
            const username = button.getAttribute('data-bs-username');

            // Update the modal's content.
            const usernamePlaceholder = userDeletionConfirmationModal.querySelector('.userNameToDelete')

            usernamePlaceholder.textContent = `"${username}"`;
            userDeletionConfirmationModal.setAttribute('data-user-id', user_id);
        })
    }
});