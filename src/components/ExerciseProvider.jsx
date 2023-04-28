import React, { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";

import { Outlet } from "react-router-dom";

import toast from 'react-hot-toast';

import useToken from "./useToken";
import AuthContext from "./AuthProvider";

const ExerciseContext = createContext();

function ExerciseProvider() {
    const [exercises, setExercises] = React.useState([]);
    const [finishedLoading, setFinishedLoading] = React.useState(false);

    const { signOut } = React.useContext(AuthContext);
    const { token, setToken } = useToken();

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

                if (err.response.status === 401) {
                    toast.error('Login expired, please log in again.');
                    signOut();

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }

                reject(err);
            });
        });
    }

    function getExercise(id) {
        return exercises.find(e => e._id === id);
    }

    function fetchExercise(id) {
        return new Promise((resolve, reject) => {
            axios.get(`/exercises/${id}`).then(res => {
                resolve(res.data);
            }).catch(reject);
        });
    }

    function reloadExercise(id) {
        return new Promise((resolve, reject) => {
            axios.get(`/exercises/${id}`).then(res => {
                // override old exercise with new one
                setExercises(exercises.map(e => e._id === id ? res.data : e));
                resolve(res.data);
            }).catch(reject);
        });
    }

    function createExercise(exercise) {
        // remove empty strings from exercise to prevent validation errors on server
        Object.keys(exercise).forEach(key => {
            if (exercise[key] === '') {
                delete exercise[key];
            }
        });

        return new Promise((resolve, reject) => {
            axios.post('/exercises', exercise).then((res) => {
                // add created exercise to state
                setExercises([...exercises, res.data]);
                resolve(res.data);
            }).catch(reject);
        });
    }

    function uploadExerciseMedia(id, formData) {
        return new Promise((resolve, reject) => {
            axios.put(`/exercises/${id}/media`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                // override old exercise with new one
                setExercises(exercises.map(e => e._id === id ? res.data : e));
                resolve(res.data);
            }).catch(reject);
        });
    }

    function deleteExerciseMedia(id, mediaSelection) {
        return new Promise((resolve, reject) => {
            axios.delete(`/exercises/${id}/media`, {
                data: {
                    ...mediaSelection
                }
            }).then(res => {
                // override old exercise with new one
                setExercises(exercises.map(e => e._id === id ? res.data : e));
                resolve(res.data);
            }).catch(reject);
        });
    }

    function updateExercise(exercise) {
        return new Promise((resolve, reject) => {
            axios.put(`/exercises`, exercise).then(resolve).catch(reject);
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

    function getSelectOptions(exerciseList = exercises) {
        // check if exerciseList is a fuse result (view data)
        if(exerciseList[0] && exerciseList[0].item) {
            exerciseList = exerciseList.map(exercise => exercise.item);
        }

        var complaintsAreas = [];
        var equipment = [];
        exerciseList.forEach(exercise => {
            if (exercise.complaintsAreas) {
                complaintsAreas = complaintsAreas.concat(exercise.complaintsAreas);
            }
            if (exercise.equipment) {
                equipment = equipment.concat(exercise.equipment);
            }
        });

        complaintsAreas = [...new Set(complaintsAreas)];
        equipment = [...new Set(equipment)];

        complaintsAreas = complaintsAreas.map(area => {
            return {
                value: area,
                label: area
            }
        });

        equipment = equipment.map(equipment => {
            return {
                value: equipment,
                label: equipment
            }
        });

        return {
            complaintsAreas,
            equipment
        }
    }

    useEffect(() => {
        fetchExercises();
    }, [])

    const contextValue = {
        exercises,
        finishedLoading,

        getExercise,
        fetchExercise,
        reloadExercises: fetchExercises,
        reloadExercise,

        createExercise,
        uploadExerciseMedia,
        deleteExerciseMedia,
        updateExercise,
        deleteExercise,

        getSelectOptions
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
