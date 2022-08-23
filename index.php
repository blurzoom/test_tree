<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="app.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
</head>
<body>
<div class="container pt-5">
    <button id="start" onclick="add_root()">Create Root</button>
    <ul id="app" class="m-5"> <!--start point Tree-->
    </ul>
    <!-- Button trigger modal -->
    <!--<button type="button" onclick="show()" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">-->
    <!--    Launch demo modal-->
    <!--</button>-->

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">

                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer justify-content-between">
                    <div id="timer" class="text-danger d-none">20
                    </div>
                    <div>
                        <button type="button" id="delete" data-id="10" onclick="remove()"
                                class="btn btn-primary d-none">Yes I
                            am
                        </button>
                        <button type="button" id="update" data-id="10" onclick="update()"
                                class="btn btn-primary d-none">Update change
                        </button>
                        <button type="button" onclick="hide()" class="btn btn-secondary" data-dismiss="modal">No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="app.js"></script>

</body>
</html>
