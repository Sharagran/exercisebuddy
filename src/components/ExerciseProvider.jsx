import React, { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";

import { Outlet } from "react-router-dom";

const { Provider, Consumer } = createContext();

function ExerciseProvider() {

    const [exercises, setExercises] = React.useState([]);

    function fetchExercises() {
        console.log('fetching exercises');
        // axios.defaults.headers.common['Authorization'] = '69bf11e1';
        axios.get('/exercises').then(res => {
            console.log(res.data); //FIXME: debug only
            setExercises(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        fetchExercises();
    }, [])
    

    return (
        <Provider value={exercises}>
            <Outlet />
        </Provider>
    )
}



export {
    ExerciseProvider,
    Consumer as ExerciseConsumer
};
