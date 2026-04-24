<!DOCTYPE html>
<html>
<head>
    <title>User management system</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

    <!-- JQuery -->
    <script src="node_modules/jquery/dist/jquery.min.js"></script>

    <!-- Custom Styling -->
    <link rel="stylesheet" href="css/index.css">

    <!-- Custom Script -->
    <script src="js/index.js"></script>
</head>
<body>
    <table class="table">
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
            <!--<tr>
                <th>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="">
                    </div>
                </th>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
            </tr>-->
        </tbody>
    </table>

</body>
</html>