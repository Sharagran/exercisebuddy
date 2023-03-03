import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Spinner, Button } from 'react-bootstrap';


import MyPagination from '../components/MyPagination';
import Search from '../components/Search';
import ExerciseContext from '../components/ExerciseProvider';
import ExerciseTable from '../components/ExerciseTable';
import ViewData from '../components/ViewData';


const PAGE_SIZE = 20;

export default function Overview() {
    let navigate = useNavigate();
    const { exercises, finishedLoading } = React.useContext(ExerciseContext);
    const { viewData, setViewData } = ViewData(exercises);
    const [page, setPage] = useState(1);

    const [sortKey, setSortKey] = useState('score');
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        setViewData(exercises);
    }, [finishedLoading])

    useEffect(() => {
        // prevent page from being set higher than the max page
        let page_count = Math.ceil(viewData.length / PAGE_SIZE);
        if (viewData.length < PAGE_SIZE) {
            setPage(1);
        } else if (page > page_count) {
            setPage(page_count);
        }
    }, [viewData]);

    return (
        <>
            <div>
                <Search exercises={exercises} setExerciseView={setViewData} sortOptions={{ sortKey, sortAsc }} />
                <span>Search parameters reduced result by {Math.abs(viewData.length - exercises.length)} exercises</span>
            </div>
            <hr />
            <div class="d-flex justify-content-between align-items-start">
                <h3>Exercises</h3>
                {/* <MyPagination dataSize={viewData.length} currentPage={page} setPage={setPage} PAGE_SIZE={PAGE_SIZE} /> */}
                <Button onClick={() => { navigate('/exercise/create') }}>Create new exercise</Button>
            </div>
            <ExerciseTable
                data={viewData}
                dataKeys={['title', 'description', 'createdAt', 'updatedAt', 'link', 'difficulty', 'set', 'repetition', 'duration', 'pause', 'complaintsAreas', 'equipment']}
                page={page}
                itemsPerPage={PAGE_SIZE}
                onClick={(args) => {
                    if (args.target.tagName !== 'A') {
                        let id = args.target.closest('tr').id;
                        navigate(`/exercise/${id}`);
                    }
                }}
                sortOptions={
                    {
                        sortKey,
                        sortAsc,
                        setSortKey,
                        setSortAsc
                    }
                } />

            <div className='d-flex justify-content-center'>
                {!finishedLoading && <Spinner animation="border" />}
            </div>
            <MyPagination dataSize={viewData.length} currentPage={page} setPage={setPage} PAGE_SIZE={PAGE_SIZE} />
        </>
    )
}
