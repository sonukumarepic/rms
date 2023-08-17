import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEye, FaInfoCircle, FaMoneyBill, FaRegEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import UserProfile from "../../../components/UserProfile";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

const Datacenter = () => {
  const { state } = useLocation();
  useEffect(() => {
    if (state) {
      setFilteredData("");
    }
  }, [state]);
  // console.log("state",state)

  const [projectName, setProjectName] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [categoryList, setCategoryList] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [departmentList, setDepartmentList] = useState("");
  const [department, setDepartment] = useState("");
  const [recruitmentType, setRecruitmentType] = useState("");
  const [jobRecruitmentData, setJobRecruitmentData] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [status, setStatus] = useState("");
  const [listForm, setListForm] = useState("");
  const [qualificationList, setQualificationList] = useState("");
  const [qualification, setQualification] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [jobId, setJobId] = useState("");
  const [filteredData, setFilteredData] = useState("");

  // console.log("location search",locationSearch)
  // console.log("hod search",hodSearch)

  useEffect(() => {
    document.title = "CIPL || Datacenter";
  }, []);
  const jsonData = JSON.parse(localStorage.getItem("data"));
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;
  const getData = async () => {
    // alert("Data called")
    const getApiData = await axios.get(`${process.env.REACT_APP_API_URL}erf`, {
      headers: {
        Authorization: `${authorize}`,
      },
    });
    const apiResonse = await getApiData.data;
    // console.log('JOb response',apiResonse)
    if (apiResonse?.code === 200) {
      // if(jsonData?.data?.roles[0]?.name==="admin")
      // {
      //   setListForm(apiResonse?.data)
      // }else{
      //   // const filterData =response?.data?.filter(x=>parseInt(x?.user_id)===parseInt(localData?.data?.id) || x?.jobassigned?.filter((y)=>parseInt(y?.user_id)===localData?.data?.id))
      //   const filterData=apiResonse?.data?.filter(x =>
      //     parseInt(x?.user_id) === parseInt(jsonData?.data?.id) ||
      //     x?.jobassigned?.some(y => parseInt(y?.user_id) === jsonData?.data?.id)
      //   )
      //   setListForm(filterData)
      // }
      // const customFilter = apiResonse?.data?.filter((x)=>x?.erfstatus!==2)
      setListForm(apiResonse?.data);
    }
  };

  useEffect(() => {
    getData();
    getDepartment();
    categoryListApi();
    getQualificationApi();
  }, []);

  const categoryListApi = async () => {
    const getApiData = await axios.get(
      `${process.env.REACT_APP_API_URL}jobcategories`,
      {
        headers: {
          Authorization: `${authorize}`,
        },
      }
    );
    const apiResonse = await getApiData?.data;
    // console.log("API Response", apiResonse)
    if (apiResonse?.code === 200) {
      setCategoryList(
        apiResonse?.data.map((x) => ({ label: x?.name, value: x?.id }))
      );
    } else {
      console.log("Api Response", apiResonse);
    }
    // console.log("API Response", apiResonse.data);
  };

  const getDepartment = async () => {
    const request = await fetch(`${process.env.REACT_APP_API_URL}department`, {
      method: "GET",
      headers: {
        Authorization: `${authorize}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const jsonResponse = await request?.json();
    // console.log("department",jsonResponse )

    if (jsonResponse) {
      setDepartmentList(
        jsonResponse?.data?.map((x) => ({ value: x?.id, label: x?.name }))
      );
    }
  };

  const getQualificationApi = async () => {
    const request = await fetch(
      `${process.env.REACT_APP_API_URL}qualification`,
      {
        method: "GET",
        headers: {
          Authorization: `${authorize}`,
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const jsonResponse = await request?.json();
    // console.log("qualification",jsonResponse )

    if (jsonResponse) {
      setQualificationList(
        jsonResponse?.data?.map((x) => ({ label: x?.name, value: x?.id }))
      );
    }
  };
  const getAssigneeData = async () => {
    // console.log("Jobd ID",jobId)
    setLoading(true);
    const formdata = new FormData();
    formdata.append("pid", state && state === "pid" ? jobId : "");
    formdata.append(
      "recruitment_type",
      state && state === "type" ? recruitmentType : ""
    );
    formdata.append(
      "location",
      state && state === "location" ? locationSearch : ""
    );
    formdata.append(
      "project_name",
      state && state === "projectName" ? projectName : ""
    );
    formdata.append(
      "project_manager",
      state && state === "projectManager" ? projectManager : ""
    );
    formdata.append(
      "department_id",
      state && state === "department" ? department : ""
    );
    formdata.append(
      "category_id",
      state && state === "category" ? category : ""
    );
    formdata.append(
      "qualification_id",
      state && state === "qualification" ? qualification : ""
    );
    formdata.append(
      "min_budgeted",
      state && state === "minimumBudget" ? minBudget : ""
    );
    formdata.append(
      "max_budgeted",
      state && state === "maximumBudget" ? maxBudget : ""
    );
    formdata.append(
      "start_date",
      state && state === "startDate" ? startDate : ""
    );
    formdata.append("end_date", state && state === "endDate" ? targetDate : "");
    formdata.append("status", state && state === "leadStatus" ? status : "");
    const request = await axios.postForm(
      `${process.env.REACT_APP_API_URL}leaddatasearch`,
      formdata,
      {
        headers: {
          Authorization: `${authorize}`,
        },
      }
    );
    // console.log("Request",request)
    const response = request.data;
    // console.log("response",response)
    if (response?.code === 200) {
      setLoading(false);
      setFilteredData(response?.data);
    }
  };

  const tableHeading = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "PID",
      selector: (row) => row?.job?.pid,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row?.job?.recruitment_type,
      sortable: true,
    },
    {
      name: "Project Name",
      selector: (row) => row?.job?.project_name,
      sortable: true,
    },
    {
      name: "Project Manager",
      selector: (row) => row?.project_manager,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => <div className=" capitalize">{row?.location}</div>,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row?.job?.department?.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.category?.name,
      sortable: true,
    },
    {
      name: "Skills",
      selector: (row) => `${row?.skills?.map((x) => x?.skill?.name)}`,
      sortable: true,
    },
    {
      name: "Qualification",
      selector: (row) => (
        <>
          {row?.qualification?.length > 0
            ? row?.qualification
                ?.map((x) => x?.qualificationdetails?.name)
                ?.join(", ")
            : row?.qualification?.name}
        </>
      ),
      sortable: true,
    },
    {
      name: "Specialization",
      selector: (row) =>
        `${row?.subqualifications?.map((x) => x?.subqualification?.name)}`,
      sortable: true,
    },
    {
      name: "No. of Positions",
      selector: (row) => row?.total_positions,
      sortable: true,
    },
    {
      name: "Budget",
      selector: (row) => row?.position_budgeted,
      sortable: true,
    },
    {
      name: "Requisition Date",
      selector: (row) => row?.start_date,
      sortable: true,
    },
    {
      name: "Target Date",
      selector: (row) => row?.end_date,
      sortable: true,
    },
    {
      name: "Lead Status",
      selector: (row) => (row?.job?.erfstatus === 2 ? "Close" : "Open"),
      sortable: true,
    },
  ];

  const header = [
    { label: "Id", key: "id" },
    { label: "PID", key: "job.pid" },
    { label: "Type", key: "job.recruitment_type" },
    { label: "Project Name", key: "job.project_name" },
    { label: "Project Manager", key: "project_manager" },
    { label: "Location", key: "location" },
    { label: "Department", key: "job.department.name" },
    { label: "Category", key: "category.name" },
    { label: "Skills", key: `skills.name` },
    { label: "Qualification", key: "qualification.name" },
    { label: "Specialization", key: "subqualifications.name" },
    { label: "No. Of Position", key: "total_positions" },
    { label: "Budget", key: "position_budgeted" },
    { label: "Requisition date", key: "job.start_date" },
    { label: "Target Date", key: "job.end_date" },
    { label: "Lead Status", key: "job.status" },
  ];

  const csvDownload =
    filteredData &&
    filteredData?.map((x) => ({
      job: {
        pid: x?.job?.pid,
        recruitment_type: x?.job?.recruitment_type,
        project_name: x?.job?.project_name,
        start_date: x?.start_date,
        end_date: x?.end_date,
        department: {
          name: x?.job?.department?.name,
        },
        status: x?.erfstatus === 0 ? "Close" : "Open",
      },
      project_manager: x?.project_manager,
      location: x?.location,
      category: {
        name: x?.category?.name,
      },
      skills: {
        name: x?.skills?.map((y) => y?.skill?.name),
      },
      qualification: {
        name: x?.qualification?.name,
      },
      subqualifications: {
        name: x?.subqualifications?.map((t) => t?.subqualification?.name),
      },
      total_positions: x?.total_positions,
      position_budgeted: x?.position_budgeted,
    }));

  return (
    <div>
      <ToastContainer />

      <div className="w-full">
        <div className="p-4">
          <div className="grid bg-white w-full border-t-2 my-2 border-gray-900  shadow grid-cols-12">
            {state && state === "pid" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">PID</h2>
                <Select
                  isClearable
                  options={
                    listForm &&
                    listForm?.map((options) => ({
                      value: options?.pid,
                      label: options?.pid,
                    }))
                  }
                  onChange={(e) => {
                    setJobId(e?.value ? e?.value : "");
                    setJobRecruitmentData(
                      e?.jobrecruitmentData ? e?.jobrecruitmentData : ""
                    );
                  }}
                  className="w-full "
                />
              </div>
            ) : null}
            {state && state === "type" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Recruitment Type</h2>
                <select
                  onChange={(e) => setRecruitmentType(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                >
                  <option>Choose Option</option>
                  <option>Inhouse</option>
                  <option value={"onsite"}>Project</option>
                </select>
              </div>
            ) : null}
            {state && state === "projectName" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Project Name</h2>
                <input
                  type="text"
                  onChange={(e) => setProjectName(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ) : null}
            {state && state === "projectManager" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Project Manager</h2>
                <input
                  type="text"
                  onChange={(e) => setProjectManager(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ) : null}
            {state && state === "location" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Location</h2>
                <input
                  type="text"
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ) : null}
            {state && state === "department" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Department</h2>
                <Select
                  isClearable
                  options={departmentList && departmentList}
                  onChange={(e) => setDepartment(e?.value ? e?.value : "")}
                  className="w-full"
                />
              </div>
            ) : null}
            {state && state === "category" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Category</h2>
                <Select
                  isClearable
                  options={categoryList && categoryList}
                  onChange={(e) => setCategory(e?.value ? e?.value : "")}
                  className="w-full"
                />
              </div>
            ) : null}
            {state && state === "qualification" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Qualification</h2>
                <Select
                  isClearable
                  options={qualificationList && qualificationList}
                  onChange={(e) => setQualification(e?.value ? e?.value : "")}
                  className="w-full"
                />
              </div>
            ) : null}
            {state && state === "minimumBudget" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Minimum Budget</h2>
                <input
                  type="number"
                  onChange={(e) => setMinBudget(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ) : null}
            {state && state === "maximumBudget" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Maximum Budget</h2>
                <input
                  type="number"
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ) : null}
            {state && state === "startDate" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Req. Date</h2>
                <input
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ) : null}
            {state && state === "endDate" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Target Date</h2>
                <input
                  type="date"
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ) : null}
            {state && state === "recruiter" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Recruiter</h2>
                <input
                  type="text"
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ) : null}
            {state && state === "leadStatus" ? (
              <div className="p-4 col-span-3">
                <h2 className="my-1 text-lg">Lead Status</h2>
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                >
                  <option value="">Choose Option</option>
                  <option value="1">Open</option>
                  <option value="2">Close</option>
                </select>
              </div>
            ) : null}
            <div className="p-4 col-span-1 flex items-end pb-5">
              <button
                onClick={() => getAssigneeData()}
                className="px-8 py-2 hover:bg-gray-900 cursor-pointer bg-primary rounded-sm text-white"
              >
                Search
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 bg-white border-t-2 my-2 border-gray-900 shadow ">
            <div className="p-4 flex justify-end items-center">
              {filteredData.length > 0 ? (
                <CSVLink
                  headers={header}
                  data={csvDownload && csvDownload}
                  filename="data"
                  className="px-8 py-2 hover:bg-gray-900 cursor-pointer bg-primary rounded-sm text-white"
                >
                  Export
                </CSVLink>
              ) : (
                <button className="px-8 py-2 hover:bg-gray-900 cursor-pointer bg-primary rounded-sm text-white">
                  No Data Available
                </button>
              )}
            </div>
            <DataTable columns={tableHeading} data={filteredData} pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Datacenter;
