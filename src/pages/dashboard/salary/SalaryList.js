import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEye, FaMoneyBill, FaRegEdit } from "react-icons/fa";
import Select from "react-select";
import ApiErrorPopUp from "../../../components/ApiErrorPopUp";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import UserProfile from "../../../components/UserProfile";
import ViewSalary from "./ViewSalary";

const SalaryList = () => {
  const [showSalary, setShowSalary] = useState(false);
  const [iD, setID] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [jobRecruitmentData, setJobRecruitmentData] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [hodSearch, setHodSearch] = useState("");
  const [listForm, setListForm] = useState("");
  const [showEditPopUp, setShowEditPopup] = useState("");
  const [qualification, setQualification] = useState("");
  const [subQualificaiton, setSubQualification] = useState("");
  const [qualificaitonId, setQualificationId] = useState("");
  const [jobId, setJobId] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [profileData, setProfileData] = useState("");
  const navigate = useNavigate();

  // console.log("location search",locationSearch)
  // console.log("hod search",hodSearch)
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
    // console.log('api response',apiResonse)
    if (apiResonse) {
      // if(jsonData?.data?.roles[0]?.name==="admin")
      // {
      //   setListForm(apiResonse?.data)
      // }else{
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
  }, []);

  useEffect(() => {
    if (qualificaitonId) {
      getQualificationApi();
    }
  }, [showEditPopUp]);

  // const getErfLeads = async () => {
  //   const request = await axios.get(`${process.env.REACT_APP_API_URL}leadstest/${state?.id}`, {
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`
  //     }
  //   })
  //   const response = request?.data
  //   if (response?.code === 200) {
  //     setListForm(response?.data)
  //   }
  // }

  // useEffect(()=>{
  //   getErfLeads()
  // },[])

  useEffect(() => {
    if (qualificaitonId) {
      getSubQualificationApi(qualificaitonId);
    }
  }, [showEditPopUp, qualificaitonId]);

  const getSubQualificationApi = async (qualificaitonId) => {
    if (qualificaitonId) {
      const getSubQualification = await fetch(
        `${process.env.REACT_APP_API_URL}subqualification/search`,
        {
          method: "POST",
          headers: {
            Authorization: `${authorize}`,
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            qualification_id: `${qualificaitonId}`,
          }),
        }
      );
      const jsonResponse = await getSubQualification?.json();
      // console.log("Sub Qualification",jsonResponse )

      if (jsonResponse) {
        setSubQualification(jsonResponse?.data);
      }
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
      setQualification(jsonResponse?.data);
    }
  };
  const getAssigneeData = async () => {
    // console.log("Jobd ID",jobId)
    if (jobId !== "" || null || undefined) {
      const formData = new FormData();
      formData.append("location", locationSearch);
      formData.append("project_manager", hodSearch);
      const request = await axios.postForm(
        `${process.env.REACT_APP_API_URL}job-applications/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `${authorize}`,
          },
        }
      );
      // console.log("Request",request)
      const response = request.data;
      // console.log("response",response)
      if (response) {
        setFilteredData(response?.data.filter((x) => x?.salarydetails != null));
      }
    }
    if (jobId === "" || null || undefined) {
      toast.error("Please Select PID");
    }
  };

  console.log("filtered data", filteredData);

  const tableHeading = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => (
        <button
          className="text-blue-700 hover:text-blue-900"
          onClick={() => {
            setShowProfilePopup(!showProfilePopup);
            setProfileData(row);
          }}
        >
          {row?.full_name}
        </button>
      ),
      sortable: true,
    },
    {
      name: "ERF ID",
      selector: (row) => row?.job?.erf_id,
      sortable: true,
    },
    {
      name: "Employee Code",
      selector: (row) => row?.salarydetails?.employeeCode,
      sortable: true,
    },
    {
      name: "Project Name",
      selector: (row) => row?.job?.project_name,
      sortable: true,
    },
    {
      name: "Salary (CTC)",
      selector: (row) => row?.salarydetails?.ctc,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div className=" capitalize">{row?.status?.status}</div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <button>
            <FaEye
              onClick={() => {
                setShowSalary(true);
                console.log("row" ,row?.id);
                setID(row?.id);
              }}
              size={30}
              className="bg-gray-800 text-white m-1 w-6 p-1 h-6 hover:cursor-pointer"
            />
          </button>
        </div>
      ),
    },
    // {
    //   name: 'Action',
    //   selector: row => (
    //     <div className="">
    //     {
    //       <button
    //       onClick={()=>{
    //        setShowEditPopup(true)
    //        setName(row?.full_name)
    //        setEmail(row?.email)
    //        setPhone(row?.phone)
    //        setStatus(row?.status?.id)
    //        setJobId(row?.job_id)
    //        setQualificationId(row?.qualification_id)
    //        setAddress(row?.address)
    //        setSubQualificationId(row?.subqualifications[0]?.id)
    //        setRelvantExp(row?.relevent_exp)
    //        setTotalExp(row?.total_exp)
    //        setCandidateId(row?.id)
    //       }}
    //       >
    //         <FaRegEdit
    //           className="bg-gray-800 m-1 w-6 p-1 h-6 hover:cursor-pointer"
    //           fill="white"
    //           size={30}
    //         />
    //       </button>
    //     }
    //     {
    //       <button
    //         className=""
    //         onClick={async() => {
    //           let text = "Are you really want to delete?"
    //           if (window.confirm(text) === true){
    //             let confirmText = "After deleting the same all related data would be deleted and can not retrive. So before deleting make sure you have back up all related data."
    //             if(window.confirm(confirmText)===true){
    //               await fetch(`${process.env.REACT_APP_API_URL}job-applications/delete/${row?.id}`,
    //               {
    //                 method: "get",
    //                 headers: {
    //                   Authorization: `${authorize}`,
    //                   "Content-type":
    //                     "application/json; charset=UTF-8",
    //                 },
    //               }
    //             );
    //             getAssigneeData()
    //             }
    //           }

    //         }}
    //       >
    //         <AiOutlineDelete
    //           size={30}
    //           className="bg-gray-800 text-white m-1 w-6 p-1 h-6 hover:cursor-pointer"
    //         />
    //       </button>
    //     }
    //     {
    //       <button onClick={()=>navigate('/admin/esic',{state:row})}>
    //         <FaMoneyBill
    //           size={30}
    //           className="bg-gray-800 text-white m-1 w-6 p-1 h-6 hover:cursor-pointer"/>
    //       </button>
    //     }
    //     {/* <button onClick={()=>navigate('/admin/result',{state:row})}>
    //       <FiLayers size={30} className='bg-gray-800 text-white m-1 w-6 p-1 h-6 hover:cursor-pointer' color='white'/>
    //     </button> */}
    //     </div>
    //   ),
    //   sortable: false,
    //   allowOverflow: true
    // },
  ];

  const statusList = [
    {
      id: 1,
      status: "Applied",
    },
    {
      id: 2,
      status: "Online Exam",
    },
    {
      id: 3,
      status: "Interview Round 1",
    },
    {
      id: 4,
      status: "Interview Round 2",
    },
    {
      id: 5,
      status: "Hired",
    },
    {
      id: 6,
      status: "Rejected",
    },
    {
      id: 7,
      status: "Expired",
    },
    {
      id: 8,
      status: "Pass",
    },
    {
      id: 9,
      status: "Fail",
    },
    {
      id: 10,
      status: "Salary Negotiation",
    },
    {
      id: 11,
      status: "Assign Round 1",
    },
    {
      id: 12,
      status: "Assign Round 2",
    },
  ];
  return (
    <div>
      <ToastContainer position="top-center" />
      {showSalary ? (
        <>
          <div className="justify-center h-full items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full h-fit top-[100%] mx-2 mt-4 my-6 max-w-[75%]">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-2xl font-semibold">Salary</h3>
                  <button
                    className="p-1 ml-auto border-0 text-red-500  float-right text-3xl leading-none font-semibold "
                    onClick={() => setShowSalary(false)}
                  >
                    <span className=" text-red-500 h-6 w-6 text-xl block ">
                      X
                    </span>
                  </button>
                </div>
                <div className="w-full px-4">
                  <div className=" w-full flex py-4 items-center">
                    <ViewSalary getDataId={iD} setShowSalary={setShowSalary} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => setShowSalary(false)}
            className="opacity-75 cursor-pointer fixed inset-0 z-40 bg-black"
          ></div>
        </>
      ) : null}
      <div className="w-full">
        <div className="p-4">
          <div className="grid bg-white w-full border-t-2 my-2 border-gray-900  shadow grid-cols-12">
            <div className="p-4 col-span-3">
              <h2
                className={`my-1 text-lg after:content-['*'] after:text-red-500 after:pl-1`}
              >
                PID
              </h2>
              <Select
                isClearable
                options={
                  listForm &&
                  listForm?.map((options) => ({
                    value: options?.id,
                    label: options?.pid,
                    jobrecruitmentData: options?.jobrecruitment,
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
            <div className="p-4 col-span-3">
              <h2 className="my-1 text-lg">Location</h2>
              <Select
                isClearable
                options={
                  jobRecruitmentData &&
                  jobRecruitmentData?.map((options) => ({
                    value: options?.id,
                    label:
                      options?.location === "" || null || undefined
                        ? "NA"
                        : options?.location,
                  }))
                }
                onChange={(e) => setLocationSearch(e?.value ? e?.value : "")}
                className="w-full"
              />
            </div>
            <div className="p-4 col-span-3">
              <h2 className="my-1 text-lg">HOD</h2>
              <Select
                isClearable
                options={
                  jobRecruitmentData &&
                  jobRecruitmentData?.map((options) => ({
                    value: options?.id,
                    label:
                      options?.project_manager === "" || null || undefined
                        ? "NA"
                        : options?.project_manager,
                  }))
                }
                onChange={(e) => setHodSearch(e?.value ? e?.value : "")}
                className="w-full"
              />
            </div>
            <div className="p-4 col-span-2 flex items-end pb-5">
              <button
                onClick={() => getAssigneeData()}
                className="px-8 py-2 hover:bg-gray-900 cursor-pointer bg-primary rounded-sm text-white"
              >
                Search
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 bg-white border-t-2 my-2 border-gray-900 shadow ">
            <DataTable columns={tableHeading} data={filteredData} pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryList;
