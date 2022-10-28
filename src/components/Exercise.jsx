import React from 'react'
import { useParams } from "react-router-dom";

import dummy_data from '../dummy_data/exercises_new.json';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useEffect } from 'react';
import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function Exercise({ exercises }) {

    let params = useParams();
    const [exercise, setExercise] = useState({});

    function getExercise() {
        // exercise = dummy_data.find(exercise => exercise.id === Number(params.id));
        if(exercises.length > 0) {
            setExercise(exercises.find(e => e._id === params.id));
        }
    }

    function deleteExercise() {

    }

    function updateExercise() {

    }

    function exerciseToHTML(exercise) {
        // map object properties to HTML
        var content = [];
        for (const [key, value] of Object.entries(exercise)) {
            if(key === "_id") {
                continue;
            }
            if (Array.isArray(value)) {
                // recursion to iterate over array
                content.push(<>
                    <h3>{key}</h3>
                    <div className='testDiv' style={{
                        border: '1px solid black',
                        padding: '32px'
                    }}>
                        {exerciseToHTML(value)}
                    </div>
                </>);
            } else if (typeof value === 'object') {
                // recursion to iterate through object
                content.push(<>
                    {Number.isNaN(Number.parseInt(key)) && <h3>{key}</h3>}
                    <div className='testDiv' style={{
                        border: '1px solid black',
                        padding: '32px'
                    }}>
                        {exerciseToHTML(value)}
                    </div>
                </>);
            } else {
                // render property
                content.push(<p>{key}: {value}</p>);
            }
        }
        return content;
    }

    useEffect(() => {
        getExercise();
    }, [exercises])
    

    // TODO: recursive function to map exercise data to JSX (id as key)
    return <>
    {/* {exerciseToHTML(exercise)} */}

    {exercises.length > 0 ? <>
    <h2>{exercise.title}</h2>
    <p>{exercise.description}</p>

    <button onClick={deleteExercise}>Delete</button>
    <button onClick={updateExercise}>Update</button>
    </>
    : <Spinner animation="border" role="status" />
    }
    
    </>;
}
