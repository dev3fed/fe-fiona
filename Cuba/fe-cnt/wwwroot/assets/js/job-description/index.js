function getDataList(data) {
  data.forEach((item) => {
    getSelect2(item);
  });
}

async function getAllListData() {
  const data = {};
  data.listDraftRasci = (await draftRasciMatrix()).data.data;
  data.listDraftJobDesc = (await listDraftJobDesc(1, 99)).data;
  return data;
}

function detailDraft(id) {
  window.location.href = `/job-description/draft-detail?draftId=${id}`;
}

async function deleteDraft(id) {
  const deleteDraft = await deleteDraftJobDesc(id);
  if (deleteDraft) {
    swal("Success", "Draft has been deleted", "success");
  }
}

$(document).ready(async function () {
  const listData = await getAllListData();
  getDataList([
    {
      dataId: "selectDraftRacsi",
      data: listData.listDraftRasci.map((item) => ({ id: item.draftId, text: item.draftName })),
      dropdownParent: $("#modalCreateDraftJobDesc"),
    },
    {
      dataId: "selectJobDescDraft",
      data: listData.listDraftJobDesc.map((item) => ({ id: item.draftId, text: item.draftName })),
      // dropdownParent: $("#modalDetailDraft"),
    },
  ]);

  // event index.js
  $("#createJobDesc").click(function () {
    window.location.href = "/job-description/detail";
  });

  $("#createDraft").click(function () {
    $("#modalCreateDraftJobDesc").modal("show");
  });

  $("#saveDraft").click(async function () {
    const rasciDraftSelected = $("#selectDraftRacsi").val();
    const draftName = $("#inputDraftName").val();

    if (!rasciDraftSelected || !draftName) {
      alert(!rasciDraftSelected ? "Please select a draft RASCI matrix." : "Please enter a draft name.");
      return;
    }

    const save = await postDraftJobDesc({
      draftSOId: "f5a33bf6-3e21-4778-ae55-e9ec2b0a0dd5",
      // draftRasciId: "823e8ea2-904c-4aa9-b3ef-b2db2d674e80",
      draftRasciId: rasciDraftSelected,
      draftName: draftName,
    });
    if (save) {
      swal("Success", `Draft ${draftName} has been created`, "success");
      hideModal("modalCreateDraftJobDesc");
    } else {
      alert("Error saving draft RASCI matrix");
    }
  });

  getTableListDraft(listData.listDraftJobDesc);
});
