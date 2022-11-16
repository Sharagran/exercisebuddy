import React from 'react'
import { useParams } from "react-router-dom";

import dummy_data from '../dummy_data/exercises_new.json';
import { useEffect, useState } from 'react';
// import Stickman from './Stickman';

import Badge from 'react-bootstrap/Badge';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';

import { ExerciseConsumer } from '../components/ExerciseProvider';

export default function Exercise() {

    let params = useParams();
    // const [exercise, setExercise] = useState({});

    function getExercise(exercises) {
        // exercise = dummy_data.find(exercise => exercise.id === Number(params.id));
        if (exercises.length > 0) {
            // setExercise(exercises.find(e => e._id === params.id));
            return exercises.find(e => e._id === params.id);
        }
    }

    function deleteExercise() {
        console.log("delete exercise");
    }

    function updateExercise() {
        console.log("update exercise");
    }

    function exerciseToHTML(exercise) {
        // map object properties to HTML
        var content = [];
        for (const [key, value] of Object.entries(exercise)) {
            if (key === "_id") {
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

    return <ExerciseConsumer>
        {exercises => {
            // TODO: display error when loading failed: try catch in use effect with multiple returns?
            if (exercises.length === 0) {
                // display placeholder while loading
                return (
                    <>
                        <h2><Placeholder xs={6} /></h2>
                        <p><Placeholder xs={6} /></p>

                        <p>Difficulty: <Placeholder xs={1} /></p>
                        <p>Equipment: <Placeholder xs={3} /></p>
                        <p>Set: <Placeholder xs={1} /></p>
                        <p>Repetition: <Placeholder xs={1} /></p>
                        <p>Duration: <Placeholder xs={1} /></p>
                        <p>Pause: <Placeholder xs={1} /></p>

                        <Placeholder.Button variant='primary' xs={1} />
                        <Placeholder.Button variant='danger' xs={1} />
                    </>
                )
            } else {
                const exercise = getExercise(exercises);
                return (<>
                    {/* TODO: dynamic generate input fields for exercise data (from json schema)[input type text, number, etc.] */}

                    <h2>{exercise.title} <a target="_blank" rel="noopener noreferrer" href={exercise.link}><Badge bg="secondary">open external</Badge></a></h2>
                    <p>{exercise.description}</p>
                    <img src={exercise.image} alt="" />
                    {/* <video width="320" height="240" controls>
        <source src={exercise.video} type="video/mp4" />
        Your browser does not support the video tag.
    </video> */}

                    {/* <Stickman /> */}

                    <p>Difficulty: {exercise.difficulty}</p>
                    <p>Equipment: {exercise.equipment}</p>
                    <p>Set: {exercise.set}</p>
                    <p>Repetition: {exercise.repetition}</p>
                    <p>Duration: {exercise.duration}</p>
                    <p>Pause: {exercise.pause}</p>
                    <p>Diagnoses: {exercise.diagnoses}</p>

                    <p>createdAt: {exercise.createdAt}</p>
                    <p>updatedAt: {exercise.updatedAt}</p>

                    <Button variant='primary' onClick={updateExercise}>Update</Button>
                    <Button variant='danger' onClick={deleteExercise}>Delete</Button>
                </>)
            }
        }}
    </ExerciseConsumer>;
}
