import axios from 'axios'
import Select from 'react-select'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

const AddSubQualification = () => {
  const navigate = useNavigate()
  const [qualificationList, setQualificationList] = useState('')
  const [subQualification, setSubQualification] = useState('')
  const [qualification, setQualification] = useState('')
  const data = localStorage.getItem("data");
  const jsonData = JSON.parse(data);
  const location = useLocation()
  const accessToken = jsonData.access_token;
  const authorize = "Bearer" + " " + accessToken;
  const qualificationListApi = async () => {
    const requestQualification = await axios.get(`${process.env.REACT_APP_API_URL}qualification`, {
      headers: {
        'Authorization': `${authorize}`
      }
    })
    const qualificationResponse = await requestQualification.data
    // console.log('Categories', categoryResponse)
    if (qualificationResponse?.data.length > 0) {
      setQualificationList(qualificationResponse)
    }
  }
  useEffect(() => {
    qualificationListApi()
    document.title = "CIPLCRM | Add Specializations"
  }, [location])

  useEffect(() => {
    if (jsonData?.data?.userPermissions.find(a => a === "add_qualification")) {
      return
    } else {
      navigate('/admin')
    }

  }, [location])

  return (
    <div className="m-2 bg-white">
      <ToastContainer autoClose={3000} position='top-center' />
      <div className="rounded border shadow-md p-4">
        <h4 className="card-title mb-4 text-2xl font-medium">Create New</h4>

        <form >
          <div className="row">
            <div className="col-md-9">
              <div className="form-group">
                <label htmlFor="address" className="text-xl font-medium">Specialization:</label>
                <Select
                  options={qualificationList?.data?.map((qualification) => ({
                    "value": qualification?.id,
                    "label": qualification?.name
                  }))}
                  onChange={(e) => setQualification(e.value)}
                  isMulti={false}
                  isClearable
                  className="block lg:w-2/3 w-full py-1 px-1 my-2 rounded-md border "
                />
              </div>
            </div>
          </div>

          <div id="education_fields">
            <div className="row">
              <div className="col-sm-9 nopadding">
                <div className="form-group">
                  <div className="input-group">
                    <div className="lg:w-2/3 w-full flex items-center">
                      <input
                        type="text"
                        className="border rounded-md w-full px-2 py-3 rounded-r-none"
                        placeholder="Add New Specialization Name"
                        onChange={(e) => setSubQualification(e.target.value)}
                      />
                      {/* <button className="border-l-0 border hover:bg-green-500 bg-green-700 rounded-l-none rounded-tl-0 rounded-md">
                       <FiPlus className="text-5xl text-white py-1" />
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" id="" className="flex my-4 px-8 py-2 rounded text-white bg-green-700 hover:bg-green-500"
            onClick={async () => {
              try {
                const request = await fetch(`${process.env.REACT_APP_API_URL}subqualification/store`, {
                  headers: {
                    'Authorization': `${authorize}`,
                    "Content-type": "application/json; charset=UTF-8",
                  },
                  method: "post",
                  body: JSON.stringify({
                    name: `${subQualification}`,
                    qualification_id: `${qualification}`
                  })
                })
                const response = await request?.json()
                if (response?.code === 200) {
                  toast.success(`${response?.message}`)
                  setTimeout(() => {
                    navigate('/admin/subqualification')
                  }, 3000);
                  clearTimeout()
                }      
                if(response?.error){
                  const errors = Object.values(response?.error)
                  console.error('Errors', errors)
                  errors.map((x) => (
                    toast.error(`${x}`)
                  ))
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
            }}
          >
            <span className="text-xl font-medium">Save</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSubQualification