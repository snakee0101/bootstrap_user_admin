let selected_user_ids = [];

function flashRow(record_id) {
    //since row is not inserted immediately - we need a timeout
    setTimeout(() => {
        const row = $(`#users_table tbody tr[data-id="${record_id}"] td, #users_table tbody tr[data-id="${record_id}"] th`);

        row.addClass('flash');
        setTimeout(() => row.removeClass('flash'), 600);
    }, 100);
}

function updateSelectAllState()
{
    //use intermediate state when not all items are checked and checked state when all items are checked
    const total = $(".user-selection").length;
    const checked = $(".user-selection:checked").length;

    $("#selectAll")
        .prop("checked", checked === total && total > 0)
        .prop("indeterminate", checked > 0 && checked < total);
}

function onUserSelectionChange()
{
    //track selected user ids - Save/remove selected user id to/from array when checking/unchecking a checkbox in the table
    const id = Number(this.value);

    if (this.checked) {
        if (!selected_user_ids.includes(id)) {
            selected_user_ids.push(id);
        }
    } else {
        selected_user_ids = selected_user_ids.filter(x => x !== id);
    }

    updateSelectAllState();
}

class UserReactiveCollection
{
    users = new Map();

    set(record)
    {
        //user record structure: {"id":5,"first_name":"Charlie","last_name":"Davis","status":1,"role":"admin"}
        this.users.set(record.id, record);

        //update table rows - checked state must be preserved when updating the table
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
            <a href="#" onclick="openUserRecordModal(${record.id})" class="me-2"><i class="bi bi-pencil-square"></i></a>
            <a href="#" data-bs-toggle="modal" data-bs-target="#deleteUserConfirmation" data-bs-user-id="${record.id}" data-bs-username="${record.first_name} ${record.last_name}"><i class="bi bi-trash3 text-danger"></i></a>
          </td>`;

        if($(`#users_table tbody tr[data-id="${record.id}"]`).length === 0) {
            $("#users_table tbody").append(`<tr data-id="${record.id}">${updatedRowContent}</tr>`); //if the row with this user id doesn't exist in the table - create a row
        } else {
            $(`#users_table tbody tr[data-id="${record.id}"]`).html(updatedRowContent); //otherwise - replace the row content
        }

        $(`#users_table tbody tr[data-id="${record.id}"] .user-selection`).off('change').change(onUserSelectionChange); //re-register user selection event for new row

        updateSelectAllState();
    }

    get(user_id)
    {
        return this.users.get(user_id);
    }

    remove(user_id)
    {
        this.users.delete(user_id);

        $(`#users_table tbody tr[data-id=${user_id}]`).remove(); //as well as the table row
        updateSelectAllState();
    }
}

let userCollection = new UserReactiveCollection();

//general-purpose methods

function deleteUser()
{
    const user_id = $("#deleteUserConfirmation").attr("data-user-id");

    $.post("/actions/delete.php?user_id=" + user_id, (data) => {
        $('#deleteUserConfirmation').modal('hide');

        userCollection.remove(user_id);
        selected_user_ids = [];
    });
}

function getStatusClassname(is_active)
{
    return is_active == 1 ? 'text-success' : 'text-secondary';
}

