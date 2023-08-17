import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai";
import DataTable from "react-data-table-component";

const candidateUrl = `${process.env.REACT_APP_API_URL}candidatelist`;

const data = localStorage.getItem("data");
const jsonData = JSON.parse(data);
const accessToken = jsonData?.access_token;
const authorize = "Bearer" + " " + accessToken;

const Feedback = () => {
  const [serach, setSearch] = useState("");
  const [candidate, setCandidate] = useState([]);
  const [candidateback, setCandidateback] = useState([]);

  const [filterData, setFilterDate] = useState([]);

  const [interview, setInterview] = useState("interview round 1");

  localStorage.setItem("interview", JSON.stringify(interview));

  console.log(candidate);

  useEffect(() => {
    setFilterDate(
      candidate.filter((ele) => {
        return ele.totalrating[0].interviewround == interview;
      })
    );
  }, [interview]);

  const tableHeading = [
    {
      name: "Name of Candidate",
      selector: (row) => {
        return (
          <strong style={{ cursor: "pointer" }}>
            <Link to={`/admin/feedback/${row.id}`}>{row.full_name}</Link>
          </strong>
        );
      },
    },
    {
      name: "Position",
      selector: (row) =>
        row.totalrating.find((ele) => ele?.interviewround == interview)
          ?.interviewround && row?.recruitment?.degination,
    },
    {
      name: "Location",
      selector: (row) => {
        return (
          row.totalrating.find((ele) => ele?.interviewround == interview)
            ?.interviewround == interview && row.address
        );
      },
    },
    {
      name: "Status",
      selector: (row) => {
        return (
          row.totalrating.find((ele) => ele?.interviewround == interview)
            ?.interviewround == interview &&
          row.totalrating.find((ele) => ele?.interviewround == interview)
            ?.interviewround
        );
      },
    },
    {
      name: "Ratings",
      selector: (row) =>
        row.totalrating.find((ele) => ele?.interviewround == interview)
          ?.interviewround == interview &&
        row.totalrating.find((ele) => ele?.interviewround == interview)
          ?.tottal_rating,
    },
  ];

  useEffect(() => {
    document.title = "CIPLCRM | Interview Feedback";
  }, []);

  useEffect(() => {
    async function callApi() {
      try {
        const response = await fetch(candidateUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authorize}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data.data);
        setCandidate(data.data);
        setFilterDate(
          data.data.filter((ele) => {
            return ele.totalrating[0].interviewround == interview;
          })
        );
        setCandidateback(data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    callApi();
  }, []);

  const handleSearch = (e) => {
    setCandidate(
      candidate.filter((ele) =>
        ele.full_name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );

    if (e.target.value.length <= 1) {
      setCandidate(candidateback);
    }
  };

  return (
    <>
      <section>
        {/* <button className="px-2 flex bg-gray-800 hover:bg-slate-700 text-white m-2 py-2 items-center rounded ml-4">
          <span className="px-1">
            <AiFillPlusCircle />
          </span>
          <Link to={"/admin/Addfeedback"}>Add Interview Feedback</Link>
        </button> */}

        <div className="mt-4 px-4 border border-gray-800 border-t-4 bg-white mx-4">
          <div className="flex flex-col">
            <div className="flex">
              <button
                className={`px-2 flex ${
                  interview == "interview round 1"
                    ? "bg-green-600"
                    : "bg-gray-800"
                }  text-white m-2 py-2 items-center rounded`}
                onClick={() => setInterview("interview round 1")}
              >
                Interview 1
              </button>

              <button
                className={`px-2 flex ${
                  interview == "interview round 2"
                    ? "bg-green-600"
                    : "bg-gray-800"
                } text-white m-2 py-2 items-center rounded`}
                onClick={() => setInterview("interview round 2")}
              >
                Interview 2
              </button>
            </div>

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
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="lg:p-1.5  mb-4 pt-2 w-full inline-block align-middle">
                <div className="overflow-hidden border  rounded-lg">
                  <DataTable
                    columns={tableHeading}
                    data={filterData}
                    pagination
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Feedback;
