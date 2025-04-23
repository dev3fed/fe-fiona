function modalConfrimHelper(type, titleModal, message, note, action, modalSize, paramsId) {
    $("#modalConfirmTitle").html("");
    $("#modalConfirmBody").html("");
    $("#modalConfirmFooter").html("");

let icon = type == "delete" ? '<i class="fas fa-exclamation-triangle text-danger"></i>' : type == "success" ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-exclamation-circle text-warning"></i>';
let title = `<span class="p-l-10">` + titleModal + `</span>`;
    $("#modalConfirmTitle").html(icon + title);
    $("#modalConfirmBody").html(
        `<div class="f-14" role="alert">` +
        message +
        `
        </div>`
    );

if (note) {
    $("#modalConfirmBody").append(
    `<div class="alert alert-danger-custom m-t-10" role="alert">
        <strong>Note:</strong> ` +
        note +
        `
    </div>`
    );
}

if (action) {
    action.forEach((item) => {
    if (item.callback) {
        $("#modalConfirmFooter").append(
        `<button type="button" class="btn ` +
            item.className +
            ` m-r-5" onclick="(` +
            item.callback +
            `)()">` +
            item.button +
            `</button>`
        );
        return;
    }
    $("#modalConfirmFooter").append(
        `<button type="button" class="btn ` +
        item.className +
        ` m-r-5" onclick="(async () => { await ${item.callbackFunction}(\`${paramsId}\`); })()">` +
        item.button +
        `</button>`
    );
    });
}

    if (modalSize) {
        $("#modalConfirm").find(".modal-confirm").css("width", modalSize).css("max-width", modalSize);
    } else {
        $("#modalConfirm").find(".modal-confirm").css("width", "50%").css("max-width", "50%");
    }

$("#modalConfirm").modal("show");
}

function hideModal(id) {
    $("#" + id).modal("hide");
}