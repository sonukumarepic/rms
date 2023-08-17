import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowRight, FiLayers } from "react-icons/fi";
import { FaRegEdit  } from "react-icons/fa";
import { AiOutlineDelete  } from "react-icons/ai";
import Table from "../../../components/Table";
import { useLocation, useNavigate } from "react-router-dom";
import ApiErrorPopUp from "../../../components/ApiErrorPopUp";
import { ToastContainer, toast } from "react-toastify";

const CandidateStore = () => {
    const [archiveData, setArchiveData] = useState("");
    const [contentEdit, setContentEdit] = useState("");
    const [apiError,setApiError] = useState('')
    const [showApiErrorPopUp,setShowApiErrorPopUp] = useState('')
    const [showEditButton,setShowEditButton] = useState(false)
    const [showDeleteButton,setShowDeleteButton] = useState(false)
    const [search,setSearch] = useState("")
    const [editCertification, setEditCertification] = useState("");
    const [showEditCertificationModal, setShowEditCertificationModal] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;
  
    //   console.log("baseurl", baseUrl);
    const data = localStorage.getItem("data");
    const jsonData = JSON.parse(data);
    const accessToken = jsonData?.access_token;
    //   console.log("bearerToken", accessToken);
    const authorize = "Bearer" + " " + accessToken;
    // console.log("authorize", authorize);
    const navigate = useNavigate()
    const location = useLocation()
  
    const getData = async()=>{
      // console.log("Jobd ID",jobId)
      const request = await axios.get(`${process.env.REACT_APP_API_URL}applications-archive`,{
          headers:{
              'Authorization':`${authorize}`
          }
      })
      console.log("Request",request)
      const response = request.data
      if(response){
          setArchiveData(response?.data)
      }
  }
  
    useEffect(() => {
      getData();
      document.title = "CIPLCRM | Candidate Store"
    }, [showEditCertificationModal]);
  
    useEffect(()=>{
      if(jsonData?.data?.userPermissions.find(a=>a === "edit_category"))
      {
        setShowEditButton(true)}
        else{
          setShowEditButton(false)
        }
      (jsonData?.data?.userPermissions.find(a=>a === "delete_category"))?setShowDeleteButton(true):setShowDeleteButton(false)
    },[showEditButton,showDeleteButton])
    
    useEffect(()=>{
      if(jsonData?.data?.userPermissions.find(a=>a === "view_category")){
        return
      }else{
        navigate('/admin')
      }
      
    },[location])
  
    const tableHeading=[
      {
        name: 'S. No.',
        selector: (row, index) => index + 1,
        sortable: false,
      },
      {
        name: 'PID',
        selector: row => row?.job?.pid,
        sortable: true,
        
      },
      {
        name: 'Name',
        selector: row => row?.full_name,
        sortable: true,
        
      },
      {
        name: 'Email',
        selector: row => row?.email,
        sortable: true,
        
      },
      {
        name: 'Phone',
        selector: row => row?.phone,
        sortable: true,
        
      },
      {
        name: 'Qualification',
        selector: row => row?.qualification?.name,
        sortable: true,
        
      },
  
      {
        name: 'Action',
        selector: row => (
          <div className="">
          <button onClick={async()=>
           {
            try {
              const request = await fetch(`${process.env.REACT_APP_API_URL}job-applications/unarchive-job-application/${row?.id}`,
                {
                  method: "post",
                  headers: {
                    Authorization: `${authorize}`,
                    "Content-type":
                      "application/json; charset=UTF-8",
                  },
                }
              )
              const response = await request?.json()
              console.log('response',response)
              if(response?.code ===200){
                toast.success(`${response?.message}`)
                getData()
              }
            } catch (error) {
              console.log('error', error)
              if (error?.response?.data?.error) {
                const errors = Object.values(error?.response?.data?.error)
                console.log('Errors', errors)
                errors.map((x) => (
                  toast.error(`${x}`)
                ))
              }
              if (error?.response?.data?.message) {
                if (error?.response?.data?.error) {
                  const errors = Object.values(error?.response?.data?.error)
                  console.log('Errors', errors)
                  errors.map((x) => (
                    toast.error(`${x}`)
                  ))
                }
                if (error?.response?.data?.message) {
                  toast.error(`${error?.response?.data?.message}`)
                }
              }
            }
          }
          }>
            <FiLayers size={30} className='bg-gray-800 text-white m-1 w-6 p-1 h-6 hover:cursor-pointer' color='white'/>
          </button>
          </div>
        ),
        sortable: false,
        allowOverflow: true
      },
    ]
    
    console.log("archive data", archiveData)
  const filteredData = archiveData && archiveData?.filter((data)=>data?.full_name?.toLowerCase().includes(search))
  
    return (
      <div>
        <ToastContainer position="top-center" />
        {
          showApiErrorPopUp?
          <ApiErrorPopUp setModal={setShowApiErrorPopUp} error={apiError}/>:null
        }

  
        <div className="mt-4 px-4 border border-gray-800 border-t-4 bg-white mx-4">
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="py-3 flex justify-end pr-2">
                <div className="relative max-w-xs flex items-center justify-end">
                  <label htmlFor="hs-table-search" className="px-2">
                    Search:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-3 border text-sm border-gray-300 rounded-md "
                    placeholder="Search..."
                    onChange={(e)=>setSearch(e.target.value.toLowerCase())}
                  />
                </div>
              </div>
              <div className="lg:p-1.5  mb-4 pt-2 w-full inline-block align-middle">
                <div className="overflow-hidden border  rounded-lg">
                  <Table columns={tableHeading} data={filteredData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CandidateStore