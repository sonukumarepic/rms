import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import { FaEye, FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import axios from "axios";
import AddErfData from "./AddErfData";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GrStatusGood } from "react-icons/gr";
import { AiFillCloseCircle, AiFillMail } from "react-icons/ai";
import Swal from "sweetalert2";

const ErfGroup = ({ setEditErfData, erfList, getERFList }) => {
  const [erfData, setErfData] = useState("");
  const [erfId, setErfId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [recruitmentType, setRecruitmentType] = useState("");
  const navigate = useNavigate();

  const data = JSON.parse(localStorage.getItem("data"));
  const permission = data && data?.data?.roles[0]?.permissions;
  // console.log('roles',permission.filter(x=>x?.permission_id===14))

  useEffect(() => {
    if (erfList?.length > 0) {
      setErfData(erfList);
    }
  }, [erfList]);

  console.log("erfdata", erfData);

  const sendApprovalStatus = async (e, row) => {
    setApprovalStatus(e.target.value);
    try {
      const request = await axios.post(
        `${process.env.REACT_APP_API_URL}jobs/approveal/${row?.id}`,
        { data: "" },
        {
          headers: {
            Authorization: `Bearer ${data?.access_token}`,
            Accept: "application/json",
          },
        }
      );
      const response = await request?.data;
      // console.log("response",response)
      if (response?.code === 200) {
        toast.success(response?.message);
        erfList();
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

  const handleStatusChange = async (e, row) => {
    console.log("event", e);
    // console.log('row',row)
    try {
      const body = { status: e.target?.checked === true ? 1 : 2 };
      const request = await axios.post(
        `${process.env.REACT_APP_API_URL}job/${row?.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${data?.access_token}`,
            Accept: "application/json",
          },
        }
      );
      const response = await request?.data;
      // console.log("response",response)
      if (response?.code === 200) {
        getERFList();
        toast.success(`${response?.message}`);
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

  const tableHeading = [
    {
      name: <div className="text-sm font-medium">PID</div>,
      selector: (row) => <p title={row?.pid}>{row?.pid}</p>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Project Name</div>,
      selector: (row) => row.project_name,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Type</div>,
      selector: (row) => (
        <div className=" capitalize">
          {row.recruitment_type === "inhouse" ? "Inhouse" : "Project"}
        </div>
      ),
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Billable</div>,
      selector: (row) => <div className=" capitalize">{row.billable_type}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Department</div>,
      selector: (row) => (
        <p title={row?.department?.name} className=" capitalize">
          {row.department?.name}
        </p>
      ),
      sortable: false,
    },
    // {
    //   name: <div className='text-sm font-medium'>Created</div>,
    //   selector: row => <div className=' capitalize'>{row.department?.name}</div>,
    //   sortable: false,
    // },
    // {
    //   name: <div className='text-sm font-medium'>Requisition Date</div>,
    //   selector: row => <div className=' capitalize'>{row.start_date}</div>,
    //   sortable: false,
    // },
    // {
    //   name: <div className='text-sm font-medium'>Target Date</div>,
    //   selector: row => <div className=' capitalize'>{row.end_date}</div>,
    //   sortable: false,
    // },
    {
      name: <div className="text-sm font-medium">Approval</div>,
      selector: (row) => (
        <div>
          {row?.status === "3" ? (
            <div>
              <span className="px-4 py-[6px] rounded-2xl bg-green-600 hover:bg-green-800 cursor-pointer text-white">
                Approved
              </span>
            </div>
          ) : row?.status === "2" ? (
            <span className=" text-blue-500">Link Sent</span>
          ) : row?.status === "4" ? (
            <span className=" text-red-500">Rejected</span>
          ) : row?.status === "0" ? (
            <span className=" text-yellow-500">Approval awaited</span>
          ) : row?.status === "1" ? (
            <span>&nbsp;</span>
          ) : (
            <div className=" capitalize">{row?.approved}</div>
          )}
        </div>
      ),
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Action</div>,
      selector: (row) => (
        <>
          {data && data?.data?.userPermissions?.includes("view_jobs") ? (
            <div className="flex justify-center">
              {row?.erfstatus === 0 ? (
                <span className="text-red-500">ERF Closed</span>
              ) : (
                <>
                  {row?.erfstatus !== 2 ? (
                    row?.status === "4" || row?.status === "0" ? (
                      <div className="group flex items-center">
                        <button
                          onClick={async () => {
                            if (row?.jobrecruitment?.length > 0) {
                              console.log("row", row);
                              const request = await axios.get(
                                `${process.env.REACT_APP_API_URL}jobs/approveal/${row?.id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${data?.access_token}`,
                                    Accept: "application/json",
                                  },
                                }
                              );
                              const response = await request?.data;
                              if (response?.code === 200) {
                                toast.success(`${response?.message}`);
                                erfList();
                              }
                            } else {
                              toast.warn("Kindly add some leads.!");
                            }
                          }}
                        >
                          <div className="relative text-center  rounded-sm">
                            <div className="group no-underline cursor-pointer relative inline-block text-center">
                              <AiFillMail
                                size={26}
                                className="hover:bg-white p-1 mr-1 text-xl"
                              />
                              <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                                Send Email
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    ) : null
                  ) : null}
                  {row?.status !== "4" ? (
                    <>
                      <div className="group flex items-center">
                        {row?.erfstatus !== 2 ? (
                          data &&
                          data?.data?.userPermissions?.includes("add_lead") ? (
                            <button
                              onClick={() => {
                                setErfId(row?.id);
                                setRecruitmentType(row?.recruitment);
                                setShowAddModal(true);
                              }}
                            >
                              <div className="relative text-center  rounded-sm">
                                <div className="group no-underline cursor-pointer relative inline-block text-center">
                                  <FaPlusCircle
                                    size={26}
                                    className="hover:bg-white p-1 mr-1 text-xl"
                                  />
                                  <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                                    Add Leads
                                  </div>
                                </div>
                              </div>
                            </button>
                          ) : null
                        ) : null}
                      </div>

                      {row?.status === "3" ||
                      row?.status === "1" ||
                      (data && data?.data?.roles[0]?.name === "admin") ? (
                        <div className="group flex items-center">
                          <button
                            onClick={() => {
                              navigate("/admin/viewnewerf", { state: row });
                            }}
                          >
                            <div className="relative text-center  rounded-sm">
                              <div className="group no-underline cursor-pointer relative inline-block text-center">
                                <FaEye
                                  size={30}
                                  className="hover:bg-white p-1 mr-1 text-xl"
                                />
                                <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                                  View Leads
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      ) : null}
                      {data &&
                      data?.data?.userPermissions?.includes("delete_jobs") ? (
                        <div className="group flex items-center">
                          <button
                            onClick={async () => {
                              Swal.fire({
                                title: "Are you really want to close ERF?",
                                // text: "After closing the ERF all related data would be deleted and can not retrive. So before deleting make sure you have back up all related data.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Yes, close it!",
                                cancelButtonText: "No, cancel!",
                                denyButtonText: "Hold ERF.!",
                                showDenyButton: true,
                                reverseButtons: true,
                              }).then(async (result) => {
                                if (result.isConfirmed) {
                                  try {
                                    const body = { status: 2 };
                                    const request = await axios.post(
                                      `${process.env.REACT_APP_API_URL}job/${row?.id}`,
                                      body,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${data?.access_token}`,
                                          Accept: "application/json",
                                        },
                                      }
                                    );
                                    const response = await request?.data;
                                    // console.log("response",response)
                                    if (response?.code === 200) {
                                      getERFList();
                                      Swal.fire("Closed!", "", "success");
                                      // toast.success(`${response?.message}`)
                                    }
                                  } catch (error) {
                                    console.log("error", error);
                                    if (error?.response?.data?.error) {
                                      const errors = Object.values(
                                        error?.response?.data?.error
                                      );
                                      console.log("Errors", errors);
                                      errors.map((x) => toast.error(`${x}`));
                                    }
                                    if (error?.response?.data?.message) {
                                      if (error?.response?.data?.error) {
                                        const errors = Object.values(
                                          error?.response?.data?.error
                                        );
                                        console.log("Errors", errors);
                                        errors.map((x) => toast.error(`${x}`));
                                      }
                                      if (error?.response?.data?.message) {
                                        toast.error(
                                          `${error?.response?.data?.message}`
                                        );
                                      }
                                    }
                                  }
                                } else if (result.isDenied) {
                                  try {
                                    const body = { status: 2 };
                                    const request = await axios.post(
                                      `${process.env.REACT_APP_API_URL}job/${row?.id}`,
                                      body,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${data?.access_token}`,
                                          Accept: "application/json",
                                        },
                                      }
                                    );
                                    const response = await request?.data;
                                    // console.log("response",response)
                                    if (response?.code === 200) {
                                      getERFList();
                                      Swal.fire("Hold!", "", "success");
                                      // toast.success(`${response?.message}`)
                                    }
                                  } catch (error) {
                                    console.log("error", error);
                                    if (error?.response?.data?.error) {
                                      const errors = Object.values(
                                        error?.response?.data?.error
                                      );
                                      console.log("Errors", errors);
                                      errors.map((x) => toast.error(`${x}`));
                                    }
                                    if (error?.response?.data?.message) {
                                      if (error?.response?.data?.error) {
                                        const errors = Object.values(
                                          error?.response?.data?.error
                                        );
                                        console.log("Errors", errors);
                                        errors.map((x) => toast.error(`${x}`));
                                      }
                                      if (error?.response?.data?.message) {
                                        toast.error(
                                          `${error?.response?.data?.message}`
                                        );
                                      }
                                    }
                                  }
                                } else if (
                                  /* Read more about handling dismissals below */
                                  result.dismiss === Swal.DismissReason.cancel
                                ) {
                                  Swal.fire("Cancelled", "", "error");
                                }
                              });
                            }}
                          >
                            <div className="relative text-center  rounded-sm">
                              <div className="group no-underline cursor-pointer relative inline-block text-center">
                                <AiFillCloseCircle
                                  size={30}
                                  className="hover:bg-white p-1 mr-1 text-xl"
                                />
                                <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                                  Close ERF
                                </div>
                              </div>
                            </div>
                          </button>
                          <div></div>
                        </div>
                      ) : null}

                      {data?.data?.roles[0]?.name === "admin" ||
                      data?.data?.roles[0]?.name === "ERF Generator" ? (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex items-center cursor-pointer">
                            <div className="relative text-center  rounded-sm">
                              <div className="group no-underline cursor-pointer relative inline-block text-center">
                                <div className="relative mt-1">
                                  <input
                                    type="checkbox"
                                    onChange={(e) => handleStatusChange(e, row)}
                                    defaultChecked={
                                      row?.erfstatus === 1 ? true : false
                                    }
                                    className="sr-only"
                                  />
                                  <div className="block bg-primary w-10 h-6 rounded-full"></div>
                                  <div className="dot absolute left-1 top-1 bg-white text-white w-4 h-4 rounded-full transition">
                                    {row?.erfstatus === 1 ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M4.5 12.75l6 6 9-13.5"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="red"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`opacity-0 w-28 ${
                                    row?.erfstatus === 2
                                      ? "bg-red-600"
                                      : "bg-primary"
                                  } text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none`}
                                >
                                  {row?.erfstatus === 1
                                    ? "ERF Running"
                                    : row?.erfstatus === 2
                                    ? "ERF Hold"
                                    : "ERF Closed"}
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </>
      ),
      sortable: false,
      allowOverflow: true,
      width: "full",
    },
  ];

  const filteredData =
    erfData &&
    erfData?.filter((data) =>
      data?.project_name?.toLowerCase().includes(search)
    );

  // console.log('erfdata',erfData)

  return (
    <div>
      <ToastContainer position="top-center" />
      {showAddModal ? (
        <AddErfData
          recruitmentType={recruitmentType}
          setShowAddModal={setShowAddModal}
          erfId={erfId}
        />
      ) : null}
      <h2 className="text-xl border-gray-300">ERF List</h2>
      <div>
        <div className="py-4 border-t">
          <div>
            {/* <h3>Name <span className='px text-red-500'>*</span></h3> */}
            <input
              type="text"
              className="p-1 border-b border-gray-300"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <div></div>
          </div>
        </div>
        <div className=" lg:p-1.5  pb-6 w-full">
          <div className="overflow-hidden text-[14px]">
            <Table data={filteredData} columns={tableHeading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErfGroup;
