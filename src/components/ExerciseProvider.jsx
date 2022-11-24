import React, { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";

import { Outlet } from "react-router-dom";

const ExerciseContext = createContext();

function ExerciseProvider() {
    const [exercises, setExercises] = React.useState([]);

    function fetchExercises() {
        console.log('fetching exercises');
        // axios.defaults.headers.common['Authorization'] = '69bf11e1';
        axios.get('/exercises').then(res => {
            console.log(`fetched ${res.data.length} exercises`); //FIXME: debug only
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
    }

    function updateExercise(exercise) {
        console.log('updating exercise');
    }

    function deleteExercise(id) {
        console.log('deleting exercise');
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
