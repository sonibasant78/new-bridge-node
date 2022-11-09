console.log("lawde lag gaye...");
function getInterestID(ref) {
  const id = $(ref).attr("data-id");
  console.log("id ", id);
  document.getElementById("interest_id").value = id;
  $("#editEmployeeModal").modal("show");
}
function closeModal() {
  $("#editEmployeeModal").modal("hide");
}


function getSchoolID(ref) {
    const id = $(ref).attr("data-id");
    console.log("id ", id);
    document.getElementById("school_id").value = id;
    $("#editEmployeeModal").modal("show");
  }
  function closeModal() {
    $("#editEmployeeModal").modal("hide");
  }


function getEducationID(ref) {
    const id = $(ref).attr("data-id");
    console.log("id ", id);
    document.getElementById("education_id").value = id;
    $("#editEmployeeModal").modal("show");
  }
  function closeModal() {
    $("#editEmployeeModal").modal("hide");
  }


function getExperienceID(ref) {
    const id = $(ref).attr("data-id");
    console.log("id ", id);
    document.getElementById("experience_id").value = id;
    $("#editEmployeeModal").modal("show");
  }
  function closeModal() {
    $("#editEmployeeModal").modal("hide");
  }