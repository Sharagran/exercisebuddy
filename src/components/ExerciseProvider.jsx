import React, { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";

import { Outlet } from "react-router-dom";

const ExerciseContext = createContext();

function ExerciseProvider() {
    const [exercises, setExercises] = React.useState([]);
    const [finishedLoading, setFinishedLoading] = React.useState(false);

    function fetchExercises() {
        console.log('fetching exercises');
        return new Promise((resolve, reject) => {
            axios.get('/exercises').then(res => {
                console.log(`fetched ${res.data.length} exercises`); //FIXME: debug only, toast notifications instead?
                setExercises(res.data);
                setFinishedLoading(true);
                resolve(res.data);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    function getExercise(id) {
        return exercises.find(e => e._id === id);
    }

    function reloadExercise(id) {
        console.log('reloading exercise');
        return new Promise((resolve, reject) => {
            axios.get(`/exercises/${id}`).then(res => {
                // override old exercise with new one
                setExercises(exercises.map(e => e._id === id ? res.data : e));
                resolve(res.data);
            }).catch(reject);
        });
    }

    function createExercise(exercise) {
        return new Promise((resolve, reject) => {
            axios.post('/exercises', exercise).then(resolve).catch(reject);
        });
    }

    function updateExercise(exercise) {
        return new Promise((resolve, reject) => {
            axios.patch(`/exercises`, exercise).then(resolve).catch(reject);
        });
    }

    function deleteExercise(id) {
        return new Promise((resolve, reject) => {
            // request delete from server
            axios.delete(`/exercises`, {
                data: {
                    _id: id
                }
            }).then(res => {
                // remove deleted exercise from state
                setExercises(exercises.filter(e => e._id !== id));

                resolve(res);
            }).catch(reject);
        });
    }

    useEffect(() => {
        fetchExercises();
    }, [])

    const contextValue = {
        exercises,
        finishedLoading,

        getExercise,
        reloadExercises: fetchExercises,
        reloadExercise,

        createExercise,
        updateExercise,
        deleteExercise
    };

    return (
        <ExerciseContext.Provider value={contextValue}>
            <Outlet />
        </ExerciseContext.Provider>
    )
}

export {
    ExerciseProvider
};

export default ExerciseContext;
