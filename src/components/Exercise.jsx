import React from 'react'
import { useParams } from "react-router-dom";

import dummy_data from '../dummy_data/exercises_new.json';

export default function Exercise() {

    let params = useParams();
    var exercise;

    function getExercise() {
        exercise = dummy_data.find(exercise => exercise._id === params.id);
    }

    function deleteExercise() {

    }

    function updateExercise() {

    }

    getExercise();

    // TODO: recursive function to map exercise data to JSX (id as key)
    return (
        <>
            <h1>Exercise: {exercise._id}</h1>
            <p>{exercise.title}</p>
            <p>{exercise.description}</p>
            <p>{exercise.createdAt}</p>
            <p>{exercise.updatedAt}</p>
            <p>{exercise.link}</p>
            <p>{exercise.neededReps}</p>
            <p>{exercise.neededDuration}</p>

            {exercise.poses.map((pose, index) => (
                <div key={pose._id}>
                    <h2>Pose: {pose._id}</h2>
                    {pose.requirements.map((requirement, index) => (
                        <div key={requirement._id}>
                            <h3>Requirement: {requirement._id}</h3>
                            <p>{requirement.requiredAngle}</p>
                            <p>{requirement.angleThreshold}</p>
                            <div key={requirement.bodyJoint._id}>
                                <h4>Body Joint: {requirement.bodyJoint._id}</h4>
                                <p>{requirement.bodyJoint.label}</p>
                                <p>{requirement.bodyJoint.firstEdgeIndex}</p>
                                <p>{requirement.bodyJoint.secondEdgeIndex}</p>
                                <p>{requirement.bodyJoint.desiredAngle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </>
    )
}
