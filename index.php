<!DOCTYPE html>
<html>
<head>
    <title>User management system</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
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
                    <button type="button" class="btn btn-danger btn-sm">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <table class="table" id="users_table">
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

</body>
</html>