//common events that don't depend on table content
function registerGlobalEvents()
{
    //When "Select All" checkbox ends up is checked state - manually click on those checkboxes that are unchecked (so it works only one-way)
    $("#selectAll").change(function () {
        const targetCheckedState = this.checked;

        $("#users_table .user-selection").each(function () {
            $(this).prop("checked", targetCheckedState);
        });

        selected_user_ids = targetCheckedState ? userCollection.users.keys().toArray() : [];
    });

    //user deletion modal
    $("#deleteUserConfirmation").on('show.bs.modal', function(event) {
        const username = $(event.relatedTarget).attr('data-bs-username');

        $(this).find('.userNameToDelete').text(`"${username}"`);
        $(this).attr('data-user-id', $(event.relatedTarget).attr('data-bs-user-id'));
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
    $.post(`/group_actions/delete.php?users=` + selected_user_ids.join(','), (data) => {
        const response = JSON.parse(data);

        if(response.status != true) {
            $("#errorAlert .modal-body").html(response.error.message);
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

        $.post('/group_actions/modify_active.php', {
            users: selected_user_ids,
            status: is_active
        }).done((data) => {
            const response = JSON.parse(data);

            if(response.status != true) {
                $("#errorAlert .modal-body").html(response.error.message);
                const errorModal = new bootstrap.Modal(document.getElementById('errorAlert'), {});
                errorModal.show();

                return false;
            }

            for (const user_id of selected_user_ids)
            {
                //patch each record
                let user_record = userCollection.get(user_id);
                userCollection.set({...user_record, status: is_active});

                flashRow(user_id);
            }
        })
    }

    if(selected_action === "delete") {
        const confirmationModal = new bootstrap.Modal(document.getElementById('userMassDeletionConfirmation'), {});
        confirmationModal.show();
    }
}

function openUserRecordModal(user_id = null)
{
    //clear all errors on opening the form
    $("#user-record-form .invalid-feedback").hide();
    $("#user-record-form input[type='text'], #user-record-form select").removeClass('border-danger');

    if(user_id == null) {
        //in case we are adding a record - clear modal fields and change the modal title
        $("#userRecord .modal-title").text("Create user");
        $("#userRecord").attr("data-user-record-id", "");

        $("#user-record-form #user-first-name").val('');
        $("#user-record-form #user-last-name").val('');
        $("#user-record-form #user-status").prop('checked', true);
        $("#user-record-form #user-role").val('user');
    } else {
        let user_record = userCollection.get(user_id);

        //in case we are editing a record - prefill
        $("#userRecord .modal-title").text("Edit user");
        $("#userRecord").attr("data-user-record-id", user_record.id);

        $("#user-record-form #user-first-name").val(user_record.first_name);
        $("#user-record-form #user-last-name").val(user_record.last_name);
        $("#user-record-form #user-status").prop("checked", Number(user_record.status) === 1);
        $("#user-record-form #user-role").val(user_record.role);
    }

    const userRecordModal = new bootstrap.Modal(document.getElementById('userRecord'), {});
    userRecordModal.show();
}

$(document).ready(function () {
    registerGlobalEvents();

    //user management form needs to be modified to be able to be validated manually
    $("#user-record-form").on("submit", function(event) {
        event.preventDefault();
        event.stopPropagation();

        //clear all errors before sending the form
        $("#user-record-form .invalid-feedback").hide();
        $("#user-record-form input[type='text'], #user-record-form select").removeClass('border-danger');

        //if no user id is specified - then we are creating a new record
        const is_creation_form = $("#userRecord").attr("data-user-record-id") == "";

        const form_url = is_creation_form ? "/actions/create.php" : "/actions/update.php";
        let form_data = {
            first_name: $("#user-record-form #user-first-name").val(),
            last_name: $("#user-record-form #user-last-name").val(),
            status: $("#user-record-form #user-status").is(':checked') ? 1 : 0,
            role: $("#user-record-form #user-role").val()
        };

        if(is_creation_form === false) {
            form_data.user_record_id = $("#userRecord").attr("data-user-record-id");
        }

        $.post(form_url, form_data, (data) => {
            const response = JSON.parse(data);

            if(response.error != null || response.errors != null) {
                const errors = response.error ? [response.error] : response.errors;
                let error = null;

                if((error = errors.find(err => err.field == "first_name")) !== undefined) {
                    $("#user-record-form #user-first-name").addClass('border-danger');
                    $("#user-record-form #user-first-name ~ .invalid-feedback").text(error.message).show();
                }

                if((error = errors.find(err => err.field == "last_name")) !== undefined) {
                    $("#user-record-form #user-last-name").addClass('border-danger');
                    $("#user-record-form #user-last-name ~ .invalid-feedback").text(error.message).show();
                }

                if((error = errors.find(err => err.field == "status")) !== undefined) {
                    $("#user-record-form .user-status-container ~ .invalid-feedback").text(error.message).show();
                }

                if((error = errors.find(err => err.field == "role")) !== undefined) {
                    $("#user-record-form #user-role").addClass('border-danger');
                    $("#user-record-form #user-role ~ .invalid-feedback").text(error.message).show();
                }

                return;
            }

            const userRecordModal = bootstrap.Modal.getInstance(
                document.getElementById('userRecord')
            );
            userRecordModal.hide();

            if(is_creation_form === true) {
                flashRow(response.user.id);
            }

            userCollection.set(response.user);
            if(is_creation_form === false) {
                flashRow($("#userRecord").attr("data-user-record-id"));
            }
        });
    });

    //load initial data - Prefill users table with initial data
    $.post("/queries/get_all_users.php", (data) => {
        const response = JSON.parse(data);

        for (const user_record of response) {
            userCollection.set(user_record);
        }
    });
});