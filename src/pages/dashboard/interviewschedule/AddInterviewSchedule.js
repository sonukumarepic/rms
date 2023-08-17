import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiErrorPopUp from "../../../components/ApiErrorPopUp";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

const AddInterviewSchedule = () => {
  const [candidateList, setCandidateList] = useState("");
  const { state } = useLocation();
  console.log("state", state);
  const [jobId, setJobId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [employeeList, setEmployeeList] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [comments, setComments] = useState("");
  const [erfData, setErfData] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [title, setTitle] = useState("");
  const [showApiErrorPopUp, setShowApiErrorPopUp] = useState("");
  const [apiError, setApiError] = useState("");
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("location data",location)
  const data = localStorage.getItem("data");
  const jsonData = JSON.parse(data);
  const accessToken = jsonData.access_token;
  const authorize = "Bearer" + " " + accessToken;

  const getErfData = async () => {
    // alert("Data called")
    const getApiData = await axios.get(`${process.env.REACT_APP_API_URL}erf`, {
      headers: {
        Authorization: `${authorize}`,
      },
    });
    const apiResonse = await getApiData?.data;

    if (apiResonse) {
      // if(jsonData?.data?.roles[0]?.name==="admin")
      // {
      //   setErfData(apiResonse?.data)
      // }else{
      //   console.log('local storage',jsonData?.data?.id)
      //   const filterData=apiResonse?.data?.filter(x =>
      //     parseInt(x?.user_id) === parseInt(jsonData?.data?.id) ||
      //     x?.jobassigned?.some(y => parseInt(y?.user_id) === jsonData?.data?.id)
      //   )
      //   setErfData(filterData)
      // }
      // const customFilter = apiResonse?.data?.filter((x)=>x?.erfstatus!==2)
      setErfData(apiResonse?.data);
    }
  };

  const getData = async () => {
    const getApiData = await axios.get(`${baseUrl}interview/getdata`, {
      headers: {
        Authorization: `${authorize}`,
      },
    });
    const apiResonse = await getApiData?.data;
    console.log("API Response", apiResonse);
    if (apiResonse?.code === 200) {
      setCandidateList(apiResonse?.data?.candidates);
      setEmployeeList(apiResonse?.data?.users);
    } else {
      console.log("Api Response", apiResonse);
      setShowApiErrorPopUp(true);
      setApiError(apiResonse?.message);
    }
    // console.log("API Response",apiResonse.data);
  };

  const getAssigneeData = async () => {
    const request = await axios.get(
      `${process.env.REACT_APP_API_URL}job-applications/${jobId}`,
      {
        headers: {
          Authorization: `${authorize}`,
        },
      }
    );
    const response = request?.data;
    console.log("assingee response", response?.data);
    if (response) {
      setFilteredData(response?.data);
    }
  };

  // console.log('filtered data',filteredData)

  useEffect(() => {
    if (jobId) {
      getAssigneeData();
    }
  }, [jobId]);

  useEffect(() => {
    getErfData();
    getData();
  }, [location]);

  useEffect(() => {
    document.title = "CIPLCRM | Add Interview Schedule";
    if (jsonData?.data?.userPermissions.find((a) => a === "add_schedule")) {
      return;
    } else {
      navigate("/admin");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("scheduleTime", scheduleTime);
      formData.append("scheduleDate", scheduleDate);
      formData.append("meeting_title", title);
      formData.append("candidates", candidateId);
      formData.append("interview_type", interviewType);
      formData.append("meetingurl", meetingUrl);
      formData.append("comment", comments);
      formData.append("employees[0]", employeeId);
      formData.append("status", state);
      formData.append("name", name);
      formData.append("email", email);
      const saveInterviewSchedule = await axios.postForm(
        `${baseUrl}interview/store`,
        formData,
        {
          headers: {
            Authorization: `${authorize}`,
            "Content-Type": "multipart/form-data",
            Accept: "js",
          },
        }
      );
      const response = await saveInterviewSchedule.data;
      if (response?.code === 200) {
        console.log("response", response);
        toast.success(`${response?.message}`);
        navigate("/admin/interviewschedule");
      }
    } catch (error) {
      console.log("error", error);
      if (error?.response?.data?.error) {
        const errors = Object.values(error?.response?.data?.error);
        console.log("Errors", errors);
        errors.map((x) => toast.error(`${x}`));
      }
      if (error?.response?.data?.message) {
        if (error?.response?.data?.error) {
          const errors = Object.values(error?.response?.data?.error);
          console.log("Errors", errors);
          errors.map((x) => toast.error(`${x}`));
        }
        if (error?.response?.data?.message) {
          toast.error(`${error?.response?.data?.message}`);
        }
      }
    }
  };

  // console.log("filtered data",filteredData)

  return (
    <>
      <ToastContainer autoClose={3000} position="top-center" />
      {showApiErrorPopUp ? (
        <ApiErrorPopUp
          setModal={setShowApiErrorPopUp}
          error={apiError && apiError}
        />
      ) : null}
      <div className="border rounded border-t-2 border-r-gray-400 border-l-gray-400 border-b-gray-400 border-gray-800 p-4 mx-4 my-2 bg-white">
        <h1 className="text-2xl text-left ">Create Interview Schedule</h1>
        <form onSubmit={handleSubmit}>
          <div className=" w-full flex py-4 items-center">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="w-full mr-1">
                <label className="flex pr-1">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  className="border  w-full px-2 py-2"
                  placeholder={"Enter Interview Title"}
                  onChange={(e) => setTitle(e.target.value.trim())}
                />
              </div>
              <div className="w-full">
                <label className="flex pr-1">
                  Interview Type <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  className="border  w-full px-2 py-2"
                  onChange={(e) => setInterviewType(e.target.value)}
                >
                  <option>Choose Interview Type</option>
                  <option value={"online"}>Online</option>
                  <option value={"offline"}>Offline</option>
                </select>
              </div>
              {interviewType !== "offline" && (
                <div className="w-full mr-1">
                  <label className="flex pr-1">
                    Meeting URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    className="border  w-full px-2 py-2"
                    placeholder={"Enter Meeting URL"}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                  />
                </div>
              )}
              <div className="w-full ">
                <div className="w-full">
                  <label className="flex">
                    PID <span className="text-red-400">*</span>
                  </label>
                  <Select
                    options={
                      erfData &&
                      erfData?.map((options) => ({
                        value: options?.id,
                        label: options?.pid,
                      }))
                    }
                    onChange={(e) => setJobId(e.value)}
                    className="w-full border rounded border-gray-400"
                  />
                </div>
              </div>
              <div className="w-full ">
                <div className="w-full">
                  <label className="flex pr-1">
                    Candidate <span className="text-red-400">*</span>
                  </label>
                  {state === "interview round 1" ? (
                    <Select
                      options={
                        filteredData &&
                        filteredData
                          ?.filter(
                            (x) =>
                              x?.status?.status === "online exam" ||
                              x?.status?.status === "pass"
                          )
                          .filter((y) => y.status?.status !== "hired")
                          .map((options) => ({
                            value: options?.id,
                            label: options?.full_name,
                          }))
                      }
                      onChange={(e) => setCandidateId(e.value)}
                      className="w-full border rounded border-gray-400"
                    />
                  ) : (
                    <Select
                      options={
                        filteredData &&
                        filteredData
                          ?.filter(
                            (x) => x?.status?.status === "interview round 1"
                          )
                          .filter((y) => y.status?.status !== "hired")
                          .map((options) => ({
                            value: options?.id,
                            label: options?.full_name,
                          }))
                      }
                      onChange={(e) => setCandidateId(e.value)}
                      className="w-full border rounded border-gray-400"
                    />
                  )}
                </div>
              </div>
              <div className="w-full ">
                <div className="w-full">
                  <label className="flex pr-1">
                    Interviewer <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    className="w-full border p-2 "
                    onChange={(e) => setEmployeeId(e.target.value)}
                  >
                    <option>Choose Employee</option>
                    {employeeList &&
                      employeeList?.map((candidate) => (
                        <option key={candidate?.id} value={candidate?.id}>
                          {candidate?.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* grid 2 */}
              <div className="w-full flex">
                <div className="w-full mr-1">
                  <label
                    className={
                      "flex pr-1 after:content-[" *
                      "] after:ml-0.5 after:text-red-500"
                    }
                  >
                    Date{" "}
                  </label>
                  <input
                    type="date"
                    required
                    className="border  w-full px-2 py-2"
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div className="w-full ml-1">
                  <label className="flex pr-1">
                    Schedule Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    className="border  w-full px-2 py-2"
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full col-span-2">
                <div className="w-full">
                  <label className="flex pr-1">Comment</label>
                  <textarea
                    type="text"
                    className="border  w-full px-2 py-2"
                    onChange={(e) => setComments(e.target.value.trim())}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="flex my-4 transition-all delay-150 duration-150 px-8 py-2 rounded text-white bg-green-700 hover:bg-green-500"
          >
            <span className="text-xl font-medium">Save</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default AddInterviewSchedule;
