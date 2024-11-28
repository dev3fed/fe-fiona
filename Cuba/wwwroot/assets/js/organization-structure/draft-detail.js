// $(document).ready(function () { make it asynch
$(document).ready(async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const draftId = urlParams.get("draftId");
  const res = await detailDraftOrganizationStructure(draftId);

  const draft = res.data?.draft;
  const draftDetail = res.data?.draftDetail;
  const draftSubordinate = res.data?.listJobSubordinate;
  const draftSgSsg = res.data?.listJobSssg;

  $("#draftName").text(draft?.draftName);
  $("#requestId").text(draft?.requestId);
  $("#createdBy").text(draft?.createBy);
  $("#createdDate").text(draft?.createdAt);
  $("#draftType").text(draft?.typeDetail);

  $("#positionName").text(draftDetail?.positionName ?? "-");
  $("#abbrvPosition").text(draftDetail?.abbrvPosition ?? "-");
  $("#orgUnitName").text(draftDetail?.orgUnitName ?? "-");
  $("#orgPrl").text(draftDetail?.prlOrg ?? "-");
  $("#formation").text(draftDetail?.formation ?? "-");
  $("#careerType").text(draftDetail?.careerType ?? "-");
  $("#careerLevel").text(draftDetail?.careerLevel ?? "-");
  $("#basket").text(draftDetail?.isBasket == true ? "Yes" : "No");
  // $("#directReport").text("Direktur Perencanaan & Pengembangan Bisnis");
  $("#directReport").text(draftDetail?.directReport ?? "-");
  $("#neckFunction").text(draftDetail?.neckFunction == true ? "Yes" : "No");
  $("#isProject").text(draftDetail?.isProject == true ? "Yes" : "No");
  $("#coordination").text(draftDetail?.isCoordination == true ? "Yes" : "No");
  $("#coordinationWith").text(draftDetail?.coordinationWith ?? "-");
  $("#directorate").text(draftDetail?.function == "null" ? "-" : draftDetail?.section);
  $("#division").text(draftDetail?.division == "null" ? "-" : draftDetail?.section);
  $("#subdivision").text(draftDetail?.subDivision == "null" ? "-" : draftDetail?.section);
  $("#department").text(draftDetail?.department == "null" ? "-" : draftDetail?.section);
  $("#section").text(draftDetail?.section == "null" ? "-" : draftDetail?.section);
  $("#personnelAreaName").text(
    draftDetail?.personalAreaName == "null" || draftDetail?.personalAreaName == "" ? "-" : draftDetail?.personalAreaName
  );

  // listJobSubordinate
  const data = draftSubordinate.length > 0 ? draftSubordinate : [];
  getTablePositionDetail(data);
  console.log("draftSgSsg", draftSgSsg);

  $("#mainSkillGroup").text(draftSgSsg?.mainSg?.text ?? "-");
  $("#mainSubSkillGroup").text(draftSgSsg?.mainSsg?.text ?? "-");
  $("#secondSkillGroup").text(draftSgSsg?.secondSg?.text ?? "-");
  $("#secondSubSkillGroup").text(draftSgSsg?.secondSsg?.text ?? "-");
  $("#thirdSkillGroup").text(draftSgSsg?.thirdSg?.text ?? "-");
  $("#thirdSubSkillGroup").text(draftSgSsg?.thirdSsg?.text ?? "-");

  detailChartPreview("os-preview-container", draftDetail?.directReport, res.data);
});
