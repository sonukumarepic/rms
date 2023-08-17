import React, { useEffect, useState } from 'react'
import ErfNewForm from './ErfNewForm'
import ErfGroup from './ErfGroup'
import axios from 'axios'

const Index = () => {
  const [editErfData,setEditErfData] = useState('')
  const [erfData,setErfData] = useState('')
  const localData = JSON.parse(localStorage.getItem('data'))
  const permission = localData&& localData?.data?.roles[0]?.permissions
  // console.log('roles',permission)

  const getErfData = async()=>{
    const request = await axios.get(`${process.env.REACT_APP_API_URL}erf`,{
        headers:{
            'Authorization':`Bearer ${localData?.access_token}`,
            'Accept':'application/json'
        }
    })
    const response = await request?.data
    // console.log("erf list",response)
    if(response?.code === 200){
        if(localData?.data?.roles[0]?.name==="admin")
        {
          setErfData(response?.data)
        }
        if(localData?.data?.userPermissions?.find(x=>x?.includes('view_job_applications'))){
          setErfData(response?.data)
        }
        else{
          // const filterData =response?.data?.filter(x=>parseInt(x?.user_id)===parseInt(localData?.data?.id) || x?.jobassigned?.filter((y)=>parseInt(y?.user_id)===localData?.data?.id))
          const filterData=response?.data?.filter(x =>
            parseInt(x?.user_id) === parseInt(localData?.data?.id) ||
            x?.jobassigned?.some(y => parseInt(y?.user_id) === localData?.data?.id)
          )
          setErfData(filterData)
        }
    }
  }

  useEffect(()=>{
    getErfData()
    document.title='CIPLCRM | ERF'
  },[])



  return (
    <div className='w-full p-2'>
      <div className="lg:p-1.5 pb-6 pt-2 w-full inline-block align-middle">
        <div className='grid grid-cols-1'>
            {
              permission && permission.filter(x=>x?.permission_id===14).length>0?
              <div className='col-span-1 lg:col-span-1 border border-primary p-3 bg-white h-fit rounded-sm border-t-4 shadow'>
              <ErfNewForm editErfData={editErfData} getERFList={getErfData}/>
          </div>
              :null
            }
            {
            permission && permission.filter(x=>x?.permission_id===15).length>0?
          <div className='col-span-1 mt-4 lg:col-span-2 border border-primary p-3 bg-white h-fit min-h-52 rounded-sm border-t-4 shadow'>
            <ErfGroup setEditErfData={setEditErfData} erfList={erfData} getERFList={getErfData}/>
          </div>
          :null
            }
        </div>
      </div>
    </div>
  )
}

export default Index