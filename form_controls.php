<?php

echo <<<ACTION
<div class="d-flex justify-content-between">
    <button type="button" class="btn btn-success btn-sm" onclick="openUserRecordModal()">Add</button>
    <div class="d-flex justify-content-between gap-2 group-action" data-group-action-id="$group_action_id">
        <select class="form-control-sm w-100">
            <option value="">-Please Select-</option>
            <option value="activate">Set active</option>
            <option value="deactivate">Set not active</option>
            <option value="delete">Delete</option>
        </select>
        <button type="button" class="btn btn-primary btn-sm" onclick="groupAction($group_action_id)">OK</button>
    </div>
</div>
ACTION;