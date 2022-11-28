import React, { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";

import { Outlet } from "react-router-dom";

const ExerciseContext = createContext();

function ExerciseProvider() {
    const [exercises, setExercises] = React.useState([]);

    function fetchExercises() {
        console.log('fetching exercises');
        axios.get('/exercises').then(res => {
            console.log(`fetched ${res.data.length} exercises`); //FIXME: debug only, toast notifications instead?
            setExercises(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

    function getExercise(id) {
        return exercises.find(e => e._id === id);
    }

    function reloadExercise(id) {
        console.log('reloading exercise');
        axios.get(`/exercises/${id}`).then(res => {
            // override old exercise with new one
            setExercises(exercises.map(e => e._id === id ? res.data : e));
        })
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
        getExercise,
        reloadExercises: fetchExercises,
        reloadExercise,

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
