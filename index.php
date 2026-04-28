<!DOCTYPE html>
<html>
<head>
    <title>User management system</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">
    <script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="node_modules/bootstrap-icons/font/bootstrap-icons.css">

    <!-- JQuery -->
    <script src="node_modules/jquery/dist/jquery.min.js"></script>

    <!-- Custom Styling -->
    <link rel="stylesheet" href="css/index.css">

    <!-- Custom Script -->
    <script src="js/index.js"></script>
</head>
<body>
    <div class="modal" id="userMassDeletionConfirmation" tabindex="-1" data-user-id="0">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">User mass-deletion confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure to delete the selected users?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="massDeleteUsers()">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="deleteUserConfirmation" tabindex="-1" data-user-id="0">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">User deletion confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure to delete the user <span class="userNameToDelete"></span>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="deleteUser()">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="errorAlert" tabindex="-1" data-user-id="0">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-danger">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        Error
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger btn-sm" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <?php $group_action_id = 1; include "form_controls.php" ?>

    <table class="table table-sm my-2" id="users_table">
        <thead>
            <tr>
                <th scope="col">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="selectAll">
                        <label class="form-check-label" for="selectAll">
                            Select All
                        </label>
                    </div>
                </th>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
                <th scope="col">Role</th>
                <th scope="col">Options</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>

    <?php $group_action_id = 2; include "form_controls.php" ?>

</body>
</html>