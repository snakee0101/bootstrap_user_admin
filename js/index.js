let selected_user_ids = [];

class UserReactiveCollection
{
    users = []; //its a Map - only one copy of a record with specific id is allowed

    constructor(users = [])
    {
        this.users = users;
    }

    set(record)
    {
        //user record structure: {"id":5,"first_name":"Charlie","last_name":"Davis","status":1,"role":"admin"}
        //Add a record to collection. users array must behave like a set (unique by user id)
        const index = this.users.findIndex(user => user.id == record.id);

        if (index === -1) {
            this.users.unshift(record); // new
        } else {
            this.users[index] = record; // replace existing
        }

        //update table rows
        //checked state must be preserved when updating the table
        let checked = selected_user_ids.indexOf(record.id) !== -1 ? 'checked' : '';

        const updatedRowContent = `
          <th>
            <div class="form-check">
                <input class="form-check-input user-selection" type="checkbox" value="${record.id}" ${checked}/>
            </div>
          </th>
          <td>${record.first_name} ${record.last_name}</td>
          <td>
              <i class="bi bi-circle-fill ${getStatusClassname(record.status)}"></i>
          </td>
          <td>${record.role}</td>
          <td>
            <button type="button" class="btn btn-dark btn-sm" onclick="editUserDialog(${record.id})">Edit</button>
            <button type="button" class="btn btn-dark btn-sm" data-bs-toggle="modal" data-bs-target="#deleteUserConfirmation" data-bs-user-id="${record.id}" data-bs-username="${record.first_name} ${record.last_name}">Delete</button>
          </td>`;

        if($(`#users_table tbody tr[data-id="${record.id}"]`).length === 0) {
            $("#users_table tbody").prepend(`<tr data-id="${record.id}">${updatedRowContent}</tr>`); //if the row with this user id doesn't exist in the table - create a row
        } else {
            $(`#users_table tbody tr[data-id="${record.id}"]`).html(updatedRowContent); //otherwise - replace the row content
        }

        //re-register user selection event for new row
        $(`#users_table tbody tr[data-id="${record.id}"] .user-selection`).off('change').change((event) => {
            //track selected user ids - Save/remove selected user id to/from array when checking/unchecking a checkbox in the table
            if(event.target.checked) {
                selected_user_ids.push(Number(event.target.value));
            } else {
                selected_user_ids.splice(
                    selected_user_ids.findIndex(id => id == Number(event.target.value)),
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
        });
    }

    get(user_id)
    {
        return this.users.find(user => user.id == user_id);
    }

    remove(user_id)
    {
        //remove array item
        this.users.splice(
            this.users.indexOf(
                this.users.find(user => user.id == user_id)
            ), 1
        );

        $(`#users_table tbody tr[data-id=${user_id}]`).remove(); //as well as the table row
    }
}

let userCollection = new UserReactiveCollection();

//general-purpose methods

function deleteUser()
{
    const user_id = $("#deleteUserConfirmation").attr("data-user-id");

    $.post("http://localhost:8000/actions/delete.php?user_id=" + user_id, (data) => {
        $('#deleteUserConfirmation').modal('hide');

        userCollection.remove(user_id);
    });
}

function editUserDialog(user_record_id)
{
    alert('edit dialog ' + user_record_id);
}

function getStatusClassname(is_active)
{
    return is_active == 1 ? 'text-success' : 'text-secondary';
}

//common events that don't depend on table content
function registerGlobalEvents()
{
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

    //user deletion modal
    const userDeletionConfirmationModal= document.getElementById('deleteUserConfirmation');

    userDeletionConfirmationModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget
        const user_id= button.getAttribute('data-bs-user-id')
        const username = button.getAttribute('data-bs-username');

        // Update the modal's content.
        const usernamePlaceholder = userDeletionConfirmationModal.querySelector('.userNameToDelete')

        usernamePlaceholder.textContent = `"${username}"`;
        userDeletionConfirmationModal.setAttribute('data-user-id', user_id);
    });
}

/**
 * Validates the selected rows and action and returns true if they are valid
 * */
function validateGroupAction(selected_action, user_ids)
{
    let message = "";

    if(user_ids.length === 0) {
        message += "<p>Select at least one user to perform the action on</p>";
    }

    if(selected_action === "") {
        message += "<p>Select an action to perform</p>";
    }

    if(message !== "") {
        $("#errorAlert .modal-body").html(message);

        const errorModal = new bootstrap.Modal(document.getElementById('errorAlert'), {});
        errorModal.show();

        return false;
    }

    return true;
}

function massDeleteUsers()
{
    $.post(`http://localhost:8000/group_actions/delete.php?users=` + selected_user_ids.join(','), (data) => {
        const response = JSON.parse(data);

        if(response.status != true) {
            $("#errorAlert .modal-body").html(response.error);
            const errorModal = new bootstrap.Modal(document.getElementById('errorAlert'), {});
            errorModal.show();

            return false;
        }

        for (const user_id of selected_user_ids)
        {
            userCollection.remove(user_id); //patch each record
        }

        const confirmationModal = bootstrap.Modal.getInstance(
            document.getElementById('userMassDeletionConfirmation')
        );
        confirmationModal.hide();

        selected_user_ids = [];
        $("#selectAll").prop('checked', false);
    })
}

