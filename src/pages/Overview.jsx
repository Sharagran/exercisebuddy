import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Table, Spinner, Button } from 'react-bootstrap';

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';
import ExerciseContext from '../components/ExerciseProvider';
import MyTable from '../components/MyTable';



const PAGE_SIZE = 20;

export default function Overview() {
    let navigate = useNavigate();
    const { exercises, finishedLoading } = React.useContext(ExerciseContext);
    const [exerciseView, setExerciseView] = useState(exercises);
    const [page, setPage] = useState(1);

    const [sortKey, setSortKey] = useState('score');
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        setExerciseView(exercises);
    }, [finishedLoading])


    return (
        <>
            <Search exercises={exercises} setExerciseView={setExerciseView} sortOptions={{sortKey, sortAsc}} />
            {/* TODO: display applied filter & reduction of search results */}
            <span>Search parameters reduced result by {Math.abs(exerciseView.length - exercises.length)} exercises</span>

            <hr />
            <h3>Exercises</h3>
            <Button onClick={() => { navigate('/exercise/create') }}>Create new exercise</Button>
            <MyTable data={exerciseView} tableKeys={['title', 'description', 'createdAt', 'updatedAt', 'link', 'repetition', 'duration']}
            page={page} itemsPerPage={PAGE_SIZE} onClick={(args) => {
                if (args.target.tagName !== 'A') {
                    navigate(`/exercise/${args.target.parentElement.id}`);
                }
            }} sortOptions={
                {
                    sortKey,
                    sortAsc,
                    setSortKey,
                    setSortAsc
                }
            } />
            <div style={{
                margin: "auto",
                width: "50%",
                textAlign: "center"
            }}>
                {!finishedLoading && <Spinner animation="border" />}
                <MyPagination dataSize={exerciseView.length} currentPage={page} setPage={setPage} PAGE_SIZE={PAGE_SIZE} />
            </div>
        </>
    )
}