function groupAction(group_action_id)
{
    //group_action_id is used to find in which panel - top or bottom, the action was called to target the specific select-box
    const selected_action = $(`.group-action[data-group-action-id=${group_action_id}] select`).val(); //actions are one of ["", "activate", "deactivate", "delete"]

    if(validateGroupAction(selected_action, selected_user_ids) === false) {
        return;
    }

    if(selected_action === "activate" || selected_action === "deactivate") {
        const is_active = selected_action === "activate" ? 1 : 0;

        $.post(`http://localhost:8000/group_actions/modify_active.php?status=${is_active}&users=` + selected_user_ids.join(','), (data) => {
            const response = JSON.parse(data);

            if(response.status != true) {
                $("#errorAlert .modal-body").html(response.error);
                const errorModal = new bootstrap.Modal(document.getElementById('errorAlert'), {});
                errorModal.show();

                return false;
            }

            for (const user_id of selected_user_ids)
            {
                //patch each record
                let user_record = userCollection.get(user_id);
                userCollection.set({...user_record, status: is_active});
            }
        })
    }

    if(selected_action === "delete") {
        const confirmationModal = new bootstrap.Modal(document.getElementById('userMassDeletionConfirmation'), {});
        confirmationModal.show();
    }
}

function openUserRecordModal(user_record = null)
{
    if(user_record == null) {
        //in case we are adding a record - clear modal fields and errors and change the modal title
        $("#userRecord .modal-title").text("Create user");
        $("#userRecord").attr("data-user-record-id", "");

        $("#user-record-form #user-first-name").val('');
        $("#user-record-form #user-last-name").val('');
        $("#user-record-form #user-status").val('1');
        $("#user-record-form #user-role").val('user');
    } else {
        //in case we are editing a record - prefill
    }

    const userRecordModal = new bootstrap.Modal(document.getElementById('userRecord'), {});
    userRecordModal.show();
}

$(document).ready(function () {
    registerGlobalEvents();

    //user management form needs to be modified to be able to be validated manually
    $("#user-record-form").on("submit", function(event) {
        const form = this;   // DOM element access

        event.preventDefault();
        event.stopPropagation();

        //clear all errors before sending the form
        $("#user-record-form #user-first-name").removeClass('border-danger');
        $("#user-record-form #user-first-name ~ .invalid-feedback").hide();

        $("#user-record-form #user-last-name").removeClass('border-danger');
        $("#user-record-form #user-last-name ~ .invalid-feedback").hide();

        $("#user-record-form #user-status").removeClass('border-danger');
        $("#user-record-form #user-status ~ .invalid-feedback").hide();

        $("#user-record-form #user-role").removeClass('border-danger');
        $("#user-record-form #user-role ~ .invalid-feedback").hide();

        //if no user id is specified - then we are creating a new record
        const is_creation_form = $("#userRecord").attr("data-user-record-id") == "";

        const form_url = is_creation_form ? "http://localhost:8000/actions/create.php" : "http://localhost:8000/actions/update.php";
        let form_data = {
            first_name: $("#user-record-form #user-first-name").val(),
            last_name: $("#user-record-form #user-last-name").val(),
            status: $("#user-record-form #user-status").val(),
            role: $("#user-record-form #user-role").val()
        };

        if(is_creation_form === false) {
            form_data.user_record_id = $("#userRecord").attr("data-user-record-id");
        }

        $.post(form_url, form_data, (data) => {
            const response = JSON.parse(data);

            if(Number(response.error_code) !== 0) {
                if(response.errors['first_name']) {
                    $("#user-record-form #user-first-name").addClass('border-danger');
                    $("#user-record-form #user-first-name ~ .invalid-feedback").text(response.errors['first_name']);
                    $("#user-record-form #user-first-name ~ .invalid-feedback").show();
                }

                if(response.errors['last_name']) {
                    $("#user-record-form #user-last-name").addClass('border-danger');
                    $("#user-record-form #user-last-name ~ .invalid-feedback").text(response.errors['last_name']);
                    $("#user-record-form #user-last-name ~ .invalid-feedback").show();
                }

                if(response.errors['status']) {
                    $("#user-record-form #user-status").addClass('border-danger');
                    $("#user-record-form #user-status ~ .invalid-feedback").text(response.errors['status']);
                    $("#user-record-form #user-status ~ .invalid-feedback").show();
                }

                if(response.errors['role']) {
                    $("#user-record-form #user-role").addClass('border-danger');
                    $("#user-record-form #user-role ~ .invalid-feedback").text(response.errors['role']);
                    $("#user-record-form #user-role ~ .invalid-feedback").show();
                }

                return;
            }

            const userRecordModal = bootstrap.Modal.getInstance(
                document.getElementById('userRecord')
            );
            userRecordModal.hide();

            const successAlertModal = new bootstrap.Modal(document.getElementById('successAlert'), {});
            $("#successAlert .modal-body").text("The user was successfully created");
            successAlertModal.show();

            userCollection.set(response.user);
        });
    });

    //load initial data - Prefill users table with initial data
    $.post("http://localhost:8000/queries/get_all_users.php", (data) => {
        const response = JSON.parse(data);

        for (const user_record of response) {
            userCollection.set(user_record);
        }
    });
